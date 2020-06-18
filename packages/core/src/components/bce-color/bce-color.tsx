import { Component, Element, h, Method, Prop, Watch } from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { colorShade } from '../../utils/color';
import { ValidatorError } from '../../utils/validator';

@Component({
  tag: 'bce-color',
  styleUrl: 'bce-color.scss',
  shadow: true
})
export class Color {
  @Element()
  private el!: HTMLBceInputElement;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public compact?: boolean;

  @Prop({ reflect: true })
  public default?: string;

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

  // #region Forwarded to native inputs
  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ mutable: true })
  public value?: string;
  // #endregion

  private _initialValue?: string = this.value;
  private _inputCreator = getInputCreator(this, err => (this.error = !!err));

  private handleBlur = () => {
    this.hasFocus = false;
    this._inputCreator.validate();
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleReset = () => {
    if (!this.default || this.color === this.default) return;
    const [c1, c2] = this.default.split(' ');
    this.updateValue(c1, c2);
  };

  private handleInput = (e: Event) => {
    e.stopPropagation();

    const colors = this.el.shadowRoot!.querySelectorAll('input');
    const [c1, c2] = Array.from(colors).map(i => i.value);
    this.updateValue(c1, c2);
  };

  @Watch('value')
  public watchValue(value?: string) {
    const [c1, c2] = value ? value.split(' ') : [];
    const shades = colorShade(c1, c2);
    if (!shades) return;

    for (const key of Object.keys(shades)) {
      const shade: string = (shades as any)[key];
      this.el.style.setProperty(`--bce-${key}`, shade);
    }
  }

  @Method()
  public async reset() {
    this.value = this.default || this._initialValue;
    this._inputCreator.reset();
  }

  @Method()
  public async validate(silent = false): Promise<ValidatorError[]> {
    return this._inputCreator.validate(silent);
  }

  @Watch('validation')
  public watchValidation() {
    this.validate();
  }

  private updateValue(c1: string, c2: string) {
    this.value = `${c1} ${c2}`;
    this._inputCreator.handleInput();

    const shades = colorShade(c1, c2);
    const event = new CustomEvent('input', { bubbles: true, detail: shades });
    this.el.dispatchEvent(event);
  }

  render() {
    const InputCreator = this._inputCreator;
    const [v1, v2] = this.value ? this.value.split(' ') : [];

    return (
      <InputCreator>
        <div class="container">
          <input
            disabled={this.disabled}
            type="color"
            value={v1}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onInput={this.handleInput}
            aria-label={this.label + ' 1'}
          />
          <input
            disabled={this.disabled}
            type="color"
            value={v2}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onInput={this.handleInput}
            aria-label={this.label + ' 2'}
          />
          <div class="preview">
            {[...Array(9)].map(() => (
              <div></div>
            ))}
          </div>
        </div>
        {this.default && (
          <bce-button design="text" onClick={this.handleReset}>
            Reset
          </bce-button>
        )}
      </InputCreator>
    );
  }
}
