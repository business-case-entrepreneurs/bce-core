import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Component, Element, h, Method, Prop, State } from '@stencil/core';

import { InputType } from '../../models/input-type';
import { getInputCreator } from '../../utils/input-creator';

const ROW_SIZE = 19;
library.add(faEye, faEyeSlash);

@Component({
  tag: 'bce-input',
  styleUrl: 'bce-input.scss',
  shadow: true
})
export class Input {
  @Element()
  private el!: HTMLBceInputElement;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public compact?: boolean;

  @Prop({ reflect: true })
  public error?: boolean;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

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

  // #region Forwarded to native input & textarea
  @Prop({ reflect: true })
  public autocomplete?: string;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop()
  public placeholder?: string;

  @Prop({ reflect: true })
  public rows?: number;

  @Prop({ reflect: true })
  public type: InputType = 'text';

  @Prop({ mutable: true })
  public value?: string;
  // #endregion

  @State()
  private showPassword = false;

  @State()
  private hasHover = false;

  private _inputCreator = getInputCreator(this, err => (this.error = !!err));
  private _initialValue?: string = this.value;

  private handleBlur = () => {
    this.hasFocus = false;
    this._inputCreator.validate();
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.value || '';

    this.resizeTextarea();
    this._inputCreator.handleInput();
  };

  private handleShowPassword = () => {
    this.showPassword = !this.showPassword;

    const query = this.type === 'textarea' ? 'textarea' : 'input';
    this.el.shadowRoot!.querySelector(query)!.focus();
  };

  private resizeTextarea = () => {
    if (this.type !== 'textarea') return;

    const lines = Math.max(
      this.value ? this.value.split(/\r\n|\r|\n/).length : 0,
      this.rows || 0
    );

    const compact = this.compact || window.innerWidth < 1024;
    const min = compact ? 48 : 40;
    const padding = compact ? 10 + ROW_SIZE : ROW_SIZE;
    const size = lines * ROW_SIZE + padding;
    const height = Math.max(min, size);

    this.el.style.setProperty('height', height + 'px');
  };

  private get hover() {
    if (this.type === 'color' || this.type === 'date') return true;
    return this.hasFocus || !!this.placeholder || !!this.value;
  }

  @Method()
  public async reset() {
    this.value = this._initialValue;
    this._inputCreator.reset();
  }

  @Method()
  public validate(silent = false) {
    return this._inputCreator.validate(silent);
  }

  componentDidLoad() {
    this.resizeTextarea();
    this.el.addEventListener('mouseenter', () => (this.hasHover = true));
    this.el.addEventListener('mouseleave', () => (this.hasHover = false));
    window.addEventListener('resize', this.resizeTextarea);
  }

  componentDidUnload() {
    window.removeEventListener('resize', this.resizeTextarea);
  }

  renderIcon() {
    if (this.type !== 'password') return;

    return (
      <bce-button
        design="text"
        icon={this.showPassword ? 'far:eye' : 'far:eye-slash'}
        tabIndex={-1}
        onClick={this.handleShowPassword}
        data-hidden={!this.value || (!this.hasHover && !this.hasFocus)}
      />
    );
  }

  render() {
    const InputCreator = this._inputCreator;
    const Input = this.type === 'textarea' ? 'textarea' : 'input';
    const type = this.showPassword ? 'text' : this.type;

    return (
      <InputCreator>
        <Input
          autocomplete={this.autocomplete}
          disabled={this.disabled}
          placeholder={this.placeholder}
          type={type}
          value={this.value}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onInput={this.handleInput}
          aria-label={this.label}
          data-hover={this.hover}
        />
        {this.renderIcon()}
      </InputCreator>
    );
  }
}
