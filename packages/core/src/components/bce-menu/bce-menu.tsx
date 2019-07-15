import {
  Component,
  Prop,
  Host,
  Element,
  State,
  Listen,
  h
} from '@stencil/core';
import { Color } from '../../models/color';

@Component({
  tag: 'bce-menu',
  styleUrl: 'bce-menu.scss'
})
export class BceMenu {
  @Prop()
  public verticale: boolean = false;

  @Prop({ reflect: true })
  public color?: Color;

  @Element() el!: HTMLElement;

  @State() isMobileMenuShown: boolean = false;

  @Listen('resize', { target: 'window' })
  public handleResize() {
    requestAnimationFrame(() => {
      if (window.innerWidth > 768) {
        const menu = this.el.querySelector('.menu') as HTMLElement;
        menu.style.display = '';
        this.el.classList.remove('show-mobile-menu');
        document.body.classList.remove('no-scroll');
        this.isMobileMenuShown = false;
      }
    });
  }

  public componentDidLoad() {
    this.isMobileMenuShown === false;
  }

  public showNav = () => {
    if (this.isMobileMenuShown) return;
    this.isMobileMenuShown = true;

    const menu = this.el.querySelector('.menu') as HTMLElement;

    menu.style.display = 'flex';
    setTimeout(() => {
      this.el.classList.add('show-mobile-menu');
      document.body.classList.add('no-scroll');
    }, 1);
  };

  public hideNav = () => {
    if (!this.isMobileMenuShown) return;
    this.isMobileMenuShown = false;

    const menu = this.el.querySelector('.menu') as HTMLElement;

    this.el.classList.remove('show-mobile-menu');

    menu.style.display = 'none';
    setTimeout(() => {
      document.body.classList.remove('no-scroll');
    }, 300);
  };

  public onClick = () => {
    if (this.isMobileMenuShown) {
      this.hideNav();
    } else {
      this.showNav();
    }
  };

  render() {
    return (
      <Host class={{ verticale: this.verticale }}>
        <bce-icon
          onClick={this.onClick}
          class="mobile-button"
          size={'lg'}
          fixed-width
        />
        <div class="menu show-mobile-menu">
          <slot />
        </div>
      </Host>
    );
  }
}
