import { Component, Element, h, Prop, State, Method } from '@stencil/core';

import { HEIGHT_HEADER } from '../../utils/constants';

@Component({
  tag: 'bce-nav',
  styleUrls: {
    'bce-header': 'bce-nav.header.scss',
    'bce-side-bar': 'bce-nav.side-bar.scss',
    default: 'bce-nav.side-bar.scss'
  },
  shadow: true
})
export class Nav {
  @Element()
  private el!: HTMLBceNavElement;

  @Prop({ reflect: true, mutable: true })
  public active = false;

  @State()
  private _height: number | null = null;

  private _links = 0;
  private _timer = 0;

  private handleSlotChange = () => {
    const nodes = Array.from(this.el.childNodes);
    this._links = nodes.filter(node => node.nodeName === 'BCE-LINK').length;
    this.toggle(this.active);
  };

  @Method()
  public async toggle(active?: boolean) {
    this.active = active != undefined ? active : !this.active;

    // Collapse nested links
    const links = Array.from(this.el.querySelectorAll('bce-link'));
    for (const link of links) link.toggle(false);

    // Animation logic
    if (this._timer) window.clearTimeout(this._timer);

    const height = this._links * HEIGHT_HEADER;
    this._height = this.active ? 0 : height;

    await new Promise(res => setTimeout(res, 20));
    this._height = this.active ? height : 0;
    this._timer = window.setTimeout(() => (this._height = null), 300);
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange();
    }
  }

  render() {
    const height = this._height != null ? `${this._height}px` : undefined;
    const style = height ? { style: { height } } : {};

    return [
      <bce-nav-button></bce-nav-button>,
      <nav {...style}>
        <slot />
      </nav>
    ];
  }
}
