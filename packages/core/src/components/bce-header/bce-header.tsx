import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-header',
  styleUrl: 'bce-header.scss',
  shadow: false
})
export class BceHeader {
  @Prop({ reflect: true })
  public color?: string;

  render() {
    return <slot />;
  }
}
