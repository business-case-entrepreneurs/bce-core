import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  Host
} from '@stencil/core';

import { ChipDesign } from '../../models/chip-design';
import { ChipType } from '../../models/chip-type';
import { SelectValue } from '../../models/select-value';
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
    regular: 'bce-chip.scss'
  },
  shadow: true
})
export class BceChip {
  @Element()
  private el!: HTMLBceChipElement;

  // #region Custom properties
  @Prop({ reflect: true })
  public design?: ChipDesign;

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

  // #region a11y forwarding
  @Prop({ reflect: false })
  public a11yRole?: string;
  // #endregion

  @Event({ eventName: 'bce-core:chip' })
  private onChip!: EventEmitter<SelectValue>;

  @Event({ eventName: 'remove' })
  private onRemove!: EventEmitter;

  private _id = UUID.v4();

  public handleClick = () => {
    const query = this.name
      ? `bce-chip[type='${this.type}'][name='${this.name}']`
      : `bce-chip[type='${this.type}']`;

    const elements = this.el.parentNode!.querySelectorAll(query);
    const chips = Array.from(elements) as HTMLBceChipElement[];

    switch (this.type) {
      case 'choice':
        for (const chip of chips)
          chip.checked = this.el === chip ? !chip.checked : false;

        this.onChip.emit(this.checked ? this.value! : null);
        return;

      case 'filter':
        this.checked = !this.checked;

        const value: SelectValue = chips
          .filter(c => !!c.checked)
          .map(c => c.value!);
        this.onChip.emit(value);
        return;
    }
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (this.disabled) return;
    ripple(this.el.shadowRoot!.querySelector('label')!, event);
  };

  private handleRemove = (event: Event) => {
    if (this.disabled) return;

    this.onRemove.emit();
    event.stopPropagation();
  };

  private ignoreClick = (event: Event) => {
    event.preventDefault();
    event.cancelBubble = true;
  };

  private isColor(color = ''): boolean {
    const s = new Option().style;
    s.color = color;
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
    if (!this.removable || this.disabled) return;

    return (
      <div data-remove onClick={this.handleRemove}>
        <bce-icon pre="fas" name="times-circle" />
      </div>
    );
  }

  render() {
    if (this.design === 'outline')
      console.warn('[bce-chip] The outline design is unimplemented.');

    return (
      <Host onMouseDown={this.handleMouseDown}>
        {this.renderThumbnail()}
        {this.renderIcon()}
        <input
          checked={!!this.checked}
          id={this._id}
          name={this.name}
          role={this.a11yRole}
          type={this.type ? INPUT_TYPE_MAP[this.type] : 'button'}
          value={this.value}
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
