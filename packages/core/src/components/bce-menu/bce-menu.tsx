import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import { createPopper, Instance, Placement } from '@popperjs/core';
import { Component, Element, Prop, h, Host, Method } from '@stencil/core';

library.add(FAS.faEllipsisH);

@Component({
  tag: 'bce-menu',
  styleUrl: 'bce-menu.scss',
  shadow: true
})
export class BceMenu {
  @Element()
  private el!: HTMLBceMenuElement;

  @Prop({ reflect: true, mutable: true })
  public active?: boolean;

  @Prop({ reflect: true })
  public icon = 'fas:ellipsis-h';

  @Prop({ reflect: true })
  public placement = 'bottom-start';

  private _popper?: Instance;

  private handleBlur = async () => {
    await new Promise(res => setTimeout(res, 200));
    this.active = false;
  };

  private handleClick = (event: Event) => {
    this.active = !this.active;
    if (this._popper) this._popper.update();
    event.stopPropagation();
  };

  @Method()
  public async reattach() {
    const reference = this.el.shadowRoot!.querySelector('.trigger')!;
    const dropdown = this.el.shadowRoot!.querySelector('.dropdown')!;

    if (this._popper) this._popper.destroy();
    this._popper = createPopper(reference, dropdown as HTMLElement, {
      placement: this.placement as Placement,
      strategy: 'fixed'
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
      <Host onClick={this.handleClick} onBlur={this.handleBlur}>
        <bce-button class="trigger" design="text" icon={this.icon}></bce-button>
        <div class="dropdown" data-active={this.active}>
          <slot />
        </div>
      </Host>
    );
  }
}
