import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Component, Element, Prop } from '@stencil/core';

import { Button } from '../../models/button';
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
  public type?: Button;

  @Prop({ reflectToAttr: true })
  public icon?: IconName;

  @Prop({ reflectToAttr: true })
  public block?: boolean;

  @Prop({ attr: 'focus', reflectToAttr: true, mutable: true })
  public hasFocus = false;

  private handleMouseDown = (event: MouseEvent) => {
    const ripple = document.createElement('bce-ripple');
    ripple.x = event.pageX - this.el.offsetLeft;
    ripple.y = event.pageY - this.el.offsetTop;

    this.el.appendChild(ripple);
    setTimeout(() => ripple.parentElement!.removeChild(ripple), 500);
  };

  private onFocus = (event: Event) => {
    this.hasFocus = true;
  };

  private onBlur = (event: Event) => {
    this.hasFocus = false;
  };

  hostData() {
    return {
      tabIndex: 0,
      onMouseDown: this.handleMouseDown,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    };
  }

  render() {
    return [
      <button tabIndex={-1}>
        <slot />
      </button>,
      this.icon && <bce-icon raw={this.icon} />
    ];
  }
}
