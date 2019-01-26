import { Component, Prop } from '@stencil/core';

import { Color } from '../../models/color';

/**
 * Root component.
 */
@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss'
})
export class Root {
  @Prop({ reflectToAttr: true })
  public color?: Color;

  render() {
    return <slot />;
  }
}
