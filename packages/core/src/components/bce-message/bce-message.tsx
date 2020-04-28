import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-message',
  styleUrl: 'bce-message.scss',
  styleUrls: ['../../global/shadow-color.scss'],
  shadow: true
})
export class BceMessage {
  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public fab?: boolean;

  render() {
    return <slot />;
  }
}
