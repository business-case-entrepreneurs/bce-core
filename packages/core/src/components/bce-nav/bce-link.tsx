import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Method, Prop, State } from '@stencil/core';

import { HEIGHT_HEADER } from '../../utils/constants';
import { ripple } from '../../utils/ripple';

library.add(faCaretDown);

@Component({
  tag: 'bce-link',
  styleUrls: {
    'bce-link': 'bce-link.link.scss',
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

  @Prop()
  public navigate?: (event: MouseEvent) => void;

  // #region Forwarded to native anchor
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

  private handleClick = (event: MouseEvent) => {
    // Toggle self
    if (this._links) this.toggle();

    // A custom navigate function can be passed and allows client-side routing
    // without a page refresh.
    if (
      this.navigate &&
      event.button === 0 &&
      (!this.target || this.target === '_self') &&
      !this.isModifiedEvent(event)
    ) {
      event.preventDefault();
      this.navigate(event);
    }
  };

  private handleMouseDown = (event: MouseEvent) => {
    ripple(this.el.shadowRoot!.querySelector('a')!, event);
  };

  private handleSlotChange = () => {
    const nodes = Array.from(this.el.childNodes);
    this._links = nodes.filter(node => node.nodeName === 'BCE-LINK').length;
    if (this._links) this.toggle(!!this.active);
  };

  @Method()
  public async toggle(active?: boolean) {
    this.active = active != undefined ? active : !this.active;
    this._height = this.active ? (this._links || 0) * HEIGHT_HEADER : 0;
  }

  private isModifiedEvent(event: MouseEvent) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
  }

  componentWillLoad() {
    this.handleSlotChange();
  }

  componentDidLoad() {
    const root = this.el.shadowRoot!;
    const query = "slot[name='subsection']";
    const slot = root.querySelector(query) as HTMLSlotElement;
    slot?.addEventListener('slotchange', this.handleSlotChange);
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
        <span>
          <slot />
        </span>

        {!!this._links && this.renderCaret()}
      </a>,
      <div style={{ height: `${this._height}px` }}>
        <slot name="subsection" />
      </div>
    ];
  }
}
