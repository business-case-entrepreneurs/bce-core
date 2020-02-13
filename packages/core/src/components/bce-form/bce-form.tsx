import { Component, Element, h, Method, Prop } from '@stencil/core';

import { FormInput, FORM_INPUTS } from '../../models/form-input';
import { Validation } from '../../models/validation';

@Component({
  tag: 'bce-form',
  shadow: true
})
export class BceForm {
  @Element()
  private el!: HTMLBceFormElement;

  @Prop()
  public errors: Validation[] = [];

  private _inputs: FormInput[] = [];

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;
    this._inputs = Array.from(this.el.querySelectorAll(FORM_INPUTS.join(',')));
  };

  @Method()
  public async reset() {
    const inputs = this.getInputs();
    // for (const input of inputs) await input.reset();
  }

  @Method()
  public async submit() {
    const errors = await this.validate();
    if (!errors.length) this.el.dispatchEvent(new Event('submit'));
    else this.el.dispatchEvent(new Event('error'));
  }

  @Method()
  public async validate(silent = false) {
    // const tasks = this._inputs.map(el => el.validate(silent));
    // this.errors = [].concat(...((await Promise.all(tasks)) as any[]));
    // return this.errors;
    return [];
  }

  private getInputs() {
    return Array.from(this.el.querySelectorAll('bce-input'));
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }
  }

  render() {
    return <slot />;
  }
}
