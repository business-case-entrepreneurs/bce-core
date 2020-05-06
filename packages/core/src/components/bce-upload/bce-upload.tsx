import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State
} from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { BceFile, BceFileRef } from '../../utils/bce-file';
import { ripple } from '../../utils/ripple';
import { UUID } from '../../utils/uuid';

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
  public dialog?: boolean;

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

  @Prop({ reflect: true })
  public name?: string;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value: BceFileRef[] = [];

  @Prop({ reflect: true })
  public width?: string;

  // #region Forwarded to native input[type='file']
  @Prop({ reflect: true })
  public accept?: string;

  @Prop({ reflect: true })
  public multiple = false;
  // #endregion

  @Event({ eventName: 'cancel' })
  private onCancel!: EventEmitter<string>;

  @Event({ eventName: 'delete' })
  private onDelete!: EventEmitter<BceFileRef>;

  @Event({ eventName: 'rename' })
  private onRename!: EventEmitter<{ file: BceFileRef; name: string }>;

  @Event({ eventName: 'upload' })
  private onUpload!: EventEmitter<BceFile[]>;

  @State()
  private _highlight = false;

  @State()
  private _queue: BceFileRef[] = [];

  private _initialValue?: BceFileRef[] = this.value;
  private _inputCreator = getInputCreator(this, err => (this.error = !!err));

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

  public get list() {
    const value = this.value.map(file => ({ ...file, loading: false }));
    const queue = this._queue.map(file => ({ ...file, loading: true }));
    return [...value, ...queue].sort((a, b) => a.name.localeCompare(b.name));
  }

  private handleDragEnter = (event: DragEvent) => {
    this._highlight = true;
    event.preventDefault();
    event.stopPropagation();
  };

  private handleDragLeave = (event: DragEvent) => {
    this._highlight = false;
    event.preventDefault();
    event.stopPropagation();
  };

  private handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  private handleDrop = (event: DragEvent) => {
    this._highlight = false;
    ripple(event.target as HTMLElement, event);

    this.upload(event.dataTransfer!.files);
    event.preventDefault();
    event.stopPropagation();
  };

  private handleUpload = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input || !input.files) return;

    this.upload(input.files);
    input.value = '';
  };

  private handleUrl = async () => {
    const url = window.prompt();
    if (!url) return;

    // Download as blob
    const req = new Request(url);
    const res = await fetch(req);
    const blob = await res.blob();

    // Find filename
    const header = res.headers.get('content-disposition');
    const match = header?.match(/filename="(.+)"/);
    const name = match && match[1];
    const fallback = new URL(url).pathname.split('/').pop();

    // Download and use the file
    const file = this.toFile(blob, name || fallback || 'unnamed');
    this.upload([file]);
  };

  private ignoreEvent = (event: Event) => {
    event.stopPropagation();
  };

  private triggerUpload = () => {
    if (!this.multiple && this.list.length) return;

    const input = this.el.shadowRoot!.querySelector('input');
    if (input) input.click();
  };

  @Method()
  public async cancel(id: string) {
    await this.dequeue(id);
    this.onCancel.emit(id);
  }

  @Method()
  public async complete(id: string, ref: Partial<BceFileRef> = {}) {
    const queue = this._queue.find(v => v.id === id);
    if (!queue) return;

    await this.dequeue(id, !!ref.url && queue.url !== ref.url);
    this.updateValue([...this.value, { ...queue, ...ref }]);
  }

  @Method()
  public async delete(id: string) {
    const value = this.value.find(v => v.id === id);
    if (!value) return;

    URL.revokeObjectURL(value.url);
    this.updateValue(this.value.filter(v => v.id !== id));
    this.onDelete.emit(value);
  }

  @Method()
  public async download(id: string) {
    const value = this.value.find(v => v.id === id);
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
    const value = this.value.find(v => v.id === id);
    if (!value || value.name === filename) return;

    // Extract extension
    const regex = /\.[0-9a-z]+$/i;
    const match = value.name.match(regex);
    const ext = match && match[0];

    // Request new name
    const name = ext
      ? (filename?.replace(regex, '') || value.name) + ext
      : filename || value.name;

    // Update value
    const filtered = this.value.filter(v => v.id !== id);
    this.updateValue([...filtered, { ...value, name }]);
    this.onRename.emit({ file: value, name });
  }

  @Method()
  public async upload(files: BceFile[] | FileList) {
    if (!this.multiple && this.list.length) return;

    // Ensure input is a BceFile array
    const converted = Array.isArray(files)
      ? files
      : Array.from(files).map(f => this.toFile(f, f.name));

    // Filter files
    const tasks = converted.map(async file => {
      // Remove duplicates by comparing file hashes
      const hash = await file.hash();
      if (this.list.find(v => v.hash === hash)) return undefined;

      // Remove files with incorrect types
      const accept = this.accept || '*';
      const regexStr = accept.replace('*', '.*').replace(/\,/g, '|');
      if (!new RegExp(regexStr).test(file.type)) return undefined;

      // Accept file
      return file;
    });

    const filtered = (await Promise.all(tasks)).filter(Boolean) as BceFile[];
    const upload = this.multiple ? filtered : filtered.slice(0, 1);
    if (upload.length) this.onUpload.emit(upload);
    for (const file of upload) this.enqueue(file);
  }

  private async dequeue(id: string, revoke = true) {
    const queue = this._queue.find(v => v.id === id);
    if (!queue) return;

    if (revoke) URL.revokeObjectURL(queue.url);
    this._queue = this._queue.filter(v => v.id !== id);
  }

  private async enqueue(file: BceFile) {
    const { id, name, type } = file;
    const hash = await file.hash();
    const url = URL.createObjectURL(file.blob);
    this._queue = [...this._queue, { hash, id, name, type, url }];
  }

  private toFile(blob: Blob, name: string) {
    return new BceFile(UUID.v4(), name, blob);
  }

  private updateValue(value: BceFileRef[]) {
    this.value = value.sort((a, b) => a.name.localeCompare(b.name));
    this.el.dispatchEvent(new globalThis.Event('input'));
  }

  renderPreview() {
    return this.list.map(file => (
      <bce-upload-item value={file} loading={file.loading} />
    ));
  }

  renderDropzone() {
    const preview = !!this.value.length || !!this._queue.length;
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
    if (!this.multiple && this.list.length) return;

    return (
      <bce-select type="action">
        <bce-chip
          icon={`fas:${this.fileIcon}`}
          value="file"
          onClick={this.triggerUpload}
        >
          File
        </bce-chip>
        <bce-chip icon="fas:globe" value="url" onClick={this.handleUrl}>
          URL
        </bce-chip>
        {/* <bce-chip icon="fas:cloud" value="cloud">
          Cloud
        </bce-chip>
        <bce-chip icon="bce:unsplash" value="unsplash">
          Unsplash
        </bce-chip> */}
      </bce-select>
    );
  }

  renderContainer() {
    return (
      <div class="container">
        {this.renderDropzone()}
        {this.renderOptions()}
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
