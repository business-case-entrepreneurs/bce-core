import { Component, Element, h, Prop, Host } from '@stencil/core';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-switch',
  styleUrl: 'bce-switch.scss'
})
export class BceSwitch {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Prop({ mutable: true })
  public value = false;

  @Prop({ reflectToAttr: true })
  public disabled = false;

  @Prop({ attr: 'focus', reflectToAttr: true, mutable: true })
  public hasFocus = false;

  private handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.checked;
    this.el.dispatchEvent(new Event('input', event));
  };

  private handleInput = (event: Event) => {
    event.cancelBubble = true;
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleBlur = () => {
    this.hasFocus = false;
  };

  render() {
    return (
      <Host
        tabIndex={this.disabled ? undefined : 0}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <label>
          <input
            type="checkbox"
            tabIndex={-1}
            checked={this.value}
            disabled={this.disabled}
            onChange={this.handleChange}
            onInput={this.handleInput}
          />
          <div data-on={this.value} data-off={!this.value} />
        </label>
      </Host>
    );
  }
}
