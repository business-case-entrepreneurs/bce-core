import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { Validation } from '../../models/validation';
import { debounce } from '../../utils/debounce';
import { UUID } from '../../utils/uuid';
import { validator } from '../../utils/validator';

library.add(faEye, faEyeSlash);

// TODO: Better handling of min & max value

@Component({
  tag: 'bce-input-old',
  styleUrl: 'bce-input.old.scss',
  shadow: false
})
export class BceInput {
  @Element()
  private el!: HTMLBceInputOldElement;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public type: any = 'text';

  @Prop({ mutable: true })
  public value: any = '';

  @Prop()
  public placeholder = '';

  @Prop()
  public tooltip = '';

  @Prop({ reflect: true })
  public name?: string;

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public info?: string;

  @Prop({ reflect: true })
  public compact = false;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true })
  public min = 0;

  @Prop({ reflect: true })
  public dateMin = '';

  @Prop({ reflect: true })
  public dateMax = '';

  @Prop({ reflect: true })
  public numberMin = '';

  @Prop({ reflect: true })
  public numberMax = '';

  @Prop({ reflect: true })
  public sliderMin: number = 0;

  @Prop({ reflect: true })
  public sliderMax: number = 10;

  @Prop({ reflect: true })
  public sliderStep: number = 1;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  @Prop({ reflect: true })
  public validation?: string;

  @Prop()
  public uuid: string = UUID.v4();

  @State()
  private error: string = '';

  @State()
  private reveal: boolean = false;

  private _autofocus = false;
  private _debounceValidate = debounce(this.validate.bind(this), 1000);
  private _options: HTMLBceOptionElement[] = [];
  private _initialized = false;
  private _initialValue: any = '';
  private _resetting = false;

  private handleValidation = () => {
    if (this.error) this.validate();
    else if (!this._resetting) this._debounceValidate();
  };

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.value || '';

    event.cancelBubble = true;
    this.resizeTextarea();
  };

  private handleFocus = (event: FocusEvent) => {
    this.hasFocus = true;

    if (!event.bubbles) {
      const e = new FocusEvent(event.type, { ...event, bubbles: true });
      this.el.dispatchEvent(e);
    }
  };

  private handleBlur = (event: FocusEvent) => {
    this.hasFocus = false;
    this.validate();

    if (!event.bubbles) {
      const e = new FocusEvent(event.type, { ...event, bubbles: true });
      this.el.dispatchEvent(e);
    }
  };

  private handleClick = () => {
    const container = this.el.querySelector('[data-input]')!;
    const input =
      this.type === 'dropdown'
        ? (container.firstChild as HTMLElement).querySelector('input')
        : (container.firstChild as HTMLElement);

    if (input && typeof input.focus === 'function') input.focus();
  };

  private toggleReveal = () => {
    this.reveal = !this.reveal;
  };

  private resizeTextarea = () => {
    if (this.type !== 'textarea') return;

    const min =
      this.min || (window.innerWidth < 1024 || this.compact ? 48 : 40);

    const { scrollHeight } = this.el.querySelector('textarea')!;
    const height = min > scrollHeight ? min : scrollHeight;
    this.el.style.setProperty('--bce-input-height', height + 'px');
  };

  private get hover() {
    switch (this.type) {
      case 'checkbox':
      case 'radio':
      case 'switch':
        return false;
      case 'color':
      case 'date':
      case 'file':
        return true;
      case 'dropdown':
        if (this.hasFocus) return true;
    }

    return this.hasFocus || !!this.placeholder || !!this.value;
  }

  public get _min() {
    switch (this.type) {
      case 'date':
        return this.dateMin;
      case 'number':
        return this.numberMin;
      default:
        return undefined;
    }
  }

  public get _max() {
    switch (this.type) {
      case 'date':
        return this.dateMax;
      case 'number':
        return this.numberMax;
      default:
        return undefined;
    }
  }

  componentWillLoad() {
    this.value = this.parseValue(this.value);
    this._autofocus = this.hasFocus;
    this._initialized = true;
    this._initialValue = this.value;
  }

  componentDidLoad() {
    this.resizeTextarea();
    window.addEventListener('resize', this.resizeTextarea);
    this.el.dispatchEvent(new Event('load'));
  }

  componentDidUnload() {
    window.removeEventListener('resize', this.resizeTextarea);
  }

  @Method()
  public async registerOption(option: HTMLBceOptionElement) {
    this._options = [...this._options, option];

    option.addEventListener('focus', this.handleFocus);
    option.addEventListener('blur', this.handleBlur);

    this.updateOptionValue(option);
  }

  @Method()
  public async validate(silent = false) {
    if (!this.validation) return [];

    const label = this.label || this.placeholder || '';
    const name = this.name || '';
    const meta = { el: this.el };

    const errors = await validator.validate(this.validation, this.el, meta);

    if (!silent) this.error = errors.length ? errors[0].message : '';
    return errors.map(e => ({ label, name, ...e } as Validation));
  }

  @Method()
  public async reset() {
    this._resetting = true;
    this.value = this._initialValue;
    this.error = '';
  }

  @Watch('value')
  public watchValue(value: any) {
    if (!this._initialized) return;

    this.value = this.parseValue(value);
    if (this.value !== value) return;

    for (const option of this._options) this.updateOptionValue(option);
    const event = new Event('input', { bubbles: true });
    this.el.dispatchEvent(event);
  }

  private updateOptionValue(option: any) {
    switch (this.type) {
      case 'checkbox': {
        const v = this.value as string[] | undefined;
        option.checked = !!v && v.indexOf(option.value!) >= 0;
        break;
      }
      case 'radio': {
        const v = this.value as string | undefined;
        option.checked = v === option.value;
        break;
      }
    }
  }

  private parseValue(value: any): any {
    if (this.type === 'checkbox' && typeof value === 'string')
      return value ? JSON.parse(value) : [];
    if (this.type === 'dropdown' && typeof value === 'string')
      return value || null;
    if (this.type === 'radio' && typeof value === 'string')
      return value || null;
    if (this.type === 'switch' && typeof value === 'string')
      return value === 'true';

    return value;
  }

  renderInput() {
    const disabled = this.disabled || false;

    switch (this.type) {
      case 'checkbox':
      case 'container':
      case 'radio':
        return <slot />;

      case 'dropdown':
        return (
          <bce-dropdown
            value={this.value as string | null}
            placeholder={this.placeholder}
            compact={this.compact}
            disabled={disabled}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          >
            <slot />
          </bce-dropdown>
        );

      case 'password':
        return [
          <input
            type={this.reveal ? 'text' : 'password'}
            value={this.value as string}
            placeholder={this.placeholder}
            autofocus={this._autofocus}
            disabled={disabled}
            min={this._min}
            max={this._max}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />,

          <bce-button
            design="text"
            icon={this.reveal ? 'eye-slash' : 'eye'}
            icon-only
            onClick={this.toggleReveal}
          />
        ];

      case 'slider':
        return (
          <bce-slider
            value={this.value}
            disabled={disabled}
            min={this.sliderMin}
            max={this.sliderMax}
            step={this.sliderStep}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        );

      case 'switch':
        return (
          <bce-switch
            value={this.value as boolean}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={this.value as string}
            placeholder={this.placeholder}
            autofocus={this._autofocus}
            disabled={disabled}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        );

      default:
        console.warn(`[bce-input] Unsupported type: ${this.type}`);

      case 'color':
      case 'date':
      case 'file':
      case 'number':
      case 'text':
        return (
          <input
            type={this.type}
            value={this.value as string}
            placeholder={this.placeholder}
            autofocus={this._autofocus}
            disabled={disabled}
            min={this._min}
            max={this._max}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        );
    }
  }

  renderLabel() {
    if (!this.label) return null;

    return (
      <label data-hover={this.hover} onClick={this.handleClick}>
        {this.label}{' '}
        {this.tooltip && (
          <bce-tooltip placement="right">{this.tooltip}</bce-tooltip>
        )}
      </label>
    );
  }

  render() {
    return (
      <Host error={!!this.error} onInput={this.handleValidation}>
        {this.renderLabel()}
        <div data-input>{this.renderInput()}</div>
        {(this.error || this.info) && <small>{this.error || this.info}</small>}
      </Host>
    );
  }
}
