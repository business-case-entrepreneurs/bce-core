import {
  Component,
  Event,
  EventEmitter,
  h,
  Element,
  Host
} from '@stencil/core';

@Component({
  tag: 'bce-menu-button',
  styleUrl: 'bce-menu-menu-button.scss'
})
export class BceMenuButton {
  @Element() el!: HTMLElement;

  @Event() toggleMenu!: EventEmitter;

  public onClick = () => {
    this.toggleMenu.emit();
  };

  render() {
    return (
      <Host>
        <bce-icon
          class="mobile-button"
          onClick={this.onClick}
          raw={'bars'}
          pre={'fas'}
          size={'2x'}
        />
      </Host>
    );
  }
}
