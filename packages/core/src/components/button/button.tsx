import { Component, Element, h, Host, Prop, State } from '@stencil/core';

import { ButtonType } from '../../models/button-type';
import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-button',
  styleUrls: {
    default: 'button.scss',
    fab: 'button.fab.scss',
    bucket: 'button.bucket.scss'
  },
  shadow: true
})
export class Button {
  @Element()
  private el!: HTMLElement;

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

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  /** Forwarded to native button **/

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

  @State()
  private slotEmpty = false;

  private handleBlur = () => {
    this.hasFocus = false;
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    ripple(this.el.shadowRoot!.querySelector('button')!, event);
  };

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    const nodes = slot.assignedNodes({ flatten: true });
    this.slotEmpty = !nodes.length;
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
        >
          {this.icon && this.renderIcon()}
          <span>
            <slot />
          </span>
        </button>
      </Host>
    );
  }
}
