import {
  Component,
  Element,
  getMode,
  h,
  Host,
  Listen,
  Prop,
  State
} from '@stencil/core';

import { ButtonDesign } from '../../models/button-design';
import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-button',
  styleUrls: {
    fab: 'bce-button.fab.scss',
    menu: 'bce-button.menu.scss',
    bucket: 'bce-button.bucket.scss',
    regular: 'bce-button.scss'
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
  public iconPosition?: 'left' | 'right';

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

  // #region a11y forwarding
  @Prop({ reflect: false })
  public a11yAriaExpanded?: boolean;

  @Prop({ reflect: false })
  public a11yAriaHaspopup?: 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree';

  @Prop({ reflect: false })
  public a11yRole?: string;
  // #endregion

  @State()
  private _iconOnly = false;

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

  private handleSlotChange = () => {
    this._iconOnly = !!this.icon && !this.el.childNodes.length;
  };

  @Listen('click', { capture: true })
  public listenClick(event: Event) {
    if (!this.disabled) return;
    event.preventDefault();
    event.stopPropagation();
  }

  componentWillLoad() {
    this.handleSlotChange();
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', this.handleSlotChange);
  }

  renderIcon() {
    const mode = getMode(this);
    const size = this.el.clientHeight + 'px';
    const style = mode === 'fab' ? undefined : { width: size, height: size };

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
          class={{ 'icon-only': this._iconOnly }}
          disabled={this.disabled}
          form={this.form}
          formaction={this.formAction}
          formenctype={this.formEnctype}
          formmethod={this.formMethod}
          formtarget={this.formTarget}
          role={this.a11yRole}
          type={this.type}
          aria-expanded={this.a11yAriaExpanded}
          aria-haspopup={this.a11yAriaHaspopup}
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
