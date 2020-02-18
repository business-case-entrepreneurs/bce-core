import { Component, Prop, Element, h } from '@stencil/core';

@Component({
  tag: 'bce-slider',
  styleUrl: 'bce-slider.scss',
  shadow: true
})
export class BceSlider {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public disabled?: boolean;

  @Prop({ reflect: true })
  public max?: number;

  @Prop({ reflect: true })
  public min?: number;

  @Prop({ reflect: true })
  public step?: number;

  @Prop({ mutable: true })
  public value?: number;

  public get _max() {
    return this.max || 100;
  }

  public get _min() {
    return this.min || 0;
  }

  public get _step() {
    return this.step || 1;
  }

  private defaultValue = () => {
    return this._max < this._min
      ? this._min
      : Math.round((this._max - this._min) / 2 + this._min);
  };

  private handleChange = (event: any) => {
    const newValue = event.target.value;
    this.setFillWidth(newValue);
    this.value = newValue;
  };

  public setFillWidth(newValue: number) {
    const input = this.el.shadowRoot!.querySelector('input')!;
    const step = (100 / (this._max - this._min)) * this._step;
    const width = newValue * step - step * this._min;
    input.style.setProperty('--fill-width', `${width}%`);
  }

  componentDidLoad() {
    this.value = this.value || this.defaultValue();
    this.setFillWidth(this.value);
  }

  render() {
    return [
      <input
        max={this._max}
        min={this._min}
        step={this._step}
        type="range"
        value={this.value}
        onInput={this.handleChange}
      />
    ];
  }
}
