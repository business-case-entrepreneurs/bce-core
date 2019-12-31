import { library } from '@fortawesome/fontawesome-svg-core';
import { Component, Element, h, Prop, Host } from '@stencil/core';
import { faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { ChipKind } from '../../models/chip-kind';
import { ChipType } from '../../models/chip-type';
import { ripple } from '../../utils/ripple';
import { UUID } from '../../utils/uuid';

library.add(faCheck, faTimesCircle);

const INPUT_TYPES: { [Type in ChipType]: string } = {
  action: 'button',
  choice: 'radio',
  filter: 'checkbox',
  input: 'text'
};

@Component({
  tag: 'bce-chip',
  styleUrl: 'bce-chip.scss',
  shadow: true
})
export class BceChip {
  @Element()
  private el!: HTMLBceFormElement;

  // #region Custom properties
  @Prop({ reflect: true })
  public type?: ChipType;

  @Prop({ reflect: true })
  public kind?: ChipKind;

  @Prop({ reflect: true })
  public thumbnail?: string;

  @Prop({ reflect: true })
  public icon?: string;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  // #endregion

  // #region Forwarded to native input
  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true })
  public name?: string;

  @Prop({ reflect: true })
  public value?: string;

  @Prop({ reflect: true })
  public checked?: boolean;
  // #endregion

  private id = UUID.v4();

  private handleBlur = () => {
    this.hasFocus = false;
  };

  public handleClick = (event: Event) => {
    switch (this.type) {
      case 'filter':
        this.checked = !this.checked;
        return;

      default:
        return;
    }
  };

  private handleFocus = () => {
    this.hasFocus = true;
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    ripple(this.el.shadowRoot!.querySelector('label')!, event);
  };

  private isColor(color?: string): boolean {
    const s = new Option().style;
    s.color = color || null;
    return !!s.color;
  }

  renderThumbnail() {
    if (!this.thumbnail) return;

    const isColor = this.isColor(this.thumbnail);
    const color = isColor ? this.thumbnail : 'rgba(0, 0, 0, 20%)';

    return (
      <div style={{ backgroundColor: color }} data-thumbnail>
        {!isColor && <img src={this.thumbnail} />}
      </div>
    );
  }

  renderIcon() {
    let icon = this.icon;
    switch (this.type) {
      case 'choice':
        if (this.icon) {
          const warning = `[bce-chip] ${this.type} type has no support for icons.`;
          console.warn(warning);
        }
        break;

      case 'filter':
        icon = this.checked ? icon || 'fas:check' : '';
        break;
    }

    return (
      icon && (
        <div data-icon>
          <bce-icon raw={icon} fixed-width />
        </div>
      )
    );
  }

  render() {
    return (
      <Host
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseDown={this.handleMouseDown}
      >
        {this.renderThumbnail()}
        {this.renderIcon()}
        <input
          id={this.id}
          type={this.type ? INPUT_TYPES[this.type] : 'button'}
          checked={!!this.checked}
        />
        <label htmlFor={this.id} onClick={this.handleClick}>
          <slot />
        </label>
      </Host>
    );
    // this.kind === 'input' && <bce-icon pre="fas" name="times-circle" />
  }
}
