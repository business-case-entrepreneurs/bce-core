import { Component, h, Prop } from '@stencil/core';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-header',
  styleUrl: 'bce-header.scss',
  shadow: false
})
export class BceHeader {
  @Prop({ reflect: true })
  public color?: Color;

  render() {
    return <slot />;
  }
}
