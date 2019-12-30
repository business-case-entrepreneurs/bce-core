import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State
} from '@stencil/core';

import { ButtonType } from '../../models/button-type';
import { File } from '../../utils/file';
import { NativeEvent } from '../../utils/native-event';
import { ripple } from '../../utils/ripple';
import { UUID } from '../../utils/uuid';

@Component({
  tag: 'bce-button',
  styleUrls: {
    default: 'bce-button.scss',
    fab: 'bce-button.fab.scss',
    bucket: 'bce-button.bucket.scss'
  },
  shadow: true
})
export class Button {
  @Element()
  private el!: HTMLElement;

  // #region Custom properties
  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public type?: ButtonType;

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

  @Prop({ reflect: false, attribute: 'formtype' })
  public formType: 'button' | 'reset' | 'submit' = 'button';
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

  private handleSlotChange = (event: NativeEvent | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    const nodes = slot.assignedNodes({ flatten: true });
    this.slotEmpty = !nodes.length;
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
      this.handleSlotChange(slot);
    }
  }

  renderIcon() {
    return <bce-icon raw={this.icon} spin={this.iconSpin} fixed-width />;
  }

  render() {
    return (
      <Host
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseDown={this.handleMouseDown}
      >
        <button
          disabled={this.disabled}
          form={this.form}
          formaction={this.formAction}
          formenctype={this.formEnctype}
          formmethod={this.formMethod}
          formtarget={this.formTarget}
          type={this.formType}
          data-icon-only={this.slotEmpty}
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
