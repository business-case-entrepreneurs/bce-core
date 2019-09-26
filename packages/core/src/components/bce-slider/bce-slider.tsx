import { Component, Prop, Element, State, h } from "@stencil/core";

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
  public max: number = 100;

  @Prop({ reflect: true })
  public initialValue: number | undefined = undefined;

  @Prop({ reflect: true })
  public step: number = 1;

  // todo
  @Prop({ reflect: true })
  public disabled: boolean = false;

  @Prop({ reflect: true })
  public discrete: boolean = false;
  // todo

  @State()
  private value: number | undefined = undefined;

  componentDidLoad() {
    this.value = this.initialValue;
    this.setFillWidth(this.initialValue || this.max);
  }

  private handleChange = (event: any) => {
    const newValue = event.target.value;
    this.setFillWidth(newValue);
    this.value = newValue;
  };

  public setFillWidth(newValue: number) {
    const width = (100 / this.max) * (newValue - this.min);
    this.el.style.setProperty("--fill-width", `${width}%`);
  }

  render() {
    return [
      <input
        onInput={this.handleChange}
        default-value={this.initialValue}
        type="range"
        step={this.step}
        min={this.min}
        max={this.max}
        value={this.value}
      />
    ];
  }
}
