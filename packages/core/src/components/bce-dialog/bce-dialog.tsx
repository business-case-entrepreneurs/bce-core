import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop
} from '@stencil/core';

import { Validation } from '../../models/validation';
import { NativeEvent } from '../../utils/native-event';

@Component({
  tag: 'bce-dialog',
  styleUrl: 'bce-dialog.scss',
  shadow: true
})
export class BceDialog {
  @Element()
  private el!: HTMLBceDialogElement;

  @Prop({ reflect: true })
  public active?: boolean;

  @Prop({ reflect: true })
  public required?: boolean;

  @Prop()
  public errors: Validation[] = [];

  @Event()
  private backdrop!: EventEmitter;

  private handleClick = () => {
    if (this.required) return;
    this.backdrop.emit();
    this.active = false;
  };

  private handleForm = (event: Event) => {
    const target = event.target as HTMLBceFormElement;
    this.errors = target.errors;
    this.el.dispatchEvent(new NativeEvent(event.type));

    if (!this.errors.length) this.active = false;
  };

  @Method()
  public async close() {
    this.active = false;
    this.el.dispatchEvent(new NativeEvent('close'));
  }

  @Method()
  public async show() {
    this.active = true;
  }

  @Method()
  public async hide() {
    this.active = false;
  }

  render() {
    return [
      <div class="backdrop" onClick={this.handleClick} />,
      <bce-form onSubmit={this.handleForm} onError={this.handleForm}>
        <slot />

        <div class="action-bar">
          <slot name="action" />
        </div>
      </bce-form>
    ];
  }
}
