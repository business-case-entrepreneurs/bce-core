import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, Element, h, Prop, State } from '@stencil/core';
import Popper from 'popper.js';

library.add(faInfoCircle);

@Component({
  tag: 'bce-tooltip',
  styleUrl: 'bce-tooltip.scss',
  shadow: true
})
export class Tooltip {
  @Element()
  private el!: HTMLBceTooltipElement;

  @Prop({ reflect: true })
  public placement = 'bottom';

  @Prop({ reflect: true })
  public target?: string;

  @Prop({ reflect: true })
  public icon = 'fas:info-circle';

  @State()
  private active = false;

  componentDidLoad() {
    const reference = this.target
      ? (document.querySelector(this.target) as HTMLElement)
      : (this.el.shadowRoot!.querySelector('bce-icon')! as HTMLBceIconElement);

    const tooltip = this.el.shadowRoot!.querySelector('div')!;

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
      positionFixed: true
    });
  }

  render() {
    return [
      !this.target && <bce-icon raw={this.icon} fixed-width></bce-icon>,
      <div data-active={this.active}>
        <slot />
      </div>
    ];
  }
}
