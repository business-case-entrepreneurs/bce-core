import { Component, Element, h, Method, Prop, Watch } from '@stencil/core';

import { Color } from '../../models/color';
import { InputType, InputValue } from '../../models/input-type';
import { UUID } from '../../utils/uuid';

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
  public value: InputValue = '';

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public info?: string;

  @Prop({ reflect: false })
  public uuid: string = UUID.v4();

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  private _autofocus = false;
  private _options: HTMLBceOptionElement[] = [];
  private _initialized = false;

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.value || '';
    event.cancelBubble = true;
  };

  private handleFocus = (event: Event) => {
    this.hasFocus = true;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  private handleBlur = (event: Event) => {
    this.hasFocus = false;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  private get hover() {
    switch (this.type) {
      case 'checkbox':
      case 'radio':
      case 'switch':
        return false;
      case 'dropdown':
        if (this.type === 'dropdown' && this.hasFocus) return true;
    }

    return this.hasFocus || !!this.value;
  }

  componentWillLoad() {
    this.value = this.parseValue(this.value);
    this._autofocus = this.hasFocus;
    this._initialized = true;
  }

  @Method()
  public async registerOption(option: HTMLBceOptionElement) {
    this._options = [...this._options, option];
  }

  @Watch('value')
  public watchValue(value: InputValue) {
    if (!this._initialized) return;

    this.value = this.parseValue(value);
    if (this.value !== value) return;

    const event = new Event('input');
    this.el.dispatchEvent(event);
  }

  private parseValue(value: InputValue): InputValue {
    if (this.type === 'checkbox' && typeof value === 'string')
      return value ? JSON.parse(value) : [];
    if (this.type === 'dropdown' && typeof value === 'string')
      return value || null;
    if (this.type === 'radio' && typeof value === 'string')
      return value || null;
    if (this.type === 'switch' && typeof value === 'string')
      return value === 'true';

    return value;
  }

  renderInput() {
    const disabled = this.disabled || false;

    switch (this.type) {
      case 'checkbox':
      case 'radio':
        return <slot />;

      case 'container':
        return (
          <div>
            <slot />
          </div>
        );

      case 'dropdown':
        return (
          <bce-dropdown
            value={this.value as string | null}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
          >
            <slot />
          </bce-dropdown>
        );

      case 'switch':
        return <bce-switch value={this.value as boolean} />;

      default:
        console.warn(`[bce-input] Unsupported type: ${this.type}`);

      case 'number':
      case 'password':
      case 'text':
        return (
          <input
            type={this.type}
            value={this.value as string}
            autofocus={this._autofocus}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
          />
        );
    }
  }

  render() {
    return [
      this.renderInput(),
      this.label && <label data-hover={this.hover}>{this.label}</label>,
      this.info && <small>{this.info}</small>
    ];
  }
}
