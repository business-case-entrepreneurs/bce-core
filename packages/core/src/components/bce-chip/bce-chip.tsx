import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Prop, Host } from '@stencil/core';

import { ChipDesign } from '../../models/chip-design';
import { ChipType } from '../../models/chip-type';
import { ripple } from '../../utils/ripple';
import { UUID } from '../../utils/uuid';

library.add(faCheck, faTimesCircle);

const INPUT_TYPE_MAP: { [Type in ChipType]: string } = {
  action: 'button',
  choice: 'radio',
  filter: 'checkbox',
  input: 'text'
};

@Component({
  tag: 'bce-chip',
  styleUrls: {
    ['bce-select']: 'bce-chip.select.scss',
    default: 'bce-chip.scss'
  },
  shadow: true
})
export class BceChip {
  @Element()
  private el!: HTMLBceChipElement;

  // #region Custom properties
  @Prop({ reflect: true })
  public design?: ChipDesign;

  @Prop({ reflect: true, attribute: 'focus' })
  public hasFocus?: boolean;

  @Prop({ reflect: true })
  public icon?: string;

  @Prop({ reflect: true })
  public removable?: boolean;

  @Prop({ reflect: true })
  public thumbnail?: string;

  @Prop({ reflect: true })
  public type?: ChipType;
  // #endregion

  // #region Forwarded to native input
  @Prop({ reflect: true })
  public checked?: boolean;

  @Prop({ reflect: true })
  public disabled?: boolean;

  @Prop({ reflect: true })
  public name?: string;

  @Prop({ reflect: true })
  public value?: string;
  // #endregion

  private _id = UUID.v4();

  private handleBlur = () => {
    this.hasFocus = false;
  };

  public handleClick = () => {
    switch (this.type) {
      case 'choice':
        const query = this.name
          ? `bce-chip[type='choice'][name='${this.name}']`
          : "bce-chip[type='choice']";

        const chips = Array.from(this.el.parentNode!.querySelectorAll(query));
        for (const chip of chips as HTMLBceChipElement[])
          chip.checked = this.el === chip ? !chip.checked : false;
        return;

      case 'filter':
        this.checked = !this.checked;
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

  private ignoreClick = (event: Event) => {
    event.preventDefault();
    event.cancelBubble = true;
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

  renderRemove() {
    if (!this.removable) return;

    return (
      <div data-remove>
        <bce-icon pre="fas" name="times-circle" />
      </div>
    );
  }

  render() {
    if (this.type === 'input')
      console.warn('[bce-chip] The input type is unimplemented.');
    if (this.design === 'outline')
      console.warn('[bce-chip] The outline design is unimplemented.');

    return (
      <Host
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseDown={this.handleMouseDown}
      >
        {this.renderThumbnail()}
        {this.renderIcon()}
        <input
          id={this._id}
          checked={!!this.checked}
          name={this.name}
          type={this.type ? INPUT_TYPE_MAP[this.type] : 'button'}
          onClick={this.ignoreClick}
        />
        <label htmlFor={this._id} onClick={this.handleClick}>
          <slot />
        </label>
        {this.renderRemove()}
      </Host>
    );
  }
}
