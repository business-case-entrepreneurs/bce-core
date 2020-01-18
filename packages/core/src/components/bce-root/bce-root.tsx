import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss',
  shadow: true
})
export class Root {
  @Element()
  private el!: HTMLBceRootElement;

  @Prop({ reflect: true })
  public mode?: 'default' | 'bucket';

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
