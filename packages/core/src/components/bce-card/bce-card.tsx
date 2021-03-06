import { Component, h } from '@stencil/core';

@Component({
  tag: 'bce-card',
  styleUrl: 'bce-card.scss',
  shadow: true
})
export class Card {
  render() {
    return <slot />;
  }
}
