import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'bce-logo',
  styleUrl: 'bce-logo.scss',
  shadow: false
})
export class BceLogo {
  @Prop()
  public logoSrc?: string;

  render() {
    return <img src={this.logoSrc} />;
  }
}
