import { Component, Element, h, State, Method } from '@stencil/core';

const NAV_ITEM = 56;

@Component({
  tag: 'bce-nav',
  styleUrls: {
    'bce-header': 'bce-nav.header.scss',
    default: 'bce-nav.header.scss'
  },
  shadow: true
})
export class Nav {
  @Element()
  private el!: HTMLBceNavElement;

  @State()
  private _active = false;

  @State()
  private _height: number | null = null;

  private _links = 0;
  private _timer = 0;

  private handleButton = () => this.toggle();

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    const nodes = slot.assignedNodes({ flatten: true });
    this._links = nodes.filter(node => node.nodeName === 'A').length;
    this.toggle(this._active);
  };

  @Method()
  public async toggle(active?: boolean) {
    this._active = active != undefined ? active : !this._active;

    // Animation logic
    if (this._timer) window.clearTimeout(this._timer);

    // Reset
    const height = this._links * NAV_ITEM;
    this._height = this._active ? 0 : height;

    await new Promise(res => setTimeout(res, 20));
    this._height = this._active ? height : 0;
    this._timer = window.setTimeout(() => (this._height = null), 300);
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }
  }

  render() {
    const height = this._height != null ? `${this._height}px` : undefined;
    const style = height ? { style: { height } } : {};

    return [
      <bce-button
        color="light"
        design="text"
        icon="square"
        onClick={this.handleButton}
      ></bce-button>,
      <nav data-active={this._active} {...style}>
        <slot />
      </nav>
    ];
  }
}
