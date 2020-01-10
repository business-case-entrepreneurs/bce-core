import { Component, Element, h, Method, Prop } from '@stencil/core';

@Component({
  tag: 'bce-switch',
  styleUrl: 'bce-switch.scss',
  shadow: true
})
export class Switch {
  @Element()
  private el!: HTMLBceSwitchElement;

  @Prop({ reflect: true })
  public block?: boolean;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public disabled?: boolean;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  @Prop({ reflect: true })
  public label?: string;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value = false;

  private handleBlur = () => {
    this.hasFocus = false;
  };

  private handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (input) this.value = input.checked;
    this.el.dispatchEvent(new Event('input', event));
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private ignoreInput = (event: Event) => {
    event.cancelBubble = true;
  };

  @Method()
  public async reset() {}

  @Method()
  public async validate(silent = false) {
    if (!this.validation) return [];
    return [];
  }

  render() {
    return [
      this.label && (
        <bce-label hasFocus={this.hasFocus} tooltip={this.tooltip}>
          {this.label}
        </bce-label>
      ),
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
    ];
  }
}
