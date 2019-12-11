import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { BceIcon } from '../bce-icon/bce-icon';
import { ripple } from '../../utils/ripple';

@Component({
  tag: 'bce-fab',
  styleUrl: 'bce-fab.scss',
  shadow: false
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

  private get buttons() {
    const children = Array.from(this.el.children);
    const buttons = children.filter(c => c.tagName !== 'bce-button');
    return buttons as HTMLBceButtonElement[];
  }

  private handleClick = () => {
    const buttons = Array.from(this.el.querySelectorAll('bce-button'));
    if (buttons.length) this.active = !this.active;
  };

  private handleMouseDown = (event: MouseEvent) => {
    ripple(event.target as Element, event);
  };

  private disableClick = (event: MouseEvent) => {
    if (this.disabled) event.stopPropagation();
  };

  @Watch('color')
  private updateButtonColor() {
    for (const button of this.buttons) button.color = this.color;
  }

  componentWillLoad() {
    // Register FAB with bce-root
    this.root = this.el.closest('bce-root') as HTMLBceRootElement;
    if (this.root) this.root.registerFAB(true);

    this.updateButtonColor();

    for (const button of this.buttons) {
      // Always use the default type for internal buttons
      button.type = undefined;

      // Ensure that there is always an icon
      if (!button.icon) button.icon = BceIcon.DEFAULT_ICON.iconName;

      // Deactivate the FAB overlay whenever one of the options is pressed. Call
      // the original onclick handler afterwards.
      const { onclick } = button;
      button.onclick = event => {
        this.handleClick();
        if (onclick) onclick.apply(button, [event]);
      };
    }
  }

  componentDidUnload() {
    if (this.root) this.root.registerFAB(false);
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
