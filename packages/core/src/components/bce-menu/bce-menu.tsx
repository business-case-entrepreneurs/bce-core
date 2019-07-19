import { Component, Prop, Host, Listen, h } from '@stencil/core';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-menu',
  styleUrl: 'bce-menu.scss'
})
export class BceMenu {
  @Prop({ reflect: true })
  public vertical: boolean = false;

  @Prop({ reflect: true })
  public right: boolean = false;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ reflect: true })
  public toggleDesktop: boolean = false;

  @Prop({ reflectToAttr: true, mutable: true })
  public active = false;

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

  @Listen('toggleMenu', { target: 'window' })
  public toggleMenu() {
    this.active = !this.active;
  }

  public componentDidLoad() {
    if (!this.toggleDesktop && window.innerWidth > 1024) {
      this.active = true;
    }
  }

  // public showMenu = () => {
  //   this.active = true;
  // };

  // public hideMenu = () => {
  //   this.active = false;
  // };

  render() {
    return (
      <Host
        class={{ 'full-width': !this.vertical, right: this.right }}
        active={this.active}
      >
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
