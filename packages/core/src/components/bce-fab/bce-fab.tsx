import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { Icon } from '../bce-icon/bce-icon';
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

  private buttons: HTMLBceButtonElement[] = [];

  private handleClick = () => {
    if (this.buttons.length) this.active = !this.active;
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    ripple(event.target as Element, event);
  };

  private handleSlotChange = () => {
    const children = Array.from(this.el.childNodes);
    this.buttons = children.filter(n => n.nodeName === 'BCE-BUTTON') as any;
    for (const button of this.buttons) this.initButton(button);
  };

  private disableClick = (event: MouseEvent) => {
    if (this.disabled) event.stopPropagation();
  };

  @Watch('active')
  @Watch('inline')
  public watch() {
    for (const button of this.buttons) this.propagateState(button);
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange();
    }
  }

  private initButton(button: HTMLBceButtonElement) {
    this.propagateState(button);

    // Always use default design for internal buttons
    button.design = undefined;

    // Ensure that there is always an icon
    button.icon = button.icon || Icon.DEFAULT_ICON.iconName;

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

    if (this.inline) button.dataset.inline = '';
    else delete button.dataset.inline;
  }

  render() {
    return [
      !this.inline && <slot />,
      this.info && (
        <div data-info>
          <bce-button
            design={this.active ? 'text' : 'contained'}
            color={this.color}
            disabled={this.disabled}
            onClick={this.handleClick}
            onMouseDown={this.handleMouseDown}
            small
          >
            {this.info}
          </bce-button>
        </div>
      ),
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
      this.inline && (
        <div class="container">
          <slot />
        </div>
      ),
      <div class="backdrop" onClick={this.handleClick} />
    ];
  }
}
