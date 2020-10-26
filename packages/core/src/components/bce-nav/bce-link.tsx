import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  Element,
  h,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { ripple } from '../../utils/ripple';

library.add(faCaretDown);

@Component({
  tag: 'bce-link',
  styleUrls: {
    'bce-header': 'bce-link.header.scss',
    'bce-link': 'bce-link.link.scss',
    default: 'bce-link.scss'
  },
  shadow: true
})
export class Link {
  @Element()
  private el!: HTMLBceLinkElement;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ mutable: true })
  public hash?: string;

  @Prop({ reflect: true })
  public icon?: string;

  @Prop({ reflect: false, mutable: true })
  public tab?: boolean;

  @Prop()
  public navigate?: (event: MouseEvent) => void;

  @Prop({ reflect: true, mutable: true })
  public open?: boolean;

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

  @State()
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

  private handleKeyDown = (event: KeyboardEvent) => {
    const sub = this.el.getAttribute('slot') === 'menu';

    switch (event.keyCode) {
      // Enter & Space
      case 13:
      case 32:
        return this.moveIntoFirst();
      // Escape
      case 27:
        return sub ? this.moveOut() : this.toggle(false);
      // End
      case 35:
        return this.focusOther(this.getSiblings().pop()!);
      // Home
      case 36:
        return this.focusOther(this.getSiblings()[0]);
      // Arrow Left
      case 37:
        return sub ? this.moveOutPrev() : this.movePrev();
      // Arrow Up
      case 38:
        return sub ? this.movePrev() : this.moveIntoLast();
      // Arrow Right
      case 39:
        return sub ? this.moveOutNext() : this.moveNext();
      // Arrow Down
      case 40:
        return sub ? this.moveNext() : this.moveIntoFirst();
    }
  };

  private handleMouseDown = (event: MouseEvent) => {
    ripple(this.el.shadowRoot!.querySelector('a')!, event);
  };

  private handleSlotChange = () => {
    this._links = this.getChildren(this.el).length;
    if (this._links) this.toggle(!!this.open);
  };

  @Watch('href')
  public watchHref() {
    const { href } = this;
    const hash = href && href.indexOf('#') >= 0 && '#' + href.split('#').pop();
    this.hash = hash || undefined;
  }

  @Method()
  public async toggle(active?: boolean) {
    this.open = active != undefined ? active : !this.open;
    this._height = this.open ? (this._links || 0) * 56 : 0;
  }

  private focusOther(el: HTMLBceLinkElement) {
    el.shadowRoot!.querySelector('a')!.focus();
    this.tab = false;
    el.tab = true;
  }

  private getChildren(el: HTMLElement): HTMLBceLinkElement[] {
    const nodes = Array.from(el.childNodes) as HTMLBceLinkElement[];
    return nodes.filter(node => node.nodeName === 'BCE-LINK');
  }

  private getParent(grand = false): HTMLBceLinkElement | null {
    const query = grand ? 'bce-link:not([slot="menu"])' : 'bce-link';
    return this.el.parentElement!.closest(query);
  }

  private getSiblings(el = this.el) {
    return this.getChildren(el.parentElement!);
  }

  private moveIntoFirst() {
    if (!this._links) return;
    this.toggle(true);
    this.focusOther(this.getChildren(this.el)[0]);
  }

  private moveIntoLast() {
    if (!this._links) return;
    this.toggle(true);
    this.focusOther(this.getChildren(this.el).pop()!);
  }

  private moveNext(el = this.el) {
    const siblings = this.getSiblings(el);
    const index = siblings.indexOf(el);
    const next = siblings[this.modulo(index + 1, siblings.length)];
    this.focusOther(next);
    next.toggle(el.open);
    el.toggle(false);
  }

  private moveOut() {
    const parent = this.getParent();
    if (!parent) return;
    this.focusOther(parent);
    parent.toggle(false);
  }

  private moveOutNext() {
    const parent = this.getParent();
    if (parent) this.moveNext(parent);
  }

  private moveOutPrev() {
    const parent = this.getParent();
    if (parent) this.movePrev(parent);
  }

  private movePrev(el = this.el) {
    const siblings = this.getSiblings(el);
    const index = siblings.indexOf(el);
    const prev = siblings[this.modulo(index - 1, siblings.length)];
    this.focusOther(prev);
    prev.toggle(el.open);
    el.toggle(false);
  }

  private modulo(i1: number, i2: number) {
    return ((i1 % i2) + i2) % i2;
  }

  private isModifiedEvent(event: MouseEvent) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
  }

  componentWillLoad() {
    this.handleSlotChange();
    this.watchHref();
  }

  componentDidLoad() {
    const root = this.el.shadowRoot!;
    const query = "slot[name='menu']";
    const slot = root.querySelector(query) as HTMLSlotElement;
    slot?.addEventListener('slotchange', this.handleSlotChange);
  }

  renderCaret() {
    return <bce-icon data-toggle pre="fas" name="caret-down" fixed-width />;
  }

  render() {
    return (
      <li role="none">
        <a
          download={this.download}
          href={this.href}
          hreflang={this.hreflang}
          media={this.media}
          rel={this.rel}
          role="menuitem"
          target={this.target}
          tabIndex={this.tab ? 0 : -1}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          aria-expanded={!!this._links && this.open}
          aria-haspopup={!!this._links}
        >
          {this.icon && <bce-icon raw={this.icon} fixed-width />}
          <span>
            <slot />
          </span>

          {!!this._links && this.renderCaret()}
        </a>
        <ul role="menu" style={{ height: `${this._height}px` }}>
          <slot name="menu" />
        </ul>
      </li>
    );
  }
}
