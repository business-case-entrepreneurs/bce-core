import { Component, Element, h, Prop, Host, Method } from '@stencil/core';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-switch',
  styleUrl: 'bce-switch.scss'
})
export class BceSwitch {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ mutable: true })
  public value = false;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  private handleClick = (event: Event) => {
    const target = event.target as HTMLBceSwitchElement | undefined;
    const input = target && target.querySelector('input');
    if (input) input.click();
  };

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
        onClick={this.handleClick}
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
