interface ScrollSpyOptions {
  class: string;
}

interface ScrollSpyNode {
  nav: HTMLElement;
  section: HTMLElement;
}

export class ScrollSpy {
  private readonly selector: string;
  private readonly options: ScrollSpyOptions;

  private current: ScrollSpyNode | null = null;
  private nodes: ScrollSpyNode[] = [];
  private offset: number = 0;
  private timeout: number = 0;

  private handleScroll = () => {
    if (this.timeout) window.cancelAnimationFrame(this.timeout);
    this.timeout = window.requestAnimationFrame(() => this.detect());
  };

  private get active() {
    const last = this.nodes[this.nodes.length - 1];
    if (this.bottom && this.isVisible(last.section)) return last;

    for (let i = this.nodes.length - 1; i >= 0; i--)
      if (this.isVisible(this.nodes[i].section)) return this.nodes[i];

    return null;
  }

  private get bottom() {
    const { root: r } = this;
    return r.scrollHeight - window.innerHeight <= r.scrollTop;
  }

  private get root() {
    return (
      (document.scrollingElement as HTMLElement) || document.documentElement
    );
  }

  constructor(selector: string, options: Partial<ScrollSpyOptions> = {}) {
    this.selector = selector;
    this.options = { class: 'active', ...options };
    this.reload();

    window.addEventListener('resize', this.handleScroll);
    window.addEventListener('scroll', this.handleScroll);
  }

  public destroy() {
    if (this.current) this.deactivate(this.current);

    window.removeEventListener('resize', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
  }

  public detect() {
    const { active } = this;
    const current = this.current;

    if (current) {
      if (current === active) return;
      else this.deactivate(current);
    }

    if (active) this.activate(active);
    this.current = active;
  }

  public reload() {
    const { root: r } = this;
    const elements = r.querySelectorAll<HTMLElement>(this.selector);

    this.nodes = Array.from(elements).reduce<ScrollSpyNode[]>((acc, el) => {
      const hash = 'hash' in el ? (el as HTMLHyperlinkElementUtils).hash : '';
      const id = decodeURIComponent(hash.slice(1));

      const section = document.getElementById(id);
      return section ? [...acc, { nav: el, section }] : acc;
    }, []);

    this.offset = Math.min(...this.nodes.map(node => node.section.offsetTop));

    this.detect();
  }

  private activate(node: ScrollSpyNode) {
    node.nav.classList.add(this.options.class);
  }

  private deactivate(node: ScrollSpyNode) {
    node.nav.classList.remove(this.options.class);
  }

  private isVisible(el: HTMLElement, bottom?: boolean) {
    const rect = el.getBoundingClientRect();
    return bottom ? rect.bottom < window.innerHeight : rect.top <= this.offset;
  }
}
