import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-label',
  styleUrl: 'bce-label.scss',
  shadow: true
})
export class Label {
  @Prop({ reflect: true })
  public for?: string;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus = false;

  @Prop()
  public tooltip?: string;

  render() {
    return (
      <label htmlFor={this.for}>
        <slot />
        {this.tooltip && [
          ' ',
          <bce-tooltip placement="right">{this.tooltip}</bce-tooltip>
        ]}
      </label>
    );
  }
}
