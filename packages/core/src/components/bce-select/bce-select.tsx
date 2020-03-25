import {
  Component,
  Element,
  h,
  Listen,
  Method,
  Prop,
  Watch
} from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { SelectType } from '../../models/select-type';
import { SelectValue } from '../../models/select-value';

@Component({
  tag: 'bce-select',
  styleUrl: 'bce-select.scss',
  shadow: true
})
export class Select {
  @Element()
  private el!: HTMLBceSelectElement;

  @Prop({ reflect: true })
  public center?: boolean;

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
  public type: SelectType = 'checkbox';

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value?: SelectValue;

  private _initialized = false;
  private _initialValue?: SelectValue = this.value;
  private _inputCreator = getInputCreator(this, err => (this.error = !!err));
  private _options: (HTMLBceChipElement | HTMLBceOptionElement)[] = [];
  private _value: string[] = [];

  private handleBlur = () => {
    this.hasFocus = false;
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleClick = () => {
    switch (this.type) {
      case 'checkbox':
      case 'filter':
        this.value = this._options
          .filter(option => !!option.value && !!option.checked)
          .map(option => option.value!);
        return;

      case 'choice':
      case 'radio':
        const option = this._options.find(option => option.checked);
        this.value = option ? option.value : null;
        return;
    }
  };

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    // Remove existing event listeners
    for (const option of this._options) this.removeEventHandlers(option);

    // Load new options
    const children = Array.from(this.el.childNodes);
    this._options = children.filter(
      n => ['BCE-CHIP', 'BCE-OPTION'].indexOf(n.nodeName) >= 0
    ) as any;

    // Initialize options & attach event listeners
    for (const option of this._options) {
      option.type = this.type;
      option.name = this.name;
      this.attachEventHandlers(option);
    }
  };

  @Watch('value')
  public watchValue(value?: SelectValue) {
    if (this.type === 'checkbox' || this.type === 'filter') {
      this._value = Array.isArray(value)
        ? value
        : (value && value.split(',').map(v => v.trim())) || [];
    }

    if (this._initialized) this._inputCreator.handleInput();

    switch (this.type) {
      case 'checkbox':
      case 'filter':
        for (const option of this._options)
          option.checked = this._value.indexOf(option.value || '') >= 0;
        return;

      case 'choice':
      case 'radio':
        for (const option of this._options)
          option.checked = this.value === option.value;
        return;
    }
  }

  @Listen('bce-core:chip')
  @Listen('bce-core:option')
  public handleChip(event: CustomEvent) {
    const dispatch = !equal(this.value || null, event.detail || null);
    this.value = event.detail;

    if (dispatch) {
      const e = new Event('input', { bubbles: true, cancelable: true });
      this.el.dispatchEvent(e);
    }
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

  private attachEventHandlers(el: HTMLElement) {
    el.addEventListener('blur', this.handleBlur);
    el.addEventListener('click', this.handleClick);
    el.addEventListener('focus', this.handleFocus);
  }

  private removeEventHandlers(el: HTMLElement) {
    el.removeEventListener('blur', this.handleBlur);
    el.removeEventListener('click', this.handleClick);
    el.removeEventListener('focus', this.handleFocus);
  }

  componentDidLoad() {
    this.watchValue(this.value);

    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }

    this._initialized = true;
  }

  render() {
    if (this.type === 'input')
      console.warn('[bce-select] The input type is unimplemented.');

    const InputCreator = this._inputCreator;
    return (
      <InputCreator>
        <fieldset>
          {this.label && <legend>{this.label}</legend>}
          <slot />
        </fieldset>
      </InputCreator>
    );
  }
}

const equal = (a: SelectValue, b: SelectValue) => {
  if (typeof a !== typeof b) return false;
  if (!Array.isArray(a) || !Array.isArray(b)) return a === b;
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};
