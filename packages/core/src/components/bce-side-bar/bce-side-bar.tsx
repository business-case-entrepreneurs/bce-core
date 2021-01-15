import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  Watch
} from '@stencil/core';

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

  @Event({ eventName: 'state' })
  public onState!: EventEmitter;

  @Method()
  public async toggle(open?: boolean) {
    if (open != undefined) return (this.state = open ? 'open' : 'closed');

    const isOpen =
      this.state == undefined && window.innerWidth >= 600
        ? false
        : this.state !== 'open';

    return (this.state = isOpen ? 'open' : 'closed');
  }

  @Watch('state')
  public watchState() {
    this.onState.emit(this.state);
  }

  componentDidLoad() {
    const observer = new MutationObserver(() => {
      const root = this.el.shadowRoot!;
      const container = root.querySelector('.container')! as HTMLDivElement;
      container.style.top = this.el.offsetTop + 'px';
      // container.style.height = this.el.offsetHeight + 'px';
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
        <div class="container">
          <slot />
        </div>
      </Host>
    );
  }
}
