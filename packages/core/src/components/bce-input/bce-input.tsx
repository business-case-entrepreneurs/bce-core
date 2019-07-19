import { Component, Element, Prop, h } from '@stencil/core';

import { Color } from '../../models/color';
import { InputType } from '../../models/input-type';
import Popper from 'popper.js';

@Component({
  tag: 'bce-input',
  styleUrl: 'bce-input.scss',
  shadow: false
})
export class BceInput {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ reflect: true })
  public type: InputType = InputType.Text;

  @Prop({ mutable: true })
  public value = '';

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public info?: string;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  private autofocus = false;

  private onInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.value || '';
  };

  private onFocus = (event: Event) => {
    this.hasFocus = true;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  private onBlur = (event: Event) => {
    this.hasFocus = false;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  componentWillLoad() {
    this.autofocus = this.hasFocus;
  }

  componentDidLoad() {
    if (this.type === InputType.Dropdown) {
      const reference = this.el.querySelector('input')!;
      const dropdown = this.el.querySelector('.options')!;
      const container = this.el.closest('bce-root')!;

      new Popper(reference, dropdown, {
        placement: 'bottom-start',
        modifiers: {
          // flip: { behavior: ['top', 'bottom'] },
          preventOverflow: { boundariesElement: container }
        }
      });
    }
  }

  private renderInput() {
    switch (this.type) {
      case InputType.Number:
      case InputType.Password:
      case InputType.Text:
        return (
          <input
            type={this.type}
            value={this.value}
            autofocus={this.autofocus}
            onInput={this.onInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            disabled={this.disabled || false}
          />
        );

      case InputType.Dropdown:
        return [
          <input
            type="text"
            value={this.value}
            onInput={this.onInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            disabled={this.disabled || false}
          />,
          <bce-icon
            pre="fas"
            name="caret-down"
            fixed-width
            data-active={this.hasFocus}
          />,
          <div class="options" data-active={this.hasFocus}>
            <slot />
          </div>
        ];
    }
  }

  render() {
    const types = Object.keys(InputType).map(k => (InputType as any)[k]);
    if (types.indexOf(this.type) < 0) {
      console.warn('[bce-input] unsupported type: ' + this.type);
      return null;
    }

    const hover =
      this.hasFocus || !!this.value || this.type === InputType.Dropdown;

    return [
      <label data-hover={hover}>{this.label}</label>,
      this.info && <small>{this.info}</small>,
      this.renderInput()
    ];
  }
}
