import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bce-dialog',
  styleUrl: 'bce-dialog.scss',
  shadow: false
})
export class BceDialog {
  @Prop({ reflect: true })
  public required = false;

  @Event()
  private backdrop!: EventEmitter;

  private handleClick = () => {
    if (!this.required) this.backdrop.emit();
  };

  render() {
    return [
      <div data-backdrop onClick={this.handleClick} />,
      <div data-dialog>
        <slot />

        <div data-actions>
          <slot name="action" />
        </div>
      </div>
    ];
  }
}
