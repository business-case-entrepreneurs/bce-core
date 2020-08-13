import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State
} from '@stencil/core';

import { OptionType } from '../../models/option-type';
import { SelectValue } from '../../models/select-value';

library.add(faCheck);

@Component({
  tag: 'bce-option',
  styleUrl: 'bce-option.scss',
  shadow: true
})
export class Option {
  @Element()
  private el!: HTMLBceOptionElement;

  @Prop({ reflect: true })
  public allowNull?: boolean;

  // #region Forwarded to native input
  @Prop({ reflect: true })
  public checked?: boolean;

  @Prop({ reflect: true })
  public disabled?: boolean;

  @Prop({ reflect: true })
  public name?: string;

  @Prop({ reflect: true })
  public type: OptionType = 'checkbox';

  @Prop({ reflect: true })
  public value?: string;
  // #endregion

  // #region a11y forwarding
  @Prop({ reflect: false })
  public a11yRole?: string;
  // #endregion

  @State()
  private _hasLabel = false;

  @Event({ eventName: 'bce-core:option' })
  private onOption!: EventEmitter<SelectValue>;

  #id = window.BCE.generateId();

  public handleClick = () => {
    const query = this.name
      ? `bce-option[type='${this.type}'][name='${this.name}']`
      : `bce-option[type='${this.type}']`;

    const elements = this.el.parentNode?.querySelectorAll(query);
    const options = Array.from(elements || []) as HTMLBceOptionElement[];

    switch (this.type) {
      case 'checkbox':
        this.checked = !this.checked;

        const value: SelectValue = options
          .filter(c => !!c.checked)
          .map(c => c.value!);
        this.onOption.emit(value);
        return;

      case 'dropdown':
      case 'radio':
        for (const option of options) {
          if (this.el !== option) option.checked = false;
          else option.checked = this.allowNull ? !option.checked : true;
        }

        this.onOption.emit(this.el.checked ? this.value! : null);
        return;
    }
  };

  private handleSlotChange = () => {
    this._hasLabel = !!this.el.childNodes.length;
  };

  private ignoreEvent = (event: Event) => {
    event.stopPropagation();
  };

  componentWillLoad() {
    this.handleSlotChange();
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', this.handleSlotChange);
  }

  renderInner() {
    return [
      <input
        id={this.#id}
        checked={!!this.checked}
        name={this.name}
        role={this.a11yRole}
        type={this.type === 'dropdown' ? 'checkbox' : this.type}
        aria-selected={this.type === 'dropdown' && this.checked}
        onInput={this.ignoreEvent}
      />,
      this.type === 'checkbox' && this.checked && (
        <bce-icon raw="fas:check" fixed-width />
      ),
      <label
        htmlFor={this.#id}
        onClick={this.ignoreEvent}
        data-empty={!this._hasLabel}
      >
        <slot />
      </label>
    ];
  }

  renderLi() {
    return <li>{this.renderInner()}</li>;
  }

  render() {
    return (
      <Host onClick={this.handleClick}>
        {this.type === 'dropdown' ? this.renderLi() : this.renderInner()}
      </Host>
    );
  }
}
