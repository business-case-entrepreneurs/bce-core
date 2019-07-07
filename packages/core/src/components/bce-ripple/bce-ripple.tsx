import { Component, Element, h, Host, Prop } from '@stencil/core';

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

  render() {
    return <Host style={{ left: this.x + 'px', top: this.y + 'px' }} />;
  }
}
