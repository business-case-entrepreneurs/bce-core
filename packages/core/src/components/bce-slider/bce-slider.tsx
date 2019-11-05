import {
  Component,
  Prop,
  Element,
  h,
  Host,
  State,
  Method
} from "@stencil/core";

import { Validation } from "../../models/validation";
import { debounce } from "../../utils/debounce";
import { validator } from "../../utils/validator";

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

  @Prop({ reflect: true })
  public step: number = 1;

  @Prop({ reflect: true })
  public label?: string;

  @Prop()
  public placeholder = "";

  @Prop()
  public tooltip = "";

  @Prop({ reflect: true })
  public name?: string;

  @Prop({ reflect: true })
  public info?: string;
  // todo
  @Prop({ reflect: true })
  public disabled: boolean = false;

  @Prop({ reflect: true })
  public discrete: boolean = false;
  // todo

  @Prop()
  public value: any = null;

  @Prop({ reflect: true })
  public validation?: string;

  private _debounceValidate = debounce(this.validate.bind(this), 1000);

  @State()
  private error: string = "";

  private handleValidation = () => {
    if (this.error) this.validate();
    else this._debounceValidate();
  };

  componentWillLoad() {
    this.value = this.value || this.defaultValue();
    this.setFillWidth(this.value);
  }

  private defaultValue = () => {
    return this.max < this.min
      ? this.min
      : Math.round((this.max - this.min) / 2 + this.min);
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

  @Method()
  public async validate(silent = false) {
    if (!this.validation) return [];

    const label = this.label || this.placeholder || "";
    const name = this.name || "";
    const meta = { el: this.el };

    const errors = await validator.validate(
      this.validation,
      this.value,
      this.el as any,
      meta
    );

    if (!silent) this.error = errors.length ? errors[0].message : "";
    return errors.map(e => ({ label, name, ...e } as Validation));
  }

  render() {
    return (
      <Host error={!!this.error} onInput={this.handleValidation}>
        <input
          onInput={this.handleChange}
          type="range"
          step={this.step}
          min={this.min}
          max={this.max}
          value={this.value}
        />
        {(this.error || this.info) && <small>{this.error || this.info}</small>}
      </Host>
    );
  }
}
