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

  @Prop({ reflect: false, mutable: true })
  public value: InputValue = '';

  @Prop({ reflect: false })
  public placeholder = '';

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

    if (this.type === 'textarea') {
      const textarea = this.el.querySelector('textarea')!;
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  private handleFocus = (event: FocusEvent) => {
    this.hasFocus = true;

    if (!event.bubbles) {
      const e = new FocusEvent(event.type, { ...event, bubbles: true });
      this.el.dispatchEvent(e);
    }
  };

  private handleBlur = (event: FocusEvent) => {
    this.hasFocus = false;

    if (!event.bubbles) {
      const e = new FocusEvent(event.type, { ...event, bubbles: true });
      this.el.dispatchEvent(e);
    }
  };

  private get hover() {
    switch (this.type) {
      case 'checkbox':
      case 'radio':
      case 'switch':
        return false;
      case 'color':
      case 'date':
      case 'file':
        return true;
      case 'dropdown':
        if (this.hasFocus) return true;
    }

    return this.hasFocus || this.placeholder || !!this.value;
  }

  componentWillLoad() {
    this.value = this.parseValue(this.value);
    this._autofocus = this.hasFocus;
    this._initialized = true;
  }

  componentDidLoad() {
    if (this.type !== 'textarea') return;

    const textarea = this.el.querySelector('textarea')!;
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  @Method()
  public async registerOption(option: HTMLBceOptionElement) {
    this._options = [...this._options, option];

    option.addEventListener('focus', this.handleFocus);
    option.addEventListener('blur', this.handleBlur);
  }

  @Watch('value')
  public watchValue(value: InputValue) {
    if (!this._initialized) return;

    this.value = this.parseValue(value);
    if (this.value !== value) return;

    const event = new Event('input', { bubbles: true });
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
          <div onFocus={this.handleFocus} onBlur={this.handleBlur}>
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
        return (
          <bce-switch
            value={this.value as boolean}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={this.value as string}
            placeholder={this.placeholder}
            autofocus={this._autofocus}
            disabled={disabled}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        );

      default:
        console.warn(`[bce-input] Unsupported type: ${this.type}`);

      case 'color':
      case 'date':
      case 'file':
      case 'number':
      case 'password':
      case 'text':
        return (
          <input
            type={this.type}
            value={this.value as string}
            placeholder={this.placeholder}
            autofocus={this._autofocus}
            disabled={disabled}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
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
