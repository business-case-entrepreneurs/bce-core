import { Component, Element, h } from '@stencil/core';

import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-nav-button',
  styleUrl: 'bce-nav-button.scss',
  shadow: true
})
export class BceMenuButton {
  @Element()
  private el!: HTMLBceMenuButtonElement;

  private handleMouseDown = (event: MouseEvent) => {
    ripple(event.target as Element, event);
  };

  render() {
    return (
      <button onMouseDown={this.handleMouseDown}>
        <span />
        <span />
        <span />
      </button>
    );
  }
}
