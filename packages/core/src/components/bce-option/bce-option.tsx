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
  public value?: string;

  @Prop({ reflect: true })
  public type: 'checkbox' | 'dropdown' | 'radio' = 'dropdown';

  @Prop({ reflect: true })
  public checked: boolean = false;

  @Prop({ reflect: false })
  public filter?: string;

  private parent?: HTMLBceDropdownElement | HTMLBceInputElement;

  private handleClick = () => {
    console.log(this.value);
    // if (this.parent) this.parent.select(this.value);
  };

  componentDidLoad() {
    // Register bce-option within supported parent element
    const parents = [
      'bce-dropdown',
      'bce-input[type="checkbox"]',
      'bce-input[type="radio"]'
    ].join(',');

    this.parent = (this.el.closest(parents) || undefined) as
      | HTMLBceDropdownElement
      | HTMLBceInputElement
      | undefined;

    if (this.parent) {
      this.parent.registerOption(this.el);
      console.log(this.parent);
      this.type = (this.parent as any).type || 'dropdown';
    }
  }

  render() {
    const filter = this.filter
      ? this.value &&
        !this.value.toLowerCase().startsWith(this.filter.toLowerCase())
      : false;

    switch (this.type) {
      case 'checkbox':
      case 'radio':
        return (
          <label>
            <input type={this.type} />
            <slot />
          </label>
        );
      case 'dropdown':
        return (
          <Host filter={filter} onClick={this.handleClick}>
            <slot />
          </Host>
        );
    }
  }
}
