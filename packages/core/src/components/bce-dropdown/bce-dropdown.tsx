import { Component, Element, h, Method, Prop, State } from '@stencil/core';
import Popper from 'popper.js';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-dropdown',
  styleUrl: 'bce-dropdown.scss',
  shadow: false
})
export class BceDropdown {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ mutable: true })
  public value = '';

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  @Prop({ reflect: true })
  public disabled = false;

  @State()
  private options: HTMLBceOptionElement[] = [];

  private onInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.setFilter(input.value || '');
  };

  private onFocus = (event: Event) => {
    this.hasFocus = true;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  private onBlur = (event: Event) => {
    this.hasFocus = false;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  @Method()
  public async registerOption(option: HTMLBceOptionElement) {
    this.options = [...this.options, option];
  }

  @Method()
  public async select(option: string) {
    if (this.value === option) return;

    this.setFilter('');
    this.value = option;

    const event = new Event('input');
    this.el.dispatchEvent(event);
  }

  private setFilter(value: string) {
    for (const option of this.options) option.filter = value;
  }

  componentDidLoad() {
    const reference = this.el.querySelector('input')!;
    const dropdown = this.el.querySelector('div')!;
    const container = this.el.closest('bce-root')!;

    // Initialize positioning engine
    new Popper(reference, dropdown, {
      placement: 'bottom-start',
      modifiers: { preventOverflow: { boundariesElement: container } }
    });
  }

  render() {
    return [
      <input
        type="text"
        onInput={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        disabled={this.disabled}
      />,
      <bce-icon
        pre="fas"
        name="caret-down"
        fixed-width
        data-active={this.hasFocus}
      />,
      <div data-active={this.hasFocus}>
        <slot />
      </div>
    ];
  }
}
