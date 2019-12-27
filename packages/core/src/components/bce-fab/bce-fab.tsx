import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { BceIcon } from '../bce-icon/bce-icon';
import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-fab',
  styleUrl: 'bce-fab.scss',
  shadow: true
})
export class BceFab {
  @Element()
  private el!: HTMLBceFabElement;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public icon: string = BceIcon.DEFAULT_ICON.iconName;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true, mutable: true })
  public active = false;

  private root?: HTMLBceRootElement;
  private buttons: HTMLBceButtonElement[] = [];

  private handleClick = () => {
    if (this.buttons.length) this.active = !this.active;
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    ripple(event.target as Element, event);
  };

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    this.buttons = slot
      .assignedNodes({ flatten: true })
      .filter(node => node.nodeName === 'BCE-BUTTON') as any;

    for (const button of this.buttons) this.initButton(button);
  };

  private disableClick = (event: MouseEvent) => {
    if (this.disabled) event.stopPropagation();
  };

  @Watch('active')
  public watchActive() {
    for (const button of this.buttons) this.propagateState(button);
  }

  componentWillLoad() {
    // Register FAB with bce-root
    this.root = this.el.closest('bce-root') as HTMLBceRootElement;
    if (this.root) this.root.registerFAB(true);
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }
  }

  componentDidUnload() {
    if (this.root) this.root.registerFAB(false);
  }

  private initButton(button: HTMLBceButtonElement) {
    this.propagateState(button);

    // Always use default type for internal buttons
    button.type = undefined;

    // Inherit color
    button.color = this.color;

    // Ensure that there is always an icon
    button.icon = button.icon || BceIcon.DEFAULT_ICON.iconName;

    // Deactivate the FAB overlay whenever one of the options is pressed. Call
    // the original onclick handler afterwards.
    const { onclick } = button;
    button.onclick = event => {
      this.active = false;
      if (onclick) onclick.apply(button, [event]);
    };
  }

  private propagateState(button: HTMLBceButtonElement) {
    if (!this.active) button.dataset.inactive = '';
    else delete button.dataset.inactive;
  }

  render() {
    return [
      <slot />,
      <button
        disabled={this.disabled}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
      >
        <bce-icon
          raw={this.icon}
          size="lg"
          onClick={this.disableClick}
          fixed-width
        />
      </button>,
      <div onClick={this.handleClick} />
    ];
  }
}
