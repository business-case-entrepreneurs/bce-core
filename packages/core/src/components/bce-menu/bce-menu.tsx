import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import { createPopper, Instance, Placement } from '@popperjs/core';
import { Component, Element, Prop, h, Method, State } from '@stencil/core';

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
  public color?: string;

  @Prop({ reflect: true })
  public icon = 'fas:ellipsis-h';

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public labelCollapse?: 'small' | 'medium' | 'large';

  @Prop({ reflect: true })
  public placement = 'bottom-start';

  @State()
  public hideLabel = false;

  #menu?: MenuControl;
  #popper?: Instance;

  private get trigger(): HTMLBceButtonElement {
    const root = this.el.shadowRoot!;
    return root.querySelector('.trigger') as HTMLBceButtonElement;
  }

  private handleSlotChange = () => {
    const items = Array.from(this.el.querySelectorAll('bce-button'));
    this.#menu?.setItems(items);
  };

  private handleResize = () => {
    const BP = { small: 600, medium: 1024, large: 1440 };
    const width = window.innerWidth;
    this.hideLabel = !!this.labelCollapse && width < BP[this.labelCollapse];
  };

  @Method()
  public async next() {
    return this.#menu?.next();
  }

  @Method()
  public async prev() {
    return this.#menu?.prev();
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

  componentWillLoad() {
    if (this.label && this.labelCollapse) {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    }
  }

  componentDidLoad() {
    this.#menu = new MenuControl({
      parent: this.el,
      trigger: this.trigger,
      onToggle: this.toggle.bind(this)
    });

    const slot = this.el.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', this.handleSlotChange);
    this.handleSlotChange();
    this.reattach();
  }

  disconnectedCallback() {
    if (this.#popper) this.#popper.destroy();
    if (this.#menu) this.#menu.dispose();
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return [
      <bce-button
        a11yAriaHaspopup="menu"
        a11yAriaExpanded={this.active}
        class="trigger"
        design="text"
        icon={this.icon}
        iconPosition="right"
      >
        {!this.hideLabel && this.label}
      </bce-button>,
      <div role="menu" data-active={this.active}>
        <slot />
      </div>
    ];
  }
}
