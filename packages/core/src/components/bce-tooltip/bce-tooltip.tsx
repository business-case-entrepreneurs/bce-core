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

  @Prop()
  public container = document as ParentNode;

  @Prop({ reflect: true })
  public placement?: string;

  @Prop({ reflect: true })
  public target?: string;

  @Prop({ reflect: true })
  public icon?: string;

  @State()
  private active = false;

  componentDidLoad() {
    const reference = this.target
      ? (this.container.querySelector(this.target) as HTMLElement)
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
      placement: (this.placement || 'bottom') as Placement,
      strategy: 'fixed',
      modifiers: [{ name: 'offset', options: { offset: [0, 2] } }]
    });
  }

  render() {
    const icon = this.icon || 'fas:info-circle';

    return [
      !this.target && <bce-icon raw={icon} fixed-width />,
      <div data-active={this.active}>
        <slot />
      </div>
    ];
  }
}
