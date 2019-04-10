import { Component, Element, Prop } from '@stencil/core';

import { Color } from '../../models/color';
import { InputType } from '../../models/input-type';

@Component({
  tag: 'bce-input',
  styleUrl: 'bce-input.scss'
})
export class BceInput {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Prop({ reflectToAttr: true })
  public type: InputType = InputType.Text;

  @Prop({ mutable: true })
  public value = '';

  @Prop({ reflectToAttr: true })
  public label?: string;

  @Prop({ reflectToAttr: true })
  public info?: string;

  @Prop({ reflectToAttr: true })
  public disabled = false;

  @Prop({ attr: 'focus', reflectToAttr: true, mutable: true })
  public hasFocus = false;

  private autofocus = false;

  private onInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.value || '';
  };

  private onFocus = (event: Event) => {
    this.hasFocus = true;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  private onBlur = (event: Event) => {
    this.hasFocus = false;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  componentWillLoad() {
    this.autofocus = this.hasFocus;
  }

  render() {
    const types = Object.keys(InputType).map(k => (InputType as any)[k]);
    if (types.indexOf(this.type) < 0) {
      console.warn('[bce-input] unsupported type: ' + this.type);
      return null;
    }

    return [
      <label data-hover={this.hasFocus || !!this.value}>{this.label}</label>,
      this.info && <small>{this.info}</small>,
      <input
        type={this.type}
        value={this.value}
        autofocus={this.autofocus}
        onInput={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        disabled={this.disabled || false}
      />
    ];
  }
}
