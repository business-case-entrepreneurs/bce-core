import { Component, Element, h, Host, Prop } from '@stencil/core';

import { ButtonType } from '../../models/button-type';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-button',
  styleUrl: 'bce-button.scss',
  shadow: false
})
export class BceButton {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ reflect: true })
  public type?: ButtonType;

  @Prop({ reflect: true })
  public icon?: string;

  @Prop({ reflect: true })
  public iconSpin?: boolean;

  @Prop({ reflect: true })
  public block?: boolean;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  @Prop({ reflect: true })
  public submit = false;

  private handleClick = (event: MouseEvent) => {
    if (this.disabled) event.stopPropagation();
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;

    // Create ripple element at mouse position
    const ripple = document.createElement('bce-ripple');
    const rect = this.el.getBoundingClientRect();
    ripple.x = event.clientX - rect.left;
    ripple.y = event.clientY - rect.top;

    // Append ripple to button & remove after 500ms
    this.el.appendChild(ripple);
    setTimeout(() => ripple.parentElement!.removeChild(ripple), 500);
  };

  private handleFocus = (event: FocusEvent) => {
    this.hasFocus = true;

    if (!event.bubbles) {
      const e = new FocusEvent(event.type, { ...event, bubbles: true });
      this.el.dispatchEvent(e);
    }
  };

  private handleBlur = (event: FocusEvent) => {
    this.hasFocus = false;

    if (!event.bubbles) {
      const e = new FocusEvent(event.type, { ...event, bubbles: true });
      this.el.dispatchEvent(e);
    }
  };

  render() {
    const type = this.submit ? 'submit' : 'button';

    return (
      <Host
        tabIndex={this.disabled ? undefined : 0}
        onMouseDown={this.handleMouseDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <button tabIndex={-1} disabled={this.disabled} type={type}>
          <slot />
        </button>
        {this.icon && (
          <bce-icon
            raw={this.icon}
            onClick={this.handleClick}
            spin={this.iconSpin}
            fixed-width
          />
        )}
      </Host>
    );
  }
}
