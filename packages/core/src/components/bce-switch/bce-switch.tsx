import { Component, Element, h, Prop } from '@stencil/core';

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

  @Prop({ reflect: true, mutable: true })
  public value = false;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus = false;

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

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.value}
          disabled={this.disabled}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onInput={this.ignoreInput}
        />
        <div data-on={this.value} data-off={!this.value} />
      </label>
    );
  }
}
