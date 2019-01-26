import { Component, Prop } from '@stencil/core';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-header',
  styleUrl: 'bce-header.scss'
})
export class Header {
  @Prop({ reflectToAttr: true })
  public color?: Color;

  render() {
    return <slot />;
  }
}
