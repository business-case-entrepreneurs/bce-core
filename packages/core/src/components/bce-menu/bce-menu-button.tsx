import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host
} from '@stencil/core';
import { appendRipple } from '../../utils/append-ripple';

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
    appendRipple(this.el, event);
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
