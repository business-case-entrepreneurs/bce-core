import { Component, Element, Prop, Watch } from '@stencil/core';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-fab',
  styleUrl: 'bce-fab.scss'
})
export class BceFab {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Prop({ reflectToAttr: true })
  public icon = 'square';

  @Prop({ reflectToAttr: true })
  public disabled = false;

  @Prop({ reflectToAttr: true, mutable: true })
  public active = false;

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
    this.updateButtonColor();

    for (const button of this.buttons) {
      // Always use the default type for internal buttons
      button.type = undefined;

      // Ensure that there is always an icon
      if (!button.icon) button.icon = 'square';

      // Deactivate the FAB overlay whenever one of the options is pressed. Call
      // the original onclick handler afterwards.
      const { onclick } = button;
      button.onclick = event => {
        this.handleClick();
        if (onclick) onclick.apply(button, [event]);
      };
    }
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
