import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
  Method
} from '@stencil/core';

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

  #links = 0;
  #timer = 0;

  private handleSlotChange = () => {
    const nodes = Array.from(this.el.childNodes);
    this.#links = nodes.filter(node => node.nodeName === 'BCE-LINK').length;

    const links = Array.from(this.el.querySelectorAll('bce-link'));
    if (!links.some(l => l.tab)) links[0] && (links[0].tab = true);

    this.toggle(this.active);
  };

  @Method()
  public async toggle(active?: boolean) {
    this.active = active != undefined ? active : !this.active;

    // Collapse nested links
    const links = Array.from(this.el.querySelectorAll('bce-link'));
    for (const link of links) link.toggle(false);

    // Animation logic
    if (this.#timer) window.clearTimeout(this.#timer);

    const height = this.#links * HEIGHT_HEADER;
    this._height = this.active ? 0 : height;

    await new Promise(res => setTimeout(res, 20));
    this._height = this.active ? height : 0;
    this.#timer = window.setTimeout(() => (this._height = null), 300);
  }

  componentWillLoad() {
    this.handleSlotChange();
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', this.handleSlotChange);
  }

  render() {
    const height = this._height != null ? `${this._height}px` : undefined;
    const style = height ? { style: { height } } : {};

    return (
      <Host role="navigation">
        <bce-nav-button></bce-nav-button>
        <ul role="menubar" {...style}>
          <slot />
        </ul>
      </Host>
    );
  }
}
