import { Component, Element, h, Prop, State, Method } from '@stencil/core';

const NAV_HEIGHT = 56;

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

  private handleButton = () => this.toggle();

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    const nodes = slot.assignedNodes({ flatten: true });
    this._links = nodes.filter(node => node.nodeName === 'A').length;
    this.toggle(this.active);
  };

  @Method()
  public async toggle(active?: boolean) {
    this.active = active != undefined ? active : !this.active;

    // Animation logic
    if (this._timer) window.clearTimeout(this._timer);

    const height = this._links * NAV_HEIGHT;
    this._height = this.active ? 0 : height;

    await new Promise(res => setTimeout(res, 20));
    this._height = this.active ? height : 0;
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
      <bce-nav-button onClick={this.handleButton}></bce-nav-button>,
      <nav {...style}>
        <slot />
      </nav>
    ];
  }
}
