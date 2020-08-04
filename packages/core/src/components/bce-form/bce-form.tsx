import { Component, Element, h, Host, Method, Prop } from '@stencil/core';

import { FormInput, FORM_INPUTS } from '../../models/form-input';
import { Validation } from '../../models/validation';

@Component({
  tag: 'bce-form',
  styleUrl: 'bce-form.scss',
  shadow: true
})
export class BceForm {
  @Element()
  private el!: HTMLBceFormElement;

  @Prop({ reflect: true })
  public design?: 'card';

  @Prop()
  public errors: Validation[] = [];

  private _inputs: FormInput[] = [];

  private handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLBceButtonElement;
    if (!target) return;

    if (target.type === 'submit') this.submit();
    else if (target.type === 'reset') this.reset();
  };

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    const query = FORM_INPUTS.join(',');
    const element = this.findParentDialog() || this.el;
    this._inputs = Array.from(element.querySelectorAll(query));
  };

  @Method()
  public async reset() {
    const tasks = this._inputs.map(el => el.reset());
    await Promise.all(tasks);
  }

  @Method()
  public async submit() {
    const errors = await this.validate();
    const type = !errors.length ? 'submit' : 'error';
    const event = new Event(type, { bubbles: true, composed: true });
    this.el.dispatchEvent(event);
  }

  @Method()
  public async validate(silent = false) {
    const tasks = this._inputs.map(el => el.validate(silent));
    this.errors = [].concat(...((await Promise.all(tasks)) as any[]));
    return this.errors;
  }

  private findParentDialog() {
    if (!this.el.parentNode || !('host' in this.el.parentNode))
      return undefined;

    const parent = (this.el.parentNode as ShadowRoot).host;
    return parent.nodeName === 'BCE-DIALOG' ? parent : undefined;
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }
  }

  render() {
    return (
      <Host onClick={this.handleClick}>
        <slot />
      </Host>
    );
  }
}
