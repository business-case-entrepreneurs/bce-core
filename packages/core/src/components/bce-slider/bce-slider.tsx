import {
  Component,
  Prop,
  Element,
  State,
  Event,
  EventEmitter,
  h,
  Host
} from '@stencil/core';

@Component({
  tag: 'bce-slider',
  styleUrl: 'bce-slider.scss',
  shadow: false
})
export class BceSlider {
  @Prop({ reflect: true }) intialValue: number = 50;
  @Prop({ reflect: true }) min: number = 0;
  @Prop({ reflect: true }) max: number = 100;
  @Prop({ reflect: true }) step: number = 1;

  // todo
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) discrete: boolean = false;
  // todo

  @State() value!: number;

  @Element() el!: HTMLElement;

  componentDidLoad() {
    this.value = this.intialValue;
    this.setFillWidth(this.intialValue);
  }

  private handleChange = (event: any) => {
    const newValue = event.target.value;
    this.setFillWidth(newValue);
    this.value = newValue;
  };

  public setFillWidth(newValue: number) {
    const width = (100 / this.max) * newValue;
    this.el.style.setProperty('--fill-width', `${width}%`);
  }

  render() {
    return (
      <input
        onInput={this.handleChange}
        type="range"
        min={this.min}
        max={this.max}
        value={this.value}
      />
    );
  }
}
