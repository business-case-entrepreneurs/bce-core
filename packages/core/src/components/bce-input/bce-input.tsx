import { Component, Element, h, Prop, Host } from '@stencil/core';

import { UUID } from '../../utils/uuid';

export type InputType =
  | 'color'
  | 'date'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'textarea'
  | 'url';

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

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  @Prop({ reflect: true })
  public label?: string;

  @Prop()
  public tooltip?: string;

  // #region Forwarded to native input & textarea
  @Prop({ reflect: true })
  public disabled = false;

  @Prop()
  public placeholder = '';

  @Prop({ reflect: true })
  public type: InputType = 'text';

  @Prop({ mutable: true })
  public value = '';
  // #endregion

  private _id: string = UUID.v4();

  private handleBlur = () => {
    this.hasFocus = false;
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.value = input.value || '';

    event.cancelBubble = true;
    this.resizeTextarea();
  };

  private resizeTextarea = () => {
    if (this.type !== 'textarea') return;

    const min = window.innerWidth < 1024 || this.compact ? 48 : 40;
    // this.min || (window.innerWidth < 1024 || this.compact ? 48 : 40);

    const { scrollHeight } = this.el.shadowRoot!.querySelector('textarea')!;
    const height = min > scrollHeight ? min : scrollHeight;
    this.el.style.setProperty('height', height + 'px');
  };

  private get hover() {
    if (this.type === 'color' || this.type === 'date') return true;
    return this.hasFocus || !!this.placeholder || !!this.value;
  }

  componentDidLoad() {
    this.resizeTextarea();
    window.addEventListener('resize', this.resizeTextarea);
  }

  componentDidUnload() {
    window.removeEventListener('resize', this.resizeTextarea);
  }

  render() {
    const Input = this.type === 'textarea' ? 'textarea' : 'input';

    return (
      <Host>
        {this.label && (
          <bce-label
            for={this._id}
            hasFocus={this.hasFocus}
            tooltip={this.tooltip}
            data-hover={this.hover}
          >
            {this.label}
          </bce-label>
        )}
        <Input
          type={this.type}
          value={this.value}
          placeholder={this.placeholder}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onInput={this.handleInput}
          data-hover={this.hover}
        />
      </Host>
    );
  }
}
