import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { createPopper, Instance } from '@popperjs/core';
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
import { ValidatorError } from '../../utils/validator';
import { MenuControl } from '../../utils/menu-control';

library.add(faAngleDown, faAngleUp);

@Component({
  tag: 'bce-select',
  styleUrl: 'bce-select.scss',
  shadow: true
})
export class Select {
  @Element()
  private el!: HTMLBceSelectElement;

  @Prop({ reflect: true, mutable: true })
  public active?: boolean;

  @Prop({ reflect: true })
  public allowNull?: boolean;

  @Prop({ reflect: true })
  public center?: boolean;

  @Prop({ reflect: true })
  public design?: 'matrix';

  @Prop({ reflect: true })
  public disabled?: boolean;

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

  @Prop({ reflect: true })
  public placeholder?: string;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public type: SelectType = 'checkbox';

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value?: SelectValue;

  #id = window.BCE.generateId();
  #initialized = false;
  #initialValue?: SelectValue = this.value;
  #inputCreator = getInputCreator(this, err => (this.error = !!err));
  #menu!: MenuControl;
  #popper?: Instance;
  #prevTagValue = '';
  #options: (HTMLBceChipElement | HTMLBceOptionElement)[] = [];

  private handleClick = () => {
    switch (this.type) {
      case 'checkbox':
      case 'filter':
        this.value = this.#options
          .filter(option => !!option.value && !!option.checked)
          .map(option => option.value!);
        return;

      case 'choice':
      case 'radio':
        const option = this.#options.find(option => option.checked);
        this.value = option ? option.value : null;
        return;
    }
  };

  private handleFilter = (event: Event) => {
    const value = (event.target as HTMLBceInputElement).value || '';
    const filter = value.toLowerCase().trim();

    for (const option of this.#options) {
      const check1 = option.innerText.toLowerCase();
      const check2 = option.value?.toLowerCase();

      const visible =
        check1.indexOf(filter) >= 0 ||
        (check2 ? check2.indexOf(filter) >= 0 : false);

      option.style.display = visible ? '' : 'none';
    }

    const filtered = this.#options.filter(o => o.style.display !== 'none');
    this.#menu?.setItems(filtered);
    event.stopPropagation();
  };

  private handleSlotChange = () => {
    // Remove existing event listeners
    for (const option of this.#options) this.removeEventHandlers(option);

    // Load new options
    const children = Array.from(this.el.childNodes);
    this.#options = children.filter(
      n => ['BCE-CHIP', 'BCE-OPTION'].indexOf(n.nodeName) >= 0
    ) as any;

    // Initialize options & attach event listeners
    for (const option of this.#options) {
      option.type = this.type;
      option.name = this.name || this.#id;

      if (option.nodeName === 'BCE-OPTION')
        (option as HTMLBceOptionElement).allowNull = this.allowNull;

      this.attachEventHandlers(option);
    }

    if (this.#menu) this.#menu.setItems(this.#options);
  };

  public handleTagKeyDown = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    this.#prevTagValue = input.value;
  };

  public handleTagKeyUp = (event: KeyboardEvent) => {
    if (!Array.isArray(this.value)) this.value = [];

    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    switch (event.key) {
      case 'Backspace': {
        if (this.#prevTagValue.length) return;
        this.value = this.value.slice(0, -1);
        this.dispatchInputEvent();
        return;
      }
      case 'Enter': {
        this.value = [...this.value, value];
        input.value = '';
        this.dispatchInputEvent();
        return;
      }
    }
  };

  public handleTagRemove = (event: Event) => {
    const chip = event.target as HTMLBceChipElement;
    const value = (chip.value || '').trim();

    this.value = Array.isArray(this.value)
      ? this.value.filter(v => v !== value)
      : [];

    this.dispatchInputEvent();
  };

  private ignoreEvent = (event: Event) => {
    event.stopPropagation();
  };

  @Watch('value')
  public watchValue(value?: SelectValue) {
    if (this.#initialized) this.#inputCreator.handleInput();

    switch (this.type) {
      case 'checkbox':
      case 'filter':
        const values = Array.isArray(value)
          ? value
          : (value && value.split(',').map(v => v.trim())) || [];

        for (const option of this.#options)
          option.checked = values.indexOf(option.value || '') >= 0;
        return;

      case 'dropdown':
        this.updateDropdown();
      case 'choice':
      case 'radio':
        for (const option of this.#options)
          option.checked = this.value === option.value;
        return;

      case 'input':
        this.value = Array.isArray(value)
          ? value
          : value?.split(',').map(v => v.trim()) || [];

        return;
    }
  }

  @Listen('bce-core:chip')
  @Listen('bce-core:option')
  public handleChip(event: CustomEvent) {
    const dispatch = !equal(this.value || null, event.detail || null);
    this.value = event.detail;

    if (dispatch) {
      const e = new Event('input', { bubbles: true, composed: true });
      this.el.dispatchEvent(e);
    }
  }

  @Method()
  public async next() {
    return this.#menu && this.#menu.next();
  }

  @Method()
  public async prev() {
    return this.#menu && this.#menu.prev();
  }

  @Method()
  public async reset() {
    this.value = this.#initialValue;
    this.#inputCreator.reset();
  }

  @Method()
  public async toggle(active = !this.active) {
    if (this.type !== 'dropdown') return;
    this.active = active;
    if (this.#popper) this.#popper.update();
  }

  @Method()
  public async validate(silent = false): Promise<ValidatorError[]> {
    return this.#inputCreator.validate(silent);
  }

  private attachEventHandlers(el: HTMLElement) {
    el.addEventListener('click', this.handleClick);
  }

  private dispatchInputEvent() {
    const e = new Event('input', { bubbles: true, composed: true });
    this.el.dispatchEvent(e);
  }

  private removeEventHandlers(el: HTMLElement) {
    el.removeEventListener('click', this.handleClick);
  }

  private updateDropdown() {
    const input = this.el.shadowRoot!.querySelector('bce-input');
    if (!input) return;

    if (!this.value) {
      input.value = '';
      this.#menu.setValue(undefined);
    }

    const option = this.#options.find(o => o.value === this.value);
    if (option) {
      input.value = (option.innerText || '').trim();
      if (this.#menu) this.#menu.setValue(option);
    }
  }

  componentWillLoad() {
    this.watchValue(this.value);
  }

  componentDidLoad() {
    if (this.type === 'dropdown') {
      const root = this.el.shadowRoot!;
      const ref = '.trigger bce-input';
      const reference = root.querySelector(ref) as HTMLBceInputElement;
      const dropdown = root.querySelector("[role='listbox']") as HTMLDivElement;

      this.#menu = new MenuControl({
        parent: this.el,
        trigger: reference,
        onToggle: this.toggle.bind(this),
        listbox: true
      });

      // Create popper.js dropdown
      this.#popper = createPopper(reference, dropdown, {
        modifiers: [{ name: 'offset', options: { offset: [0, 2] } }],
        placement: 'bottom-start',
        strategy: 'fixed'
      });

      // Patch popper.js fixed position
      new (window as any).ResizeObserver(() => {
        const { x, width } = reference.getBoundingClientRect();
        const match = dropdown.style.transform.match(/^translate3d\((\d+)px/);
        const offset = match ? parseFloat(match[1]) : 0;

        dropdown.style.left = `${x - offset}px`;
        dropdown.style.width = width + 'px';
      }).observe(reference);
    }

    const slot = this.el.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', this.handleSlotChange);
    this.handleSlotChange();
    this.watchValue(this.value);

    this.#initialized = true;
  }

  componentDidUnload() {
    if (this.#popper) this.#popper.destroy();
    if (this.#menu) this.#menu.dispose();
  }

  renderDropdown() {
    const InputCreator = this.#inputCreator;

    return (
      <InputCreator>
        <div class="trigger">
          <bce-input
            a11yAriaHaspopup="listbox"
            a11yAriaExpanded={this.active}
            placeholder={this.placeholder}
            data-active={this.active}
            onInput={this.handleFilter}
          />
          <bce-button
            design="text"
            icon={this.active ? 'fas:angle-up' : 'fas:angle-down'}
            tabIndex={-1}
          />
        </div>
        <ul role="listbox" data-active={this.active}>
          <slot />
        </ul>
      </InputCreator>
    );
  }

  renderFieldset() {
    const InputCreator = this.#inputCreator;
    const radio = this.type === 'choice' || this.type === 'radio';
    const role = radio ? 'radiogroup' : 'group';

    return (
      <InputCreator>
        <div class="fieldset" role={role} aria-label={this.label}>
          <slot />
        </div>
      </InputCreator>
    );
  }

  renderTag(value: string) {
    return (
      <bce-chip
        disabled={this.disabled}
        removable
        type="input"
        value={value}
        onRemove={this.handleTagRemove}
      >
        {value}
      </bce-chip>
    );
  }

  renderTagInput() {
    const InputCreator = this.#inputCreator;
    return (
      <InputCreator>
        <div class="container">
          {Array.isArray(this.value) && this.value.map(v => this.renderTag(v))}

          <input
            onInput={this.ignoreEvent}
            onKeyUp={this.handleTagKeyUp}
            onKeyDown={this.handleTagKeyDown}
          />
        </div>
      </InputCreator>
    );
  }

  render() {
    switch (this.type) {
      case 'action':
      case 'checkbox':
      case 'choice':
      case 'filter':
      case 'radio':
        return this.renderFieldset();
      case 'dropdown':
        return this.renderDropdown();
      case 'input':
        return this.renderTagInput();
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
