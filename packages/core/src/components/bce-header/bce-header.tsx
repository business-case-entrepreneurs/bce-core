import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-header',
  styleUrl: 'bce-header.scss',
  shadow: true
})
export class BceHeader {
  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public noShadow?: boolean;

  @Prop({ reflect: true })
  public responsive?: boolean;

  render() {
    return (
      <header>
        <slot />
      </header>
    );
  }
}
