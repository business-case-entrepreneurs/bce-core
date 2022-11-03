import { Component, Element, h, Method, Prop, Watch } from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { ValidatorError } from '../../utils/validator';

@Component({
  tag: 'bce-slider',
  styleUrl: 'bce-slider.scss',
  shadow: true
})
export class BceSlider {
  @Element()
  private el!: HTMLBceSliderElement;

  @Prop({ reflect: true })
  public block?: boolean;

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
  public max?: number;

  @Prop({ reflect: true })
  public min?: number;

  @Prop({ reflect: true })
  public name?: string;

  @Prop({ reflect: true })
  public step?: number;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value?: number;

  #initialValue?: number;
  #inputCreator = getInputCreator(this, err => (this.error = !!err));

  private handleBlur = () => {
    this.hasFocus = false;
    this.#inputCreator.validate();
  };

  private handleClick = () => {
    if (this.value == undefined) {
      const min = this.min != undefined ? this.min : 0;
      const max = this.max != undefined ? this.max : 100;
      this.value = Math.round((max - min) / 2 + min);
    }
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleInput = (event: any) => {
    const input = event.target as HTMLInputElement | undefined;
    if (!input) return;

    this.value = parseInt(input.value, 10);
  };

  constructor() {
    this.#initialValue = this.value;
  }

  @Method()
  public async reset() {
    this.value = this.#initialValue;
    this.#inputCreator.reset();
  }

  @Method()
  public async validate(silent = false): Promise<ValidatorError[]> {
    return this.#inputCreator.validate(silent);
  }

  @Watch('value')
  public watchValue() {
    const min = this.min != undefined ? this.min : 0;
    const max = this.max != undefined ? this.max : 100;
    const value =
      this.value != undefined ? this.value : Math.round((max - min) / 2 + min);

    const s = 100 / (max - min);
    const width = value * s - s * min;
    const fillWidth = this.value != undefined ? width : 0;

    this.el
      .shadowRoot!.querySelector('input')!
      .style.setProperty('--fill-width', `${fillWidth}%`);
  }

  componentDidLoad() {
    this.watchValue();
  }

  render() {
    const InputCreator = this.#inputCreator;

    return (
      <InputCreator>
        <input
          data-value={this.value}
          disabled={this.disabled}
          max={this.max}
          min={this.min}
          step={this.step}
          type="range"
          value={this.value}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onInput={this.handleInput}
          aria-label={this.label}
        />
      </InputCreator>
    );
  }
}
