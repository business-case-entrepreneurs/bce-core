import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  Element,
  h,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { FileRef } from '../../models/file-ref';
import { FileStore } from '../../models/file-store';
import { FileManager } from '../../utils/file-manager';
import { BceFile } from '../../utils/bce-file';
import { ripple } from '../../utils/ripple';

// const UNSPLASH: IconDefinition = {
//   prefix: 'bce' as any,
//   iconName: 'unsplash' as any,
//   icon: [
//     122.4,
//     122.4,
//     [],
//     '',
//     'M122.4,54.1v68.3H0V54.1h38.6v34.1h45.3V54.1H122.4z M83.9,0H38.6v34.1h45.3V0z'
//   ]
// };

library.add(
  // FAS.faCloud,
  FAS.faFileAudio,
  FAS.faFileImage,
  FAS.faFileUpload,
  FAS.faFileVideo,
  FAS.faGlobe
  // UNSPLASH
);

@Component({
  tag: 'bce-upload',
  styleUrl: 'bce-upload.scss',
  shadow: true
})
export class Upload {
  @Element()
  private el!: HTMLBceUploadElement;

  @Prop({ reflect: true })
  public active?: boolean;

  @Prop({ reflect: true })
  public debug?: boolean;

  @Prop({ reflect: true })
  public dialog?: boolean;

  @Prop({ reflect: true })
  public disabled?: boolean;

  @Prop({ reflect: true })
  public error?: boolean;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  @Prop({ reflect: true })
  public height?: string;

  @Prop({ reflect: true })
  public info?: string;

  @Prop({ reflect: true })
  public label?: string;

  @Prop()
  public metadata?: any;

  @Prop({ reflect: true })
  public name?: string;

  @Prop()
  public store?: FileStore;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value: string[] = [];

  @Prop({ reflect: true })
  public width?: string;

  // #region Forwarded to native input[type='file']
  @Prop({ reflect: true })
  public accept?: string;

  @Prop({ reflect: true })
  public multiple = false;
  // #endregion

  @State()
  private _highlight = false;

  @State()
  private data: FileManager.Data = {};

  private _initialValue?: string[] = this.value;
  private _inputCreator = getInputCreator(this, err => (this.error = !!err));
  private _server = window.BCE.file;

  private get fileIcon() {
    switch (this.accept) {
      case 'audio/*':
        return 'file-audio';
      case 'image/*':
        return 'file-image';
      case 'video/*':
        return 'file-video';
      default:
        return 'file-upload';
    }
  }

  private handleData = (data: FileManager.Data | FileStore.Data) => {
    this.data = Object.keys(data).reduce((acc, id) => {
      const value = data[id];
      if ('file' in value) return { ...acc, [id]: value };

      const progress = value.progress === undefined ? 1 : value.progress;
      const file: FileRef = {
        hash: value.record.hash,
        id: value.claim.id,
        name: value.claim.name,
        type: value.record.type,
        url: value.record.url
      };

      return { ...acc, [id]: { file, progress } };
    }, {} as FileManager.Data);
  };

  private handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) return;

    this._highlight = true;
  };

  private handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) return;

    this._highlight = false;
  };

  private handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  private handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) return;

    this._highlight = false;
    ripple(event.target as HTMLElement, event);

    this.upload(event.dataTransfer!.files);
  };

  private handleUpload = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input || !input.files) return;

    this.upload(input.files);
    input.value = '';
  };

  // private handleUrl = async () => {
  //   if (this.disabled) return;

  //   const url = window.prompt();
  //   if (!url) return;

  //   // Download as blob
  //   const req = new Request(url);
  //   const res = await fetch(req);
  //   const blob = await res.blob();

  //   // Find filename
  //   const header = res.headers.get('content-disposition');
  //   const match = header?.match(/filename="(.+)"/);
  //   const name = match && match[1];
  //   const fallback = new URL(url).pathname.split('/').pop();

  //   // Download and use the file
  //   const file = this.toFile(blob, name || fallback || 'unnamed');
  //   this.upload([file]);
  // };

  private ignoreEvent = (event: Event) => {
    event.stopPropagation();
  };

  private triggerUpload = () => {
    if (this.disabled || (!this.multiple && this.value.length)) return;

    const input = this.el.shadowRoot!.querySelector('input');
    if (input) input.click();
  };

  @Method()
  public async cancel(id: string) {
    return this.store ? this.store.cancel(id) : this._server.cancel(id);
  }

  @Method()
  public async delete(id: string) {
    this.updateValue(this.value.filter(v => v !== id));
    return this.store
      ? this.store.delete(id)
      : this._server.delete(id, this.metadata);
  }

  @Method()
  public async download(id: string) {
    const value = this.data[id].file;
    if (!value) return;

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = value.url;
    a.download = value.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  @Method()
  public async rename(id: string, filename?: string) {
    const value = this.data[id].file;
    if (!value || value.name === filename) return;

    // Extract extension
    const regex = /\.[0-9a-z]+$/i;
    const match = value.name.match(regex);
    const ext = match && match[0];

    // Request new name
    const name = ext
      ? (filename?.replace(regex, '') || value.name) + ext
      : filename || value.name;

    return this.store
      ? this.store.rename(id, name)
      : this._server.rename(id, name);
  }

  @Method()
  public async upload(files: FileList) {
    if (!this.multiple && this.value.length) return;

    if (this.store) {
      const ids: string[] = [];

      for (const file of Array.from(files)) {
        const id = window.BCE.generateId();
        this.store.upload(id, file, this.metadata);
        ids.push(id);
      }

      this.updateValue([...this.value, ...ids], false);
      return;
    }

    // Ensure input is a BceFile array
    const converted = Array.from(files).map(f => this.toFile(f, f.name));

    // Filter files
    const tasks = converted.map(async file => {
      // Remove duplicates by comparing file hashes
      const hash = await file.hash();
      const list = this.value.map(id => this.data[id]).filter(Boolean);
      if (list.find(v => v && v.file.hash === hash)) return undefined;

      // Remove files with incorrect types
      const accept = this.accept || '*';
      const regexStr = accept.replace('*', '.*').replace(/\,/g, '|');
      if (!new RegExp(regexStr).test(file.type)) return undefined;

      // Accept file
      return file;
    });

    const filtered = (await Promise.all(tasks)).filter(Boolean) as BceFile[];
    const upload = this.multiple ? filtered : filtered.slice(0, 1);
    if (!upload.length) return;

    const { metadata } = this;
    this.updateValue([...this.value, ...upload.map(u => u.id)], false);
    const uploads = upload.map(file => this._server.upload(file, metadata));
    return Promise.all(uploads) as Promise<FileRef[]>;
  }

  @Watch('value')
  public watchValue(value: string[]) {
    if (this.store) this.store.subscribe(this.handleData, value);
    else this._server.subscribe(this.handleData, value);
  }

  private toFile(blob: Blob, name: string) {
    const id = window.BCE.generateId();
    return new BceFile(id, name, blob);
  }

  private updateValue(value: string[], sort = true) {
    this.value = sort
      ? value
          .map(id => this.data[id]?.file || { id, name: '' })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(ref => ref.id)
      : value;

    const e = new globalThis.Event('input', { bubbles: true, composed: true });
    this.el.dispatchEvent(e);
  }

  componentWillLoad() {
    this.watchValue(this.value);
  }

  disconnectedCallback() {
    this.store?.unsubscribe(this.handleData);
    this._server.unsubscribe(this.handleData);
  }

  renderPreview() {
    return this.value.map(id => {
      const item = this.data[id];
      const { file = id, progress = 1 } = item || {};

      return (
        <bce-upload-item
          disabled={this.disabled}
          progress={progress}
          value={file}
        />
      );
    });
  }

  renderDropzone() {
    const preview = !!this.value.length;
    const classes = { dropzone: true, highlight: this._highlight };

    return (
      <div
        class={classes}
        onClick={this.triggerUpload}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <div class="preview">{preview && this.renderPreview()}</div>
        <div class="placeholder" style={{ display: preview ? 'none' : '' }}>
          <bce-icon pre="fas" name={this.fileIcon}></bce-icon>
          <span>
            <slot>Drop a file here or click to select one.</slot>
          </span>
        </div>
      </div>
    );
  }

  renderOptions() {
    if (this.disabled || (!this.multiple && this.value.length)) return;

    return (
      <bce-select type="action">
        <bce-chip
          icon={`fas:${this.fileIcon}`}
          value="file"
          onClick={this.triggerUpload}
        >
          File
        </bce-chip>
        {/* <bce-chip icon="fas:globe" value="url" onClick={this.handleUrl}>
          URL
        </bce-chip>
        <bce-chip icon="fas:cloud" value="cloud">
          Cloud
        </bce-chip>
        <bce-chip icon="bce:unsplash" value="unsplash">
          Unsplash
        </bce-chip> */}
      </bce-select>
    );
  }

  renderDebug() {
    if (!this.debug) return;

    const value = JSON.stringify(this.value, undefined, 2);
    const data = JSON.stringify(this.data, undefined, 2);

    const code = [];
    if (value) code.push(`const VALUE = ${value};`);
    if (this.value.length) code.push('');
    if (data) code.push(`const DATA = ${data};`);
    if (Object.keys(data).length) code.push('');

    return <bce-code value={code} language="js" />;
  }

  renderContainer() {
    return (
      <div class="container">
        {this.renderDropzone()}
        {this.renderOptions()}
        {this.renderDebug()}
      </div>
    );
  }

  renderDialog() {
    return (
      <bce-dialog active={this.active} close-button>
        <h3>File Upload</h3>
        {this.renderContainer()}
      </bce-dialog>
    );
  }

  renderRegular() {
    const InputCreator = this._inputCreator;
    return <InputCreator>{this.renderContainer()}</InputCreator>;
  }

  render() {
    return [
      !this.dialog ? this.renderRegular() : this.renderDialog(),
      <input
        type="file"
        accept={this.accept}
        multiple={this.multiple}
        onInput={this.ignoreEvent}
        onChange={this.handleUpload}
        tabIndex={-1}
      />
    ];
  }
}
