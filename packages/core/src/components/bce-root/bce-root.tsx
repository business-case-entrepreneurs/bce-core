import { Component, Element, h, Host, Prop } from '@stencil/core';

import { injectCSS } from '../../utils/stylesheet';
import { UUID } from '../../utils/uuid';

@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss',
  shadow: true
})
export class Root {
  @Element()
  private el!: HTMLBceRootElement;

  @Prop({ reflect: true })
  public mode?: 'default' | 'bucket';

  private _padding = 0;

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    // const fab = !!this.el.querySelector('bce-fab');
    const header = this.el.querySelector('bce-header') ? 56 : 0;
    const status = this.el.querySelector('bce-status-bar') ? 20 : 0;
    const padding = header + status;

    if (this._padding !== padding) {
      this._padding = padding;

      const { id } = this.el;
      injectCSS(id, [
        `bce-root#${id} {`,
        `  --bce-padding-top: ${padding}px;`,
        '}'
      ]);
    }
  };

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }

    if (!this.el.id) this.el.id = UUID.v4();
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
