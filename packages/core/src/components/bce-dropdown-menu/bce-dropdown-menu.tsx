import {
  Component,
  Element,
  h,
  Host,
  Listen,
  Prop,
  Watch
} from '@stencil/core';
import Popper from 'popper.js';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-dropdown-menu',
  styleUrl: 'bce-dropdown-menu.scss',
  shadow: false
})
export class BceDropdownMenu {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ reflect: true, mutable: true })
  public active: boolean = false;

  private dropDownMenu!: Popper;

  private get buttons() {
    const container = this.el.querySelector('bce-dropdown-menu-items');
    if (!container) return [];

    const children = Array.from(container.children);
    const buttons = children.filter(c => c.tagName !== 'bce-button');
    return buttons as HTMLBceButtonElement[];
  }

  private handleClick = (event: Event) => {
    this.active = !this.active;
    event.stopPropagation();
  };

  @Listen('click', { target: 'window' })
  public closeDropdown() {
    this.active = false;
  }

  @Watch('color')
  private updateButtonColor() {
    for (const button of this.buttons) button.color = this.color;
  }

  componentWillLoad() {
    this.updateButtonColor();
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

  render() {
    return (
      <Host onClick={this.handleClick}>
        <bce-icon
          class="dropdown-button"
          pre="fas"
          name="ellipsis-h"
          size="lg"
          fixed-width
        />

        <div class="bce-dropdown-menu-items" data-active={this.active}>
          <slot />
        </div>
      </Host>
    );
  }
}
