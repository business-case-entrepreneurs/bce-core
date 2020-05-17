import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { createPopper } from '@popperjs/core';
import {
  Component,
  Element,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { SelectType } from '../../models/select-type';
import { SelectValue } from '../../models/select-value';
import { ValidatorError } from '../../utils/validator';

library.add(faAngleDown);

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

  @State()
  private _open = false;

  private _initialized = false;
  private _initialValue?: SelectValue = this.value;
  private _inputCreator = getInputCreator(this, err => (this.error = !!err));
  private _options: (HTMLBceChipElement | HTMLBceOptionElement)[] = [];

  private handleBlur = async () => {
    this.hasFocus = false;
    await new Promise(res => setTimeout(res, 200));
    this._open = this._options.some(o => o.hasFocus);
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

  private handleDropdownClick = () => {
    // this._open = !this._open;
  };

  private handleFilter = (event: Event) => {
    const value = (event.target as HTMLBceInputElement).value || '';
    const filter = value.toLowerCase().trim();

    for (const option of this._options) {
      const check1 = option.innerText.toLowerCase();
      const check2 = option.value?.toLowerCase();

      const visible =
        check1.indexOf(filter) >= 0 ||
        (check2 ? check2.indexOf(filter) >= 0 : false);

      option.style.display = visible ? '' : 'none';
    }

    event.stopPropagation();
  };

  private handleFocus = () => {
    this.hasFocus = true;
    this._open = true;
  };

  private handleSlotChange = () => {
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
    if (this._initialized) this._inputCreator.handleInput();

    switch (this.type) {
      case 'checkbox':
      case 'filter':
        const values = Array.isArray(value)
          ? value
          : (value && value.split(',').map(v => v.trim())) || [];

        for (const option of this._options)
          option.checked = values.indexOf(option.value || '') >= 0;
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

    if (this.type === 'dropdown') {
      this.updateDropdown();
      this._open = false;
    }

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
  public async validate(silent = false): Promise<ValidatorError[]> {
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

  private updateDropdown() {
    const option = this._options.find(o => o.value === this.value);
    const input = this.el.shadowRoot!.querySelector('bce-input')!;
    input.value = option?.innerText || '';
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange();
    }

    this.watchValue(this.value);

    if (this.type === 'dropdown') {
      const root = this.el.shadowRoot!;
      const ref = '.trigger bce-input';
      const reference = root.querySelector(ref) as HTMLBceInputElement;
      const dropdown = root.querySelector('.dropdown') as HTMLDivElement;

      // Create popper.js dropdown
      createPopper(reference, dropdown, {
        strategy: 'fixed',
        placement: 'bottom-start',
        modifiers: [{ name: 'offset', options: { offset: [0, 2] } }]
      });

      // Patch popper.js fixed position
      new (window as any).ResizeObserver(() => {
        const { x, width } = reference.getBoundingClientRect();
        const match = dropdown.style.transform.match(/^translate3d\((\d+)px/);
        const offset = match ? parseFloat(match[1]) : 0;

        dropdown.style.left = `${x - offset}px`;
        dropdown.style.width = width + 'px';
      }).observe(reference);
      this.updateDropdown();
    }

    this._initialized = true;
  }

  renderDropdown() {
    const InputCreator = this._inputCreator;

    return (
      <InputCreator>
        <div class="trigger">
          <bce-input
            data-active={this._open}
            onBlur={this.handleBlur}
            onClick={this.handleDropdownClick}
            onFocus={this.handleFocus}
            onInput={this.handleFilter}
          />
          <bce-icon pre="fas" name="angle-down" fixed-width />
        </div>
        <div
          class="dropdown"
          aria-expanded={this._open}
          data-active={this._open}
        >
          <slot />
        </div>
      </InputCreator>
    );
  }

  renderFieldset() {
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

  render() {
    if (this.type === 'input')
      console.warn('[bce-select] The input type is unimplemented.');

    switch (this.type) {
      case 'action':
      case 'checkbox':
      case 'choice':
      case 'filter':
      case 'input':
      case 'radio':
        return this.renderFieldset();

      case 'dropdown':
        return this.renderDropdown();
    }
  }
}

const equal = (a: SelectValue, b: SelectValue) => {
  if (typeof a !== typeof b) return false;
  if (!Array.isArray(a) || !Array.isArray(b)) return a === b;
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};
