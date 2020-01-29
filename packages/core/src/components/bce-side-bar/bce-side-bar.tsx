import { Component, h, Host, Method, State } from '@stencil/core';

@Component({
  tag: 'bce-side-bar',
  styleUrl: 'bce-side-bar.scss',
  shadow: true
})
export class SideBar {
  @State()
  private _open?: boolean;

  public get style() {
    if (this._open == undefined) return {};
    return this._open ? { width: '256px' } : { width: '0' };
  }

  @Method()
  public async toggle(open?: boolean) {
    if (open != undefined) return (this._open = open);

    // prettier-ignore
    return this._open = this._open == undefined && window.innerWidth >= 600
      ? false
      : !this._open;
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
