import { Component, Element, Prop } from '@stencil/core';

import { ButtonType } from '../../models/button-type';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-button',
  styleUrl: 'bce-button.scss'
})
export class BceButton {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Prop({ reflectToAttr: true })
  public type?: ButtonType;

  @Prop({ reflectToAttr: true })
  public icon?: string;

  @Prop({ reflectToAttr: true })
  public block?: boolean;

  @Prop({ reflectToAttr: true })
  public disabled = false;

  @Prop({ attr: 'focus', reflectToAttr: true, mutable: true })
  public hasFocus = false;

  private handleClick = (event: MouseEvent) => {
    if (this.disabled) event.stopPropagation();
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    const ripple = document.createElement('bce-ripple');
    ripple.x = event.pageX - this.el.offsetLeft;
    ripple.y = event.pageY - this.el.offsetTop;

    this.el.appendChild(ripple);
    setTimeout(() => ripple.parentElement!.removeChild(ripple), 500);
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleBlur = () => {
    this.hasFocus = false;
  };

  hostData() {
    return {
      tabIndex: this.disabled ? undefined : 0,
      onMouseDown: this.handleMouseDown,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    };
  }

  render() {
    return [
      <button tabIndex={-1} disabled={this.disabled}>
        <slot />
      </button>,
      this.icon && (
        <bce-icon raw={this.icon} onClick={this.handleClick} fixed-width />
      )
    ];
  }
}
