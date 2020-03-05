import {
  Component,
  Element,
  Event,
  EventEmitter,
  getMode,
  h,
  Host,
  Prop,
  State
} from '@stencil/core';

import { ButtonDesign } from '../../models/button-design';
import { File } from '../../utils/file';
import { NativeEvent } from '../../utils/native-event';
import { ripple } from '../../utils/ripple';
import { UUID } from '../../utils/uuid';

@Component({
  tag: 'bce-button',
  styleUrls: {
    'bce-fab': 'bce-button.fab.scss',
    'bce-menu': 'bce-button.menu.scss',
    bucket: 'bce-button.bucket.scss',
    default: 'bce-button.scss'
  },
  shadow: true
})
export class Button {
  @Element()
  private el!: HTMLBceButtonElement;

  // #region Custom properties
  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public design?: ButtonDesign;

  @Prop({ reflect: true })
  public icon?: string;

  @Prop({ reflect: true })
  public iconSpin?: boolean;

  @Prop({ reflect: true })
  public block?: boolean;

  @Prop({ reflect: true })
  public small?: boolean;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  @Prop({ reflect: true })
  public upload?: boolean;
  // #endregion

  // #region Forwarded to native button
  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true })
  public form?: string;

  @Prop({ reflect: false, attribute: 'formaction' })
  public formAction?: string;

  @Prop({ reflect: false, attribute: 'formenctype' })
  public formEnctype?:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';

  @Prop({ reflect: false, attribute: 'formmethod' })
  public formMethod?: 'get' | 'post';

  @Prop({ reflect: false, attribute: 'formtarget' })
  public formTarget?: string;

  @Prop({ reflect: true })
  public type: 'button' | 'reset' | 'submit' = 'button';
  // #endregion

  // #region Forwarded to native input[type='file']
  @Prop({ reflect: true })
  public accept?: string;

  @Prop({ reflect: true })
  public multiple = false;
  // #endregion

  @Event({ eventName: 'file' })
  private onFile!: EventEmitter<File[]>;

  @State()
  private slotEmpty = false;

  private handleBlur = () => {
    this.hasFocus = false;
  };

  private handleClick = (event: NativeEvent) => {
    if (this.upload) {
      // Trigger input[type='file'] click
      const input = this.el.shadowRoot!.querySelector('input');
      if (input) input.click();

      // Let input's click event be the only propagated click event
      event.cancelBubble = true;
      event.preventDefault();
    }
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    ripple(this.el.shadowRoot!.querySelector('button')!, event);
  };

  private handleSlotChange = () => {
    this.slotEmpty = !this.el.childNodes.length;
  };

  private handleUpload = (event: NativeEvent) => {
    const input = event.target as HTMLInputElement | null;
    if (!input || !input.files) return;

    // Extract required data and generate id
    const files = Array.from(input.files).map(file => {
      return new File(UUID.v4(), file.name, file);
    });

    // Dispatch custom event
    this.onFile.emit(files);
  };

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange();
    }
  }

  renderIcon() {
    const mode = getMode(this);
    const size = this.el.clientHeight + 'px';
    const style =
      mode === 'bce-fab' ? undefined : { width: size, height: size };

    return (
      <bce-icon
        style={style}
        raw={this.icon}
        spin={this.iconSpin}
        fixed-width
      />
    );
  }

  render() {
    return (
      <Host
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseDown={this.handleMouseDown}
      >
        <button
          class={{ 'icon-only': this.slotEmpty }}
          disabled={this.disabled}
          form={this.form}
          formaction={this.formAction}
          formenctype={this.formEnctype}
          formmethod={this.formMethod}
          formtarget={this.formTarget}
          type={this.type}
          onClick={this.handleClick}
        >
          {this.icon && this.renderIcon()}
          <span>
            <slot />
          </span>
        </button>

        {this.upload && (
          <input
            type="file"
            accept={this.accept}
            multiple={this.multiple}
            onChange={this.handleUpload}
            tabIndex={-1}
          />
        )}
      </Host>
    );
  }
}
