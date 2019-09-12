import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host
} from '@stencil/core';

import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-menu-button',
  styleUrl: 'bce-menu-button.scss',
  shadow: false
})
export class BceMenuButton {
  @Element()
  private el!: HTMLBceMenuButtonElement;

  @Event({ eventName: 'toggle-menu' })
  private onToggleMenu!: EventEmitter;

  private handleClick = (event: MouseEvent) => {
    ripple(this.el, event);
    this.onToggleMenu.emit();
  };

  render() {
    return (
      <Host onClick={this.handleClick}>
        <span />
        <span />
        <span />
      </Host>
    );
  }
}
