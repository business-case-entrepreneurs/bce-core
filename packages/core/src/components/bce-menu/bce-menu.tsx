import { Component, Prop, Host, State, Listen, h } from '@stencil/core';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-menu',
  styleUrl: 'bce-menu.scss'
})
export class BceMenu {
  @Prop({ reflect: true })
  public verticale: boolean = false;

  @Prop({ reflect: true })
  public right: boolean = false;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ reflect: true })
  public toggleDesktop: boolean = false;

  @Prop({ reflectToAttr: true, mutable: true })
  public active = false;

  @State() isMobileMenuShown: boolean = false;
  @State() isDeskstopMenuShown: boolean = true;

  @Listen('resize', { target: 'window' })
  public handleResize() {
    requestAnimationFrame(() => {
      if (window.innerWidth > 768) {
        this.isMobileMenuShown = false;
      }
    });
  }

  @Listen('toggleMenu', { target: 'window' })
  public toggleMenu() {
    this.isMobileMenuShown ? this.hideMenu() : this.showMenu();
  }

  public componentDidLoad() {
    this.isMobileMenuShown === false;
    // if (!this.toggleDesktop) {
    //   this.active = true;
    // }
  }

  public showMenu = () => {
    if (this.isMobileMenuShown) return;
    this.isMobileMenuShown = true;
    this.active = true;
  };

  public hideMenu = () => {
    if (!this.isMobileMenuShown) return;
    this.isMobileMenuShown = false;
    this.active = false;
  };

  render() {
    return (
      <Host
        class={{
          'full-width': !this.verticale,
          right: this.right
        }}
        active={this.active}
      >
        <div
          class={{
            menu: true,
            horizontal: !this.verticale,
            verticale: this.verticale
          }}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
