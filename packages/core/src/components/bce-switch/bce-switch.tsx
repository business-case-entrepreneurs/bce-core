import { Component, Event, EventEmitter, Prop } from '@stencil/core';

import { Color } from '../../models/color';

@Component({
  tag: 'bce-switch',
  styleUrl: 'bce-switch.scss'
})
export class BceSwitch {
  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Prop({ mutable: true })
  public value = false;

  @Event({ eventName: 'input' })
  private inputEvent!: EventEmitter<Event>;

  private onChange = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.checked;
    this.inputEvent.emit(event);
  };

  private onInput = (event: Event) => {
    event.cancelBubble = true;
  };

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.value}
          onChange={this.onChange}
          onInput={this.onInput}
        />
        <div data-on={this.value} data-off={!this.value} />
      </label>
    );
  }
}
