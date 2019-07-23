import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bce-option',
  styleUrl: 'bce-option.scss',
  shadow: false
})
export class BceOption {
  @Element()
  private el!: HTMLBceOptionElement;

  @Prop({ reflect: true })
  public value!: string;

  @Prop({ reflect: false })
  public filter?: string;

  private parent?: HTMLBceDropdownElement;

  private handleClick = () => {
    console.log(this.value);
    if (this.parent) this.parent.select(this.value);
  };

  componentDidLoad() {
    // Register bce-option within bce-dropdown
    this.parent = this.el.closest('bce-dropdown') as HTMLBceDropdownElement;
    if (this.parent) this.parent.registerOption(this.el);
  }

  render() {
    const filter = this.filter
      ? !this.value.toLowerCase().startsWith(this.filter.toLowerCase())
      : false;

    return (
      <Host filter={filter} onClick={this.handleClick}>
        <slot />
      </Host>
    );
  }
}
