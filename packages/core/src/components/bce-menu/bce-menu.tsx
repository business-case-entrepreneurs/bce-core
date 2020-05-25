import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import { createPopper, Instance, Placement } from '@popperjs/core';
import { Component, Element, Prop, h, Method } from '@stencil/core';

import { MenuControl } from '../../utils/menu-control';

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
  public label?: string;

  @Prop({ reflect: true })
  public placement = 'bottom-start';

  #menu!: MenuControl;
  #popper?: Instance;

  private get trigger(): HTMLBceButtonElement {
    const root = this.el.shadowRoot!;
    return root.querySelector('.trigger') as HTMLBceButtonElement;
  }

  private handleSlotChange = () => {
    const items = Array.from(this.el.querySelectorAll('bce-button'));
    this.#menu.setItems(items);
  };

  @Method()
  public async next() {
    return this.#menu.next();
  }

  @Method()
  public async prev() {
    return this.#menu.prev();
  }

  @Method()
  public async reattach() {
    const reference = this.trigger;
    const dropdown = this.el.shadowRoot!.querySelector("[role='menu']")!;

    if (this.#popper) this.#popper.destroy();
    this.#popper = createPopper(reference, dropdown as HTMLElement, {
      placement: this.placement as Placement,
      strategy: 'fixed'
    });
  }

  @Method()
  public async toggle(active = !this.active) {
    this.active = active;
    if (this.#popper) this.#popper.update();
  }

  componentDidLoad() {
    this.#menu = new MenuControl(this.el, this.trigger, this.toggle.bind(this));

    const slot = this.el.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', this.handleSlotChange);
    this.handleSlotChange();
    this.reattach();
  }

  componentDidUnload() {
    if (this.#popper) this.#popper.destroy();
    this.#menu.dispose();
  }

  render() {
    return [
      <bce-button
        a11yAriaHaspopup={true}
        a11yAriaExpanded={this.active}
        class="trigger"
        design="text"
        icon={this.icon}
        iconPosition="right"
      >
        {this.label}
      </bce-button>,
      <div role="menu" data-active={this.active}>
        <slot />
      </div>
    ];
  }
}
