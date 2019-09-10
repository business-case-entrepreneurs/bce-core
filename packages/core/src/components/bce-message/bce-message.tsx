import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-message',
  styleUrl: 'bce-message.scss',
  shadow: false
})
export class BceMessage {
  @Prop({ reflect: true })
  public color?: string;

  render() {
    return <slot />;
  }
}
