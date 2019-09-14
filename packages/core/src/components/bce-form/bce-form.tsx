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
  public async validate() {
    const inputs = Array.from(this.el.querySelectorAll('bce-input'));
    const nested = await Promise.all<any>(inputs.map(el => el.validate()));
    this.errors = [].concat(...nested);
    return this.errors;
  }

  @Method()
  public async submit() {
    const errors = await this.validate();
    if (!errors.length) this.el.dispatchEvent(new Event('submit'));
    else this.el.dispatchEvent(new Event('error'));
  }

  render() {
    return <slot />;
  }
}
