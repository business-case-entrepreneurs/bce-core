import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-message',
  styleUrl: 'bce-message.scss',
  shadow: true
})
export class BceMessage {
  @Prop({ reflect: true })
  public color?: string;

  render() {
    return <slot />;
  }
}
