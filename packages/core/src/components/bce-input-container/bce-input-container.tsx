import { Component, h, Method, Prop } from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { ValidatorError } from '../../utils/validator';

@Component({
  tag: 'bce-input-container',
  styleUrl: 'bce-input-container.scss',
  shadow: true
})
export class InputContainer {
  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public error?: boolean;

  @Prop({ reflect: true })
  public info?: string;

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public name?: string;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public validation?: string;

  private _inputCreator = getInputCreator(this, err => (this.error = !!err));

  @Method()
  public async reset() {
    this._inputCreator.reset();
  }

  @Method()
  public async validate(silent = false): Promise<ValidatorError[]> {
    return this._inputCreator.validate(silent);
  }

  render() {
    const InputCreator = this._inputCreator;
    return (
      <InputCreator>
        <div class="container">
          <slot />
        </div>
      </InputCreator>
    );
  }
}
