import { Component } from '@stencil/core';

/**
 * Root component.
 */
@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss'
})
export class Root {
  render() {
    return <slot />;
  }
}
