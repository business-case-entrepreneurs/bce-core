import { Component, Prop, Host, Listen, h } from '@stencil/core';

@Component({
  tag: 'bce-menu',
  styleUrl: 'bce-menu.scss',
  shadow: false
})
export class BceMenu {
  @Prop({ reflect: true })
  public vertical: boolean = false;

  @Prop({ reflect: true })
  public right: boolean = false;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true })
  public toggleDesktop: boolean = false;

  @Prop({ reflect: true, mutable: true })
  public active?: boolean = false;

  @Listen('resize', { target: 'window' })
  public handleResize() {
    requestAnimationFrame(() => {
      if (window.innerWidth < 1024) {
        this.active = false;
      } else if (window.innerWidth > 1024 && !this.toggleDesktop) {
        this.active = true;
      }
    });
  }

  @Listen('toggle-menu', { target: 'window' })
  public toggleMenu() {
    this.active = !this.active;
  }

  public componentDidLoad() {
    if (!this.toggleDesktop && window.innerWidth > 1024) {
      this.active = true;
    }
  }

  public close = () => {
    this.active = false;
  };

  render() {
    return (
      <Host class={this.right ? 'right' : 'left'} active={this.active}>
        {window.innerWidth < 1024 ? (
          <bce-icon
            onClick={this.close}
            raw={'times-circle'}
            pre={'fas'}
            size={'3x'}
          />
        ) : (
          ''
        )}
        <div
          class={{
            menu: true,
            horizontal: !this.vertical,
            verticle: this.vertical
          }}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
