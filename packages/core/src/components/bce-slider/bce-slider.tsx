import { Component, Element, h, Method, Prop, Watch } from '@stencil/core';

import { getInputCreator } from '../../utils/input-creator';

@Component({
  tag: 'bce-slider',
  styleUrl: 'bce-slider.scss',
  shadow: true
})
export class BceSlider {
  @Element()
  private el!: HTMLBceSliderElement;

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

  private _initialValue?: number = this.value;
  private _inputCreator = getInputCreator(this, err => (this.error = !!err));

  private handleBlur = () => {
    this.hasFocus = false;
    this._inputCreator.validate();
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleInput = (event: any) => {
    const input = event.target as HTMLInputElement | undefined;
    if (!input) return;

    this.value = parseInt(input.value, 10);
  };

  @Method()
  public async reset() {
    this.value = this._initialValue;
    this._inputCreator.reset();
  }

  @Method()
  public validate(silent = false) {
    return this._inputCreator.validate(silent);
  }

  @Watch('value')
  public watchValue() {
    const min = this.min != undefined ? this.min : 0;
    const max = this.max != undefined ? this.max : 100;
    const step = this.step != undefined ? this.step : 1;
    const value =
      this.value != undefined ? this.value : Math.round((max - min) / 2 + min);

    const s = (100 / (max - min)) * step;
    const width = value * s - s * min;

    this.el
      .shadowRoot!.querySelector('input')!
      .style.setProperty('--fill-width', `${width}%`);
  }

  componentDidLoad() {
    this.watchValue();
  }

  render() {
    const InputCreator = this._inputCreator;

    return (
      <InputCreator>
        <input
          disabled={this.disabled}
          max={this.max}
          min={this.min}
          step={this.step}
          type="range"
          value={this.value}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onInput={this.handleInput}
          aria-label={this.label}
        />
      </InputCreator>
    );
  }
}
