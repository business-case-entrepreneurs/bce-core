import { Component, Element, Prop } from '@stencil/core';

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

  private handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.checked;
    this.el.dispatchEvent(new Event('input', event));
  };

  private handleInput = (event: Event) => {
    event.cancelBubble = true;
  };

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.value}
          onChange={this.handleChange}
          onInput={this.handleInput}
        />
        <div data-on={this.value} data-off={!this.value} />
      </label>
    );
  }
}
