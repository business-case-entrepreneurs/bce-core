import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAR from '@fortawesome/free-regular-svg-icons';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Prop, State } from '@stencil/core';

import { FileRef } from '../../models/file-ref';

library.add(
  FAS.faDownload,
  FAS.faEdit,
  FAR.faFile,
  FAS.faFileContract,
  FAS.faPause,
  FAS.faPlay,
  FAS.faTimes,
  FAS.faTrash,
  FAS.faSpinner,
  FAS.faVolumeUp,
  FAS.faVolumeMute
);

const ACTIONS = {
  cancel: 'fas:times',
  delete: 'fas:trash',
  download: 'fas:download',
  edit: 'fas:edit',
  mute: 'fas:volume-up',
  pause: 'fas:pause',
  play: 'fas:play',
  unmute: 'fas:volume-mute'
};

@Component({
  tag: 'bce-upload-item',
  styleUrl: 'bce-upload-item.scss',
  shadow: true
})
export class UploadItem {
  @Element()
  private el!: HTMLBceUploadItemElement;

  @Prop()
  public value!: FileRef | string;

  @Prop({ reflect: true })
  public progress!: number;

  @State()
  public _muted = true;

  @State()
  public _playing = false;

  private get id() {
    return typeof this.value === 'string' ? this.value : this.value.id;
  }

  private get loading() {
    return this.progress < 1;
  }

  private get type() {
    if (typeof this.value === 'string') return 'missing';
    for (const option of ['audio', 'image', 'video'])
      if (this.value.type.startsWith(option)) return option;
    return 'unknown';
  }

  private handleAction = async <T extends keyof typeof ACTIONS>(action: T) => {
    const root = this.el.getRootNode() as ShadowRoot;
    const upload = root.host as HTMLBceUploadElement;
    if (!upload) return;

    switch (action) {
      case 'cancel':
        return upload.cancel(this.id);
      case 'delete':
        return upload.delete(this.id);
      case 'download':
        return upload.download(this.id);
      case 'edit':
        if (typeof this.value === 'string') return;
        const name = window.prompt('', this.value.name);
        return upload.rename(this.id, name || this.value.name);
      case 'mute':
        return (this._muted = true);
      case 'pause':
        return this.pause();
      case 'play':
        return this.play();
      case 'unmute':
        return (this._muted = false);
    }
  };

  private ignoreEvent = (event: Event) => {
    event.stopPropagation();
  };

  private pause() {
    const video = this.el.shadowRoot!.querySelector('video');
    if (!video) return;

    video.pause();
    this._playing = false;
  }

  private play() {
    const video = this.el.shadowRoot!.querySelector('video');
    if (!video) return;

    video.play();
    this._playing = true;
  }

  renderAction<T extends keyof typeof ACTIONS>(...actions: T[]) {
    return actions.map(action => (
      <bce-button
        design="text"
        icon={ACTIONS[action]}
        onClick={() => this.handleAction(action)}
      />
    ));
  }

  renderActions() {
    if (this.loading) return this.renderAction('cancel');

    switch (this.type) {
      case 'audio':
      case 'image':
      default:
        return this.renderAction('edit', 'download', 'delete');

      case 'missing':
        return this.renderAction('delete');

      case 'video':
        return this.renderAction(
          'edit',
          !this._muted ? 'mute' : 'unmute',
          !this._playing ? 'play' : 'pause',
          'download',
          'delete'
        );
    }
  }

  renderLoading() {
    if (!this.loading) return;
    return [
      <bce-icon raw="fas:spinner" spin />,
      <p>{(this.progress * 100).toFixed() + '%'}</p>
    ];
  }

  renderOverlay() {
    const classes = { overlay: true, loading: !!this.loading };

    return (
      <div class={classes} onClick={this.ignoreEvent}>
        {this.renderActions()}
        {this.renderLoading()}
        {/* <code class="filename">{this.value.name}</code> */}
        <bce-tooltip container={this.el.shadowRoot!} target=".overlay">
          {typeof this.value === 'string' ? this.value : this.value.name}
        </bce-tooltip>
      </div>
    );
  }

  renderFile() {
    const classes = { file: true, loading: !!this.loading };
    const controls = { ...{ controls: true, controlsList: 'nodownload' } };

    if (typeof this.value === 'string') {
      return (
        <div key={this.value} class={{ ...classes, missing: true }}>
          <bce-icon pre="far" name="file" />
          <code class="filename">ERROR 404</code>
        </div>
      );
    }

    const ref = this.value;
    switch (this.type) {
      case 'audio':
        return (
          <audio
            key={ref.url}
            class={classes}
            {...controls}
            onClick={this.ignoreEvent}
          >
            <source src={ref.url} type={ref.type} />
          </audio>
        );
      case 'image':
        return <img key={ref.url} class={classes} src={ref.url} />;
      case 'video':
        return (
          <video
            key={ref.url}
            class={classes}
            muted={this._muted}
            preload="auto"
            onEnded={() => (this._playing = false)}
          >
            <source src={ref.url} type={ref.type} />
          </video>
        );
      case 'unknown':
      default:
        return (
          <div key={ref.url} class={{ ...classes, unknown: true }}>
            <bce-icon pre="fas" name="file-contract" />
            <code class="filename">{this.value.name}</code>
          </div>
        );
    }
  }

  render() {
    return [this.renderFile(), this.renderOverlay()];
  }
}
