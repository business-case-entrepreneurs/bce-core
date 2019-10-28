import { Component, Prop, Element, h } from "@stencil/core";

@Component({
  tag: "bce-slider",
  styleUrl: "bce-slider.scss",
  shadow: false
})
export class BceSlider {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public min: number = 0;

  @Prop({ reflect: true })
  public max: number = 10;

  // @Prop({ reflect: true })
  // public initialValue: number | undefined = undefined;

  @Prop({ reflect: true })
  public step: number = 1;

  // todo
  @Prop({ reflect: true })
  public disabled: boolean = false;

  @Prop({ reflect: true })
  public discrete: boolean = false;
  // todo

  @Prop()
  public value: number | undefined = undefined;

  componentDidLoad() {
    this.value = this.value || this.defaultValue();
    this.setFillWidth(this.value);
  }

  private defaultValue = () => {
    return this.max < this.min
      ? this.min
      : (this.max - this.min) / 2 + this.min;
  };
  private handleChange = (event: any) => {
    const newValue = event.target.value;
    this.setFillWidth(newValue);
    this.value = newValue;
  };

  public setFillWidth(newValue: number) {
    const step = (100 / (this.max - this.min)) * this.step;
    const width = newValue * step - step * this.min;
    this.el.style.setProperty("--fill-width", `${width}%`);
  }

  render() {
    return [
      <input
        onInput={this.handleChange}
        type="range"
        step={this.step}
        min={this.min}
        max={this.max}
        value={this.value}
      />
    ];
  }
}
