import { Component, Element, Method, Prop, h } from '@stencil/core';

import { Color } from '../../models/color';
import { InputType } from '../../models/input-type';

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
  public type: InputType = 'text';

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

  private _autofocus = false;
  private options: HTMLBceOptionElement[] = [];

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

  @Method()
  public async registerOption(option: HTMLBceOptionElement) {
    this.options = [...this.options, option];
  }

  componentWillLoad() {
    this._autofocus = this.hasFocus;
  }

  renderInput() {
    const disabled = this.disabled || false;

    switch (this.type) {
      case 'checkbox':
      case 'radio':
        return <slot />;

      case 'dropdown':
        return (
          <bce-dropdown
            onInput={this.onInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            disabled={disabled}
          >
            <slot />
          </bce-dropdown>
        );

      default:
        return (
          <input
            type={this.type}
            value={this.value}
            autofocus={this._autofocus}
            onInput={this.onInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            disabled={disabled}
          />
        );
    }
  }

  render() {
    const hover =
      this.hasFocus ||
      !!this.value ||
      (this.type === 'dropdown' && this.hasFocus);

    return [
      this.renderInput(),
      this.label && <label data-hover={hover}>{this.label}</label>,
      this.info && <small>{this.info}</small>
    ];
  }
}
