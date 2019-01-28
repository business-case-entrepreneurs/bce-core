import { Component, Event, EventEmitter, Prop } from '@stencil/core';

import { Input } from '../../models/input';

@Component({
  tag: 'bce-input',
  styleUrl: 'bce-input.scss'
})
export class BceInput {
  @Prop({ reflectToAttr: true })
  public type: Input = Input.Text;

  @Prop({ reflectToAttr: true })
  public label?: string;

  @Prop({ attr: 'focus', reflectToAttr: true, mutable: true })
  public hasFocus = false;

  @Prop({ mutable: true })
  public value = '';

  @Event({ eventName: 'input' })
  private inputEvent!: EventEmitter<KeyboardEvent>;

  private autofocus = false;

  private onInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.value || '';
    this.inputEvent.emit(event as KeyboardEvent);
  };

  private onFocus = () => {
    this.hasFocus = true;
  };

  private onBlur = () => {
    this.hasFocus = false;
  };

  componentWillLoad() {
    this.autofocus = this.hasFocus;
  }

  render() {
    const supportedTypes = Object.keys(Input).map(k => (Input as any)[k]);
    if (supportedTypes.indexOf(this.type) < 0) {
      console.warn('[bce-input] unsupported type: ' + this.type);
      return null;
    }

    return [
      <label data-hover={this.hasFocus || !!this.value}>{this.label}</label>,
      <input
        type={this.type}
        value={this.value}
        autofocus={this.autofocus}
        onInput={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    ];
  }
}
