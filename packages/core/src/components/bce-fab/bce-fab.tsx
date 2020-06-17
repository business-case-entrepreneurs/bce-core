import { Component, Element, h, Method, Prop, Watch } from '@stencil/core';

import { Icon } from '../bce-icon/bce-icon';
import { MenuControl } from '../../utils/menu-control';
import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-fab',
  styleUrl: 'bce-fab.scss',
  shadow: true
})
export class Fab {
  @Element()
  private el!: HTMLBceFabElement;

  @Prop({ reflect: true, mutable: true })
  public active?: boolean;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public disabled?: boolean;

  @Prop({ reflect: true })
  public icon: string = Icon.DEFAULT_ICON.iconName;

  @Prop({ reflect: true })
  public inline?: boolean;

  @Prop({ reflect: true })
  public label?: string;

  #items: HTMLBceButtonElement[] = [];
  #menu!: MenuControl;

  private get trigger(): HTMLBceButtonElement {
    const root = this.el.shadowRoot!;
    return root.querySelector('.trigger') as HTMLBceButtonElement;
  }

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    ripple(event.target as Element, event);
  };

  private handleSlotChange = () => {
    this.#items = Array.from(this.el.querySelectorAll('bce-button'));
    this.#menu.setItems(this.#items);
    for (const item of this.#items) this.initButton(item);
  };

  private disableClick = (event: MouseEvent) => {
    if (this.disabled) event.stopPropagation();
  };

  @Watch('active')
  @Watch('inline')
  public watch() {
    for (const button of this.#items) this.propagateState(button);
  }

  @Method()
  public async next() {
    return this.#menu.next();
  }

  @Method()
  public async prev() {
    return this.#menu.prev();
  }

  @Method()
  public async toggle(active = !this.active) {
    if (this.#items.length) this.active = active;
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
  }

  componentDidUnload() {
    this.#menu.dispose();
  }

  private initButton(button: HTMLBceButtonElement) {
    this.propagateState(button);

    // Always use default design for internal buttons
    button.design = undefined;

    // Ensure that there is always an icon
    button.icon = button.icon || Icon.DEFAULT_ICON.iconName;
  }

  private propagateState(button: HTMLBceButtonElement) {
    if (!this.active) button.dataset.inactive = '';
    else delete button.dataset.inactive;

    if (this.inline) button.dataset.inline = '';
    else delete button.dataset.inline;
  }

  renderMenu() {
    return (
      <div role="menu">
        <slot />
      </div>
    );
  }

  render() {
    return [
      !this.inline && this.renderMenu(),
      <button
        class="trigger"
        disabled={this.disabled}
        onClick={this.disableClick}
        onMouseDown={this.handleMouseDown}
        aria-haspopup="menu"
        aria-expanded={this.active}
      >
        {this.label && (
          <div class="label">
            <span>{this.label}</span>
          </div>
        )}
        <bce-icon raw={this.icon} size="lg" fixed-width />
      </button>,
      this.inline && this.renderMenu(),
      <div class="backdrop" onClick={() => this.toggle(false)} />
    ];
  }
}
