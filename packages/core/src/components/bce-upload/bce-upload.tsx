import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faFileAudio,
  faFileImage,
  faFileUpload,
  faFileVideo
} from '@fortawesome/free-solid-svg-icons';
import { Component, h, Prop, State } from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { UploadValue } from '../../models/upload-value';
import { ripple } from '../../utils/ripple';

library.add(faFileAudio, faFileImage, faFileUpload, faFileVideo);

@Component({
  tag: 'bce-upload',
  styleUrl: 'bce-upload.scss',
  shadow: true
})
export class Upload {
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
  public value: UploadValue = [];

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
  private _popup = false;

  @State()
  private _queue: any[] = [
    // { data: 'https://via.placeholder.com/300x150' },
    // { data: 'https://via.placeholder.com/300x150' },
    // { data: 'https://via.placeholder.com/300x150' },
    // { data: 'https://via.placeholder.com/300x150' },
    // { data: 'https://via.placeholder.com/300x150' }
  ];

  private _initialValue?: UploadValue = this.value;
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

    const files = Array.from(event.dataTransfer!.files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const data = reader.result;
        const type = file.type;
        this._queue = [...this._queue, { data, type }];
      };
    }

    event.preventDefault();
    event.stopPropagation();
  };

  renderPreview() {
    return this._queue.map(file => <img src={file.data} />);
  }

  renderDropzone() {
    const preview = !!this.value.length || !!this._queue.length;
    const classes = { dropzone: true, highlight: this._highlight, preview };

    const placeholder = [
      <bce-icon pre="fas" name={this.fileIcon}></bce-icon>,
      <span>
        <slot>Drop a file here or click to select one.</slot>
      </span>
    ];

    return (
      <div
        class={classes}
        onClick={() => (this._popup = true)}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        {preview ? this.renderPreview() : placeholder}
      </div>
    );
  }

  renderUploadDialog() {
    return (
      <bce-dialog active={this._popup} onBackdrop={() => (this._popup = false)}>
        <h3>Upload!</h3>
        <p>bla bla bla</p>
      </bce-dialog>
    );
  }

  render() {
    console.warn('[bce-upload] This component is a work-in-progress.');
    const InputCreator = this._inputCreator;

    return (
      <InputCreator>
        {this.renderDropzone()}
        {this._popup && this.renderUploadDialog()}
      </InputCreator>
    );
  }
}
