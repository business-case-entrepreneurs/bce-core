import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-header',
  styleUrl: 'bce-header.scss',
  shadow: true
})
export class BceHeader {
  @Prop({ reflect: true })
  public color?: string;

  render() {
    return (
      <header>
        <slot />
      </header>
    );
  }
}
