import { Component, Prop, h } from '@stencil/core';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-header',
  styleUrl: 'bce-header.scss'
})
export class BceHeader {
  @Prop({ reflect: true })
  public color?: Color;

  render() {
    return <slot />;
  }
}
