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
  public value?: string | null;

  @Prop({ reflect: true })
  public type: 'checkbox' | 'dropdown' | 'radio' = 'dropdown';

  @Prop({ reflect: true })
  public checked: boolean = false;

  @Prop({ reflect: false })
  public filter?: string;

  private parent?: HTMLBceDropdownElement | HTMLBceInputElement;
  private uuid?: string;

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (!input) return;

    // Reset all radio button checked attributes
    if (this.type === 'radio' && this.parent) {
      this.parent
        .querySelectorAll('bce-option')
        .forEach(option => (option.checked = false));
    }

    this.checked = input.checked;
    event.cancelBubble = true;

    // Set value on parent
    if (!this.parent) return;
    switch (this.type) {
      case 'checkbox': {
        const options = this.parent.querySelectorAll('bce-option');
        this.parent.value = Array.from(options)
          .filter(option => option.value && option.checked)
          .map(option => option.value!);
        break;
      }
      case 'radio': {
        this.parent.value = this.value || this.parent.value;
        break;
      }
    }
  };

  private handleClick = () => {
    if (this.parent) this.parent.value = this.value || null;
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

    if (!this.parent) return;
    this.parent.registerOption(this.el);

    // Inherit type and uuid from parent component
    this.type = (this.parent as any).type || 'dropdown';
    this.uuid = (this.parent as any).uuid;

    // Initialize initial state from parent's value attribute
    switch (this.type) {
      case 'checkbox': {
        const value = this.parent.value as string[];
        this.checked = (this.value && value.indexOf(this.value) >= 0) || false;
        break;
      }
      case 'radio': {
        const value = this.parent.value as string;
        this.checked = this.value === value;
        break;
      }
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
            <input
              type={this.type}
              name={this.uuid}
              checked={this.checked}
              onInput={this.handleInput}
            />
            <slot />
          </label>
        );
      case 'dropdown':
        return (
          <Host filter={filter} onClick={this.handleClick}>
            <slot />
          </Host>
        );
      default:
        console.warn(`[bce-option] Unsupported type: ${this.type}`);
        return null;
    }
  }
}
