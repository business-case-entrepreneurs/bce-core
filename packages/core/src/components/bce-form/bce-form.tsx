import { Component, Element, h, Method, Prop } from '@stencil/core';

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

  @Method()
  public async validate(silent = false) {
    // const inputs = this.getInputs();
    // const nested = await Promise.all(inputs.map(el => el.validate(silent)));
    // this.errors = [].concat(...(nested as any[]));
    // return this.errors;
    return [];
  }

  @Method()
  public async submit() {
    const errors = await this.validate();
    if (!errors.length) this.el.dispatchEvent(new Event('submit'));
    else this.el.dispatchEvent(new Event('error'));
  }

  @Method()
  public async reset() {
    const inputs = this.getInputs();
    // for (const input of inputs) await input.reset();
  }

  private getInputs() {
    return Array.from(this.el.querySelectorAll('bce-input'));
  }

  render() {
    return <slot />;
  }
}
