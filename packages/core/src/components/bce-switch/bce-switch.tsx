import { Component, Element, h, Method, Prop } from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { ValidatorError } from '../../utils/validator';

@Component({
  tag: 'bce-switch',
  styleUrl: 'bce-switch.scss',
  shadow: true
})
export class Switch {
  @Element()
  private el!: HTMLBceSwitchElement;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public disabled?: boolean;

  @Prop({ reflect: true })
  public error?: boolean;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  @Prop({ reflect: true })
  public info?: string;

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public name?: string;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value?: boolean;

  private _initialValue?: boolean = this.value;
  private _inputCreator = getInputCreator(this, err => (this.error = !!err));

  private handleBlur = () => {
    this.hasFocus = false;
    this._inputCreator.validate();
  };

  private handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (input) this.value = input.checked;

    const e = new Event('input', { bubbles: true, composed: true });
    this.el.dispatchEvent(e);
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private ignoreInput = (event: Event) => {
    event.cancelBubble = true;
  };

  @Method()
  public async reset() {
    this.value = this._initialValue;
    this._inputCreator.reset();
  }

  @Method()
  public async validate(silent = false): Promise<ValidatorError[]> {
    return this._inputCreator.validate(silent);
  }

  render() {
    const InputCreator = this._inputCreator;

    return (
      <InputCreator>
        <div class="slot-container">
          <slot />
          <slot name={'' + !!this.value} />
        </div>
        <label>
          <input
            type="checkbox"
            checked={this.value}
            disabled={this.disabled}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onInput={this.ignoreInput}
            aria-label={this.label}
          />
          <div data-on={this.value} data-off={!this.value} />
        </label>
      </InputCreator>
    );
  }
}
