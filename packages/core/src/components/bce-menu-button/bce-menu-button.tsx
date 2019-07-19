import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-menu-button',
  styleUrl: 'bce-menu-button.scss'
})
export class BceMenuButton {
  @Prop({ reflect: true })
  public color?: Color;

  @Event() toggleMenu!: EventEmitter;

  public onClick = () => {
    this.toggleMenu.emit();
  };

  render() {
    return (
      <bce-icon onClick={this.onClick} raw={'bars'} pre={'fas'} size={'2x'} />
    );
  }
}
