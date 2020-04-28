import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bce-ripple',
  styleUrl: 'bce-ripple.scss',
  shadow: true
})
export class Ripple {
  @Prop({ reflect: true })
  public x!: number;

  @Prop({ reflect: true })
  public y!: number;

  render() {
    return <Host style={{ left: this.x + 'px', top: this.y + 'px' }} />;
  }
}
