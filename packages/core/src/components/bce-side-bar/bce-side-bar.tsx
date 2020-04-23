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
  public open?: boolean;

  @Prop({ reflect: true })
  public position: 'left' | 'right' = 'left';

  public get style() {
    if (this.open == undefined) return {};
    return this.open ? { width: '256px' } : { width: '0' };
  }

  @Method()
  public async toggle(open?: boolean) {
    if (open != undefined) return (this.open = open);

    // prettier-ignore
    return this.open = this.open == undefined && window.innerWidth >= 600
      ? false
      : !this.open;
  }

  componentDidLoad() {
    const observer = new MutationObserver(() => {
      const aside = this.el.shadowRoot!.querySelector('aside')!;
      aside.style.top = this.el.offsetTop + 'px';
    });

    observer.observe(this.el.parentElement!, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  render() {
    return (
      <Host style={this.style}>
        <aside style={this.style}>
          <slot />
        </aside>
      </Host>
    );
  }
}
