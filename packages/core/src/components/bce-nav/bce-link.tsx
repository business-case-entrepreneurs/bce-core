import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Method, Prop, State } from '@stencil/core';

import { HEIGHT_HEADER } from '../../utils/constants';
import { ripple } from '../../utils/ripple';

library.add(faCaretDown);

@Component({
  tag: 'bce-link',
  styleUrls: {
    'bce-link': 'bce-link.scss',
    default: 'bce-link.scss'
  },
  shadow: true
})
export class Link {
  @Element()
  private el!: HTMLBceLinkElement;

  @Prop({ reflect: true, mutable: true })
  public active?: boolean;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public icon?: string;

  // #region Forwarded to native button
  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public download?: boolean;

  @Prop({ reflect: true })
  public href?: string;

  @Prop({ reflect: true })
  public hreflang?: string;

  @Prop({ reflect: true })
  public media?: string;

  @Prop({ reflect: true })
  public rel?: string;

  @Prop({ reflect: true })
  public target?: string;
  // #endregion

  @State()
  private _height = 0;
  private _links = 0;

  private handleClick = () => this.toggle();

  private handleMouseDown = (event: MouseEvent) => {
    ripple(event.target as Element, event);
  };

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    const nodes = slot.assignedNodes({ flatten: true });
    this._links = nodes.filter(node => node.nodeName === 'BCE-LINK').length;
    if (this._links) this.toggle(!!this.active);
  };

  @Method()
  public async toggle(active?: boolean) {
    this.active = active != undefined ? active : !this.active;
    this._height = this.active ? (this._links || 0) * HEIGHT_HEADER : 0;
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }
  }

  renderCaret() {
    return <bce-icon data-toggle pre="fas" name="caret-down" fixed-width />;
  }

  render() {
    return [
      <a
        download={this.download}
        href={this.href}
        hreflang={this.hreflang}
        media={this.media}
        rel={this.rel}
        target={this.target}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleClick}
      >
        {this.icon && <bce-icon raw={this.icon} fixed-width />}
        <span>{this.label}</span>
        {!!this._links && this.renderCaret()}
      </a>,
      <div style={{ height: `${this._height}px` }}>
        <slot />
      </div>
    ];
  }
}
