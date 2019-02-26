import { Component } from '@stencil/core';

@Component({
  tag: 'bce-message',
  styleUrl: 'bce-message.scss'
})
export class BceMessage {
  render() {
    return <slot />;
  }
}
