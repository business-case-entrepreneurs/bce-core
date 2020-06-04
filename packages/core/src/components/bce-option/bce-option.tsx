import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop
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

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

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

  @Event({ eventName: 'bce-core:option' })
  private onOption!: EventEmitter<SelectValue>;

  #id = window.BCE.generateId();

  private handleBlur = () => {
    this.hasFocus = false;
  };

  public handleClick = (event: Event) => {
    event.preventDefault();
    event.cancelBubble = true;

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
        for (const option of options) option.checked = this.el === option;
        this.onOption.emit(this.value!);
        return;
    }
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private ignoreEvent = (event: Event) => {
    event.cancelBubble = true;
  };

  render() {
    return (
      <Host
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onFocus={this.handleFocus}
      >
        <input
          id={this.#id}
          checked={!!this.checked}
          name={this.name}
          type={this.type === 'dropdown' ? 'checkbox' : this.type}
          onInput={this.ignoreEvent}
        />
        {this.type === 'checkbox' && this.checked && (
          <bce-icon raw="fas:check" fixed-width />
        )}
        <label htmlFor={this.#id} onClick={this.ignoreEvent}>
          <slot />
        </label>
      </Host>
    );
  }
}
