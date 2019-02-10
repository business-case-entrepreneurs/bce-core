import { Component, Element, Prop } from '@stencil/core';

@Component({
  tag: 'bce-ripple',
  styleUrl: 'bce-ripple.scss'
})
export class BceRipple {
  @Element()
  public el!: HTMLElement;

  @Prop({ reflectToAttr: true })
  public x!: number;

  @Prop({ reflectToAttr: true })
  public y!: number;

  componentDidLoad() {
    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
  }

  render() {
    return null;
  }
}
