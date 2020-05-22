import { Component, Element, h, Host, Method, Prop } from '@stencil/core';

@Component({
  tag: 'bce-side-bar',
  styleUrl: 'bce-side-bar.scss',
  shadow: true
})
export class SideBar {
  @Element()
  private el!: HTMLBceSideBarElement;

  @Prop({ reflect: true, mutable: true })
  public state?: 'closed' | 'open';

  @Prop({ reflect: true })
  public position: 'left' | 'right' = 'left';

  @Method()
  public async toggle(open?: boolean) {
    if (open != undefined) return (this.state = open ? 'open' : 'closed');

    const isOpen =
      this.state == undefined && window.innerWidth >= 600
        ? false
        : this.state !== 'open';

    return (this.state = isOpen ? 'open' : 'closed');
  }

  componentDidLoad() {
    const observer = new MutationObserver(() => {
      const root = this.el.shadowRoot!;
      const fixed = root.querySelector('.fixed')! as HTMLDivElement;
      fixed.style.top = this.el.offsetTop + 'px';
    });

    observer.observe(this.el.parentElement!, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  render() {
    return (
      <Host role="complementary">
        <div class="fixed">
          <slot />
        </div>
      </Host>
    );
  }
}
