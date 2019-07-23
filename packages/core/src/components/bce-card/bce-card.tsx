import { Component, h } from '@stencil/core';

@Component({
  tag: 'bce-card',
  styleUrl: 'bce-card.scss',
  shadow: false
})
export class BceCard {
  render() {
    return <slot />;
  }
}
