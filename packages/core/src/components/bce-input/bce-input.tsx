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

  @Prop()
  public placeholder = '';

  @Prop()
  public tooltip = '';

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public info?: string;

  @Prop()
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
    this.resizeTextarea();
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

  private resizeTextarea = () => {
    if (this.type !== 'textarea') return;

    const textarea = this.el.querySelector('textarea')!;
    const min = window.innerWidth < 1024 ? 48 : 40;
    const height = textarea.scrollHeight < min ? min : textarea.scrollHeight;
    this.el.style.setProperty('--bce-input-height', height + 'px');
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

    return this.hasFocus || !!this.placeholder || !!this.value;
  }

  componentWillLoad() {
    this.value = this.parseValue(this.value);
    this._autofocus = this.hasFocus;
    this._initialized = true;
  }

  componentDidLoad() {
    this.resizeTextarea();
    window.addEventListener('resize', this.resizeTextarea);
  }

  componentDidUnload() {
    window.removeEventListener('resize', this.resizeTextarea);
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
      case 'container':
      case 'radio':
        return <slot />;

      case 'dropdown':
        return (
          <bce-dropdown
            value={this.value as string | null}
            placeholder={this.placeholder}
            disabled={disabled}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
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

  renderLabel() {
    if (!this.label) return null;

    return (
      <label data-hover={this.hover}>
        {this.label}{' '}
        {this.tooltip && (
          <bce-tooltip placement="right">{this.tooltip}</bce-tooltip>
        )}
      </label>
    );
  }

  render() {
    return [
      this.renderLabel(),
      <div data-input>{this.renderInput()}</div>,
      this.info && <small>{this.info}</small>
    ];
  }
}
