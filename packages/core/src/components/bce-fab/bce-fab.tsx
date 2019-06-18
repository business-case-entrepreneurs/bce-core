import { Component, Element, Prop, Watch, h } from '@stencil/core';

import { Color } from '../../models/color';
import { BceIcon } from '../bce-icon/bce-icon';

@Component({
  tag: 'bce-fab',
  styleUrl: 'bce-fab.scss'
})
export class BceFab {
  @Element()
  private el!: HTMLBceFabElement;

  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Prop({ reflectToAttr: true })
  public icon: string = BceIcon.DEFAULT_ICON.iconName;

  @Prop({ reflectToAttr: true })
  public disabled = false;

  @Prop({ reflectToAttr: true, mutable: true })
  public active = false;

  private root?: HTMLBceRootElement;

  private get buttons(): HTMLBceButtonElement[] {
    const buttons: HTMLBceButtonElement[] = [];
    const { children } = this.el;
    for (let i = 0; i < children.length; i++) {
      // Look for every child bce-button component
      const child = children.item(i);
      if (!child || child.tagName.toLowerCase() !== 'bce-button') continue;

      buttons.push(child as HTMLBceButtonElement);
    }

    return buttons;
  }

  private handleClick = () => {
    this.active = !this.active;
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
      <button disabled={this.disabled} onClick={this.handleClick}>
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
