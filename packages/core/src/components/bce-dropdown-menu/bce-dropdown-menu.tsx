import { Component, Element, Prop, h, Host } from '@stencil/core';
import { ButtonType } from '../../models/button-type';

@Component({
  tag: 'bce-dropdown-menu',
  styleUrl: 'bce-dropdown-menu.scss',
  shadow: false
})
export class BceDropdownMenu {
  render() {
    return [
      <bce-icon raw={'ellipsis-h'} size="lg" pre={'fas'} fixed-width />,
      <div class="dropdown">
        <slot />
      </div>
    ];
  }
}
