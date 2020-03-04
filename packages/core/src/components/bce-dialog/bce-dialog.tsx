import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop
} from '@stencil/core';

import { Validation } from '../../models/validation';
import { NativeEvent } from '../../utils/native-event';

/// unit active required

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

  private handleClickHost = (event: MouseEvent) => {
    const target = event.target as HTMLBceButtonElement;
    if (target && target.type === 'submit') this.submit();
  };

  private handleClickBackdrop = () => {
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
  public async hide() {
    this.active = false;
  }

  @Method()
  public async show() {
    this.active = true;
  }

  @Method()
  public async submit() {
    const form = this.el.shadowRoot!.querySelector('bce-form');
    if (form) form.submit();
  }

  render() {
    return (
      <Host onClick={this.handleClickHost}>
        <div class="backdrop" onClick={this.handleClickBackdrop} />
        <bce-form onSubmit={this.handleForm} onError={this.handleForm}>
          <slot />

          <div class="action-bar">
            <slot name="action" />
          </div>
        </bce-form>
      </Host>
    );
  }
}
