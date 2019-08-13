import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Prop, State } from '@stencil/core';
import Popper from 'popper.js';

library.add(faInfoCircle);

@Component({
  tag: 'bce-tooltip',
  styleUrl: 'bce-tooltip.scss',
  shadow: false
})
export class BceTooltip {
  @Element()
  private el!: HTMLBceTooltipElement;

  @Prop({ reflect: true })
  public placement = 'bottom';

  @Prop({ reflect: true })
  public target = '';

  @State()
  private active = false;

  componentDidLoad() {
    const reference = this.target
      ? (document.querySelector(this.target) as HTMLElement)
      : (this.el.querySelector('bce-icon')! as HTMLBceIconElement);
    const tooltip = this.el.querySelector('div')!;
    const container = this.el.closest('bce-root')!;

    if (!reference) {
      console.warn(`[bce-tooltip] Target not found: ${this.target}`);
      return;
    }

    reference.addEventListener('mouseenter', () => {
      this.active = true;
      popper.scheduleUpdate();
    });

    reference.addEventListener('mouseleave', () => {
      this.active = false;
    });

    const popper = new Popper(reference, tooltip, {
      placement: this.placement as Popper.Placement,
      modifiers: { flip: { boundariesElement: container } }
    });
  }

  render() {
    return [
      !this.target && <bce-icon raw="fas:info-circle" fixed-width></bce-icon>,
      <div data-active={this.active}>
        <slot />
      </div>
    ];
  }
}
