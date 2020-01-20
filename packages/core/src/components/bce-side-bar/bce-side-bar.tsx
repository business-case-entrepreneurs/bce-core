import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bce-side-bar',
  styleUrl: 'bce-side-bar.scss',
  shadow: true
})
export class SideBar {
  @Element()
  private el!: HTMLBceSideBarElement;

  @Prop()
  public collapsed?: boolean;

  render() {
    const style = this.collapsed ? { width: '0' } : {};

    return (
      <Host style={style}>
        <aside>
          <slot />
        </aside>
      </Host>
    );
  }
}
