import { library } from '@fortawesome/fontawesome-svg-core';
import { Component, Element, h, Prop } from '@stencil/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { ChipType } from '../../models/chip-type';
import { ChipRole } from '../../models/chip-role';

library.add(faTimesCircle);

@Component({
  tag: 'bce-chip',
  styleUrl: 'bce-chip.scss',
  shadow: true
})
export class BceChip {
  @Element()
  private el!: HTMLBceFormElement;

  @Prop({ reflect: true })
  public type?: ChipType;

  @Prop({ reflect: true })
  public role?: ChipRole;

  @Prop({ reflect: true })
  public icon?: string;

  render() {
    return [
      this.icon && <bce-icon raw={this.icon} fixed-width />,
      <slot />,
      this.role === 'input' && <bce-icon pre="fas" name="times-circle" />
    ];
  }
}
