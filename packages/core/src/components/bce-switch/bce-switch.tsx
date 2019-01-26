import { Component, Event, EventEmitter, Prop } from '@stencil/core';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-switch',
  styleUrl: 'bce-switch.scss'
})
export class Switch {
  @Prop({ mutable: true })
  public value: boolean = false;

  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Event({ eventName: 'input' })
  private onInput!: EventEmitter<boolean>;

  private onChange = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = event.target as HTMLInputElement;
    this.value = input.checked;

    this.onInput.emit(this.value);
  };

  render() {
    return (
      <label>
        <input type="checkbox" checked={this.value} onChange={this.onChange} />
        <div data-on={this.value} data-off={!this.value} />
      </label>
    );
  }
}
