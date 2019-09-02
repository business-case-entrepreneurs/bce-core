import { Component, Event, EventEmitter, h, Host } from '@stencil/core';

@Component({
  tag: 'bce-menu-button',
  styleUrl: 'bce-menu-button.scss',
  shadow: false
})
export class BceMenuButton {
  @Event({ eventName: 'toggle-menu' })
  private onToggleMenu!: EventEmitter;

  private handleClick = () => {
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
