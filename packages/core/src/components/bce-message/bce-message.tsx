import { Component, h } from '@stencil/core';

@Component({
  tag: 'bce-message',
  styleUrl: 'bce-message.scss',
  shadow: false
})
export class BceMessage {
  render() {
    return <slot />;
  }
}
