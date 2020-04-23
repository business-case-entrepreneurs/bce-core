import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { createPopper, Placement } from '@popperjs/core';
import { Component, Element, h, Prop, State } from '@stencil/core';

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

    for (const event of ['mouseenter', 'focus'])
      reference.addEventListener(event, () => (this.active = true));

    for (const event of ['mouseleave', 'blur'])
      reference.addEventListener(event, () => (this.active = false));

    createPopper(reference, tooltip, {
      placement: this.placement as Placement,
      strategy: 'fixed'
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
