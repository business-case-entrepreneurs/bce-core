import { Component } from '@stencil/core';

@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss'
})
export class BceRoot {
  render() {
    return <slot />;
  }
}
