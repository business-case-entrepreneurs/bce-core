import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State
} from '@stencil/core';

import { ChipType } from '../../models/chip-type';
import { OptionType } from '../../models/option-type';
import { SelectType } from '../../models/select-type';
import { validator } from '../../utils/validator';

const CHIP_TYPE_MAP: { [Type in SelectType]: ChipType } = {
  checkbox: 'filter',
  input: 'input',
  radio: 'choice'
};

const OPTION_TYPE_MAP: { [Type in SelectType]: OptionType } = {
  checkbox: 'checkbox',
  input: 'checkbox',
  radio: 'radio'
};

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

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

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
  public value?: string | string[];

  @State()
  private error = '';

  private chips: HTMLBceChipElement[] = [];
  private options: HTMLBceOptionElement[] = [];

  private handleBlur = () => {
    this.hasFocus = false;
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    const nodes = slot.assignedNodes();
    this.chips = nodes.filter(n => n.nodeName === 'BCE-CHIP') as any;
    this.options = nodes.filter(n => n.nodeName === 'BCE-OPTION') as any;

    for (const chip of this.chips) {
      chip.type = CHIP_TYPE_MAP[this.type];
      chip.name = this.name;
      this.attachEventHandlers(chip);
    }

    for (const option of this.options) {
      option.type = OPTION_TYPE_MAP[this.type];
      option.name = this.name;
      this.attachEventHandlers(option);
    }
  };

  @Method()
  public async reset() {}

  @Method()
  public async validate(silent = false) {
    if (!this.validation) return [];

    const label = this.label || '';
    const name = this.name || '';
    const meta = { label, name };

    const errors = await validator.validate(this.validation, this.el, meta);
    if (!silent) this.error = errors.length ? errors[0].message : '';

    return errors;
  }

  private attachEventHandlers(el: HTMLElement) {
    el.addEventListener('blur', this.handleBlur);
    el.addEventListener('focus', this.handleFocus);
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }
  }

  render() {
    if (this.type === 'input')
      console.warn('[bce-select] The input type is unimplemented.');

    return (
      <Host>
        {this.label && (
          <bce-label hasFocus={this.hasFocus} tooltip={this.tooltip}>
            {this.label}
          </bce-label>
        )}
        <fieldset>
          {this.label && <legend>{this.label}</legend>}
          <slot />
        </fieldset>
      </Host>
    );
  }
}
