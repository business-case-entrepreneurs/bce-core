import { Component, h, Host, Method, Prop } from '@stencil/core';

//todo robin: rick helpen!!!!!!
/// unit: open. normal hidden large screen not.

@Component({
  tag: 'bce-side-bar',
  styleUrl: 'bce-side-bar.scss',
  shadow: true
})
export class SideBar {
  @Prop({ reflect: true, mutable: true })
  public open?: boolean;

  public get style() {
    if (this.open == undefined) return {};
    return this.open ? { width: '256px' } : { width: '0' };
  }

  @Method()
  public async toggle(open?: boolean) {
    if (open != undefined) return (this.open = open);

    // prettier-ignore
    return this.open = this.open == undefined && window.innerWidth >= 600
      ? false
      : !this.open;
  }

  render() {
    return (
      <Host style={this.style}>
        <aside>
          <slot />
        </aside>
      </Host>
    );
  }
}
