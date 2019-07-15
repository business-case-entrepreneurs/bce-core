import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'bce-menu-item',
  styleUrl: 'bce-menu-item.scss'
})
export class BceMenuItem {
  @Prop()
  public href!: string;

  render() {
    return (
      <a href={this.href}>
        <slot />
      </a>
    );
  }
}
