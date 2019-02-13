import { Component } from '@stencil/core';

@Component({
  tag: 'bce-card',
  styleUrl: 'bce-card.scss'
})
export class BceCard {
  render() {
    return <slot />;
  }
}
