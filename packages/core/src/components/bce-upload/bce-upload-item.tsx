import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Prop, State } from '@stencil/core';

import { BceFileRef } from '../../utils/bce-file';

library.add(
  FAS.faDownload,
  FAS.faEdit,
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
  public value!: BceFileRef;

  @Prop({ reflect: true })
  public loading?: boolean;

  @State()
  public _muted = true;

  @State()
  public _playing = false;

  private get type() {
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
        return upload.cancel(this.value.id);
      case 'delete':
        return upload.delete(this.value.id);
      case 'download':
        return upload.download(this.value.id);
      case 'edit':
        const name = window.prompt('', this.value.name);
        return upload.rename(this.value.id, name || this.value.name);
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

  renderOverlay() {
    const classes = { overlay: true, loading: !!this.loading };

    return (
      <div class={classes} onClick={this.ignoreEvent}>
        {this.renderActions()}
        {this.loading && <bce-icon raw="fas:spinner" spin />}
        {/* <code class="filename">{this.value.name}</code> */}
        <bce-tooltip container={this.el.shadowRoot!} target=".overlay">
          {this.value.name}
        </bce-tooltip>
      </div>
    );
  }

  renderFile() {
    const ref = this.value;
    const classes = { loading: !!this.loading };
    const controls = { ...{ controls: true, controlsList: 'nodownload' } };

    switch (this.type) {
      case 'audio':
        return (
          <audio
            key={ref.id}
            class={classes}
            {...controls}
            onClick={this.ignoreEvent}
          >
            <source src={ref.url} type={ref.type} />
          </audio>
        );
      case 'image':
        return <img key={ref.id} class={classes} src={ref.url} />;
      case 'video':
        return (
          <video
            key={ref.id}
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
          <div key={ref.id} class={{ ...classes, unknown: true }}>
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
