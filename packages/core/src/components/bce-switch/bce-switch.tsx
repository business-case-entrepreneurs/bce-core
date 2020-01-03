import { Component, Element, h, Prop } from '@stencil/core';

import { UUID } from '../../utils/uuid';

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

  @Prop({ reflect: true, mutable: true })
  public value = false;

  private _id: string = UUID.v4();

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
    return [
      this.label && (
        <bce-label
          for={this._id}
          hasFocus={this.hasFocus}
          tooltip={this.tooltip}
        >
          {this.label}
        </bce-label>
      ),
      <label>
        <input
          id={this._id}
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
    ];
  }
}
