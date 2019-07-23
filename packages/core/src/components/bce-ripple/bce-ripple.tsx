import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bce-ripple',
  styleUrl: 'bce-ripple.scss',
  shadow: false
})
export class BceRipple {
  @Element()
  public el!: HTMLElement;

  @Prop({ reflect: true })
  public x!: number;

  @Prop({ reflect: true })
  public y!: number;

  render() {
    return <Host style={{ left: this.x + 'px', top: this.y + 'px' }} />;
  }
}
