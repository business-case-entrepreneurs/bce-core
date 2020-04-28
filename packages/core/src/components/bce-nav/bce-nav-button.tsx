import { Component, Element, h } from '@stencil/core';

import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-nav-button',
  styleUrl: 'bce-nav-button.scss',
  shadow: true
})
export class NavButton {
  @Element()
  private el!: HTMLBceNavButtonElement;

  private get root() {
    const shadow = this.el.parentNode as ShadowRoot;
    const header = 'host' in shadow && shadow.host.closest('bce-header');
    return header || this.el.closest('bce-root') || document;
  }

  private handleMouseDown = (event: MouseEvent) => {
    ripple(event.target as Element, event);
  };

  private handleClick = () => {
    const r = this.root;
    const n = r.querySelector('bce-side-bar') || r.querySelector('bce-nav');
    if (n) n.toggle();
  };

  render() {
    return (
      <button onClick={this.handleClick} onMouseDown={this.handleMouseDown}>
        <span />
        <span />
        <span />
      </button>
    );
  }
}
