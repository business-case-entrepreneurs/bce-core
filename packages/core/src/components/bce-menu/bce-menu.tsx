import { Component, Element, Prop, h, Host, Method } from '@stencil/core';
import Popper from 'popper.js';

@Component({
  tag: 'bce-menu',
  styleUrl: 'bce-menu.scss',
  shadow: true
})
export class BceMenu {
  @Element()
  private el!: HTMLBceMenuElement;

  @Prop({ reflect: true })
  public icon = 'fas:ellipsis-h';

  @Prop({ reflect: true })
  public placement = 'bottom-start';

  private _popper?: Popper;

  @Method()
  public async reattach() {
    const reference = this.el.shadowRoot!.querySelector('.trigger')!;
    const dropdown = this.el.shadowRoot!.querySelector('.dropdown')!;

    if (this._popper) this._popper.destroy();
    this._popper = new Popper(reference, dropdown, {
      placement: this.placement as Popper.Placement,
      positionFixed: true
    });
  }

  componentDidLoad() {
    this.reattach();
  }

  componentDidUnload() {
    if (this._popper) this._popper.destroy();
  }

  render() {
    return (
      <Host>
        <bce-icon class="trigger" raw={this.icon} fixed-width />
        <div class="dropdown">
          <slot />
        </div>
      </Host>
    );
  }
}
