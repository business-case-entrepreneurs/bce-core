import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';
import Popper from 'popper.js';

@Component({
  tag: 'bce-dropdown-menu',
  styleUrl: 'bce-dropdown-menu.scss',
  shadow: false
})
export class BceDropdownMenu {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public placement = 'bottom-start';

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ reflect: true, mutable: true })
  public active: boolean = false;

  @Prop({ reflect: true })
  public icon = 'fas:ellipsis-h';

  private dropDownMenu?: Popper;

  private get buttons() {
    const container = this.el.querySelector('bce-dropdown-menu-items');
    if (!container) return [];

    const children = Array.from(container.children);
    const buttons = children.filter(c => c.tagName !== 'bce-button');
    return buttons as HTMLBceButtonElement[];
  }

  private handleBlur = async () => {
    await new Promise(res => setTimeout(res, 200));
    this.active = false;
  };

  private handleClick = (event: Event) => {
    this.active = !this.active;
    if (this.dropDownMenu) this.dropDownMenu.scheduleUpdate();
    event.stopPropagation();
  };

  @Watch('color')
  private updateButtonColor() {
    for (const button of this.buttons) button.color = this.color;
  }

  componentWillLoad() {
    this.updateButtonColor();
  }

  componentDidLoad() {
    const reference = this.el.querySelector('.dropdown-button')!;
    const dropdown = this.el.querySelector('.bce-dropdown-menu-items')!;
    const container = this.el.closest('bce-root')!;

    this.dropDownMenu = new Popper(reference, dropdown, {
      placement: this.placement as Popper.Placement,
      modifiers: { flip: { boundariesElement: container } }
    });
  }

  componentDidUnload() {
    if (this.dropDownMenu) this.dropDownMenu.destroy();
  }

  render() {
    return (
      <Host onClick={this.handleClick} onBlur={this.handleBlur} tabIndex={-1}>
        <bce-icon class="dropdown-button" raw={this.icon} fixed-width />
        <div class="bce-dropdown-menu-items" data-active={this.active}>
          <slot />
        </div>
      </Host>
    );
  }
}
