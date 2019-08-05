import { Component, Element, Prop, h, Host, Listen } from '@stencil/core';
import Popper from 'popper.js';

@Component({
  tag: 'bce-dropdown-menu',
  styleUrl: 'bce-dropdown-menu.scss',
  shadow: false
})
export class BceDropdownMenu {
  public dropDownMenu!: Popper;

  @Prop({ reflect: true, mutable: true })
  public active: boolean = false;

  @Element()
  private el!: HTMLElement;

  @Listen('click', { target: 'window' })
  public closeDropdown() {
    this.active = false;
  }

  componentDidLoad() {
    const reference = this.el.querySelector('.dropdown-button')!;
    const dropdown = this.el.querySelector('.bce-dropdown-menu-items')!;

    this.dropDownMenu = new Popper(reference, dropdown, {
      placement: 'bottom-start',
      modifiers: {
        flip: { boundariesElement: 'scrollParent' }
      }
    });
  }

  componentDidUnload() {
    this.dropDownMenu.destroy();
  }

  handleClick(event: Event) {
    this.active = !this.active;
    event.stopPropagation();
  }

  render() {
    return (
      <Host onClick={this.handleClick}>
        <bce-icon
          class="dropdown-button"
          raw={'ellipsis-h'}
          size="lg"
          pre={'fas'}
          fixed-width
        />

        <div class="bce-dropdown-menu-items" data-active={this.active}>
          <slot />
        </div>
      </Host>
    );
  }
}
