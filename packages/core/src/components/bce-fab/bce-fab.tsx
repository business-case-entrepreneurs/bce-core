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
  public info: string = '';

  @Prop({ reflect: true })
  public inline?: boolean;

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
    this.#menu = new MenuControl(this.el, this.trigger, this.toggle.bind(this));

    const slot = this.el.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', this.handleSlotChange);
    this.handleSlotChange();
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
      // this.info && (
      //   <div data-info>
      //     <bce-button
      //       design={this.active ? 'text' : 'contained'}
      //       color={this.color}
      //       disabled={this.disabled}
      //       onClick={this.handleClick}
      //       onMouseDown={this.handleMouseDown}
      //       small
      //     >
      //       {this.info}
      //     </bce-button>
      //   </div>
      // ),
      <button
        class="trigger"
        disabled={this.disabled}
        onMouseDown={this.handleMouseDown}
        aria-haspopup={true}
        aria-expanded={this.active}
      >
        <bce-icon
          raw={this.icon}
          size="lg"
          onClick={this.disableClick}
          fixed-width
        />
      </button>,
      this.inline && this.renderMenu(),
      <div class="backdrop" onClick={() => this.toggle(false)} />
    ];
  }
}
