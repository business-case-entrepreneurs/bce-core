import { Component, Element, Prop, State, Watch } from '@stencil/core';

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

  @Prop({ attr: 'focus', reflectToAttr: true, mutable: true })
  public hasFocus = false;

  @State()
  public active = false;

  private handleClick = (event: MouseEvent) => {
    if (this.disabled) event.stopPropagation();
  };

  @Watch('color')
  @Watch('active')
  public updateButtons() {
    const { children } = this.el;
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (!child || child.tagName.toLowerCase() !== 'bce-button') continue;

      // Buttons within a FAB should always have an icon and use the default
      // (contained) type.
      const button = child as HTMLBceButtonElement;
      button.type = undefined;
      button.color = this.color;
      if (!button.icon) button.icon = 'square';

      if (!this.active) button.setAttribute('data-inactive', '');
      else button.removeAttribute('data-inactive');
    }
  }

  componentWillLoad() {
    this.updateButtons();
  }

  hostData() {
    return {};
  }

  render() {
    return [
      <slot />,
      <button
        disabled={this.disabled}
        onClick={() => (this.active = !this.active)}
      >
        <bce-icon
          raw={this.icon}
          size="lg"
          onClick={this.handleClick}
          fixed-width
        />
      </button>,
      <div data-inactive={!this.active} />
    ];
  }
}
