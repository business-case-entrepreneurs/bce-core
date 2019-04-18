import { Component, Prop } from '@stencil/core';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-menu',
  styleUrl: 'bce-menu.scss'
})
export class BceMenu {

  render() {
    return (
      <nav>
        <slot/>
      </nav>
    )
  }
}