import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Prop, Host } from '@stencil/core';

import { OptionType } from '../../models/option-type';
import { UUID } from '../../utils/uuid';

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

  private _id = UUID.v4();

  private handleBlur = () => {
    this.hasFocus = false;
  };

  public handleClick = () => {
    switch (this.type) {
      case 'checkbox':
        this.checked = !this.checked;
        return;

      case 'radio':
        const query = this.name
          ? `bce-option[type='radio'][name='${this.name}']`
          : "bce-option[type='radio']";

        const options = Array.from(this.el.parentNode!.querySelectorAll(query));
        for (const option of options as HTMLBceOptionElement[])
          option.checked = this.el === option;
        return;
    }
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private ignoreClick = (event: Event) => {
    event.preventDefault();
    event.cancelBubble = true;
  };

  render() {
    return (
      <Host onBlur={this.handleBlur} onFocus={this.handleFocus}>
        <input
          id={this._id}
          checked={!!this.checked}
          name={this.name}
          type={this.type}
          onClick={this.ignoreClick}
        />
        {this.type === 'checkbox' && this.checked && (
          <bce-icon raw="fas:check" fixed-width />
        )}
        <label htmlFor={this._id} onClick={this.handleClick}>
          <slot />
        </label>
      </Host>
    );
  }
}
