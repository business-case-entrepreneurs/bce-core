import { createPopper } from '@popperjs/core';
import {
  Component,
  Element,
  h,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

@Component({
  tag: 'bce-dropdown',
  styleUrl: 'bce-dropdown.scss',
  shadow: false
})
export class BceDropdown {
  @Element()
  private el!: HTMLElement;

  @Prop({ reflect: true })
  public color?: string;

  @Prop({ mutable: true })
  public value: string | null = null;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  @Prop()
  public placeholder = '';

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true })
  public compact = false;

  @State()
  private filter: string = '';

  @State()
  private options: any[] = [];

  private onInput = (event: Event) => {
    const input = event.target as HTMLInputElement | undefined;
    if (input) this.filter = (input.value || '').trim();
    event.cancelBubble = true;
  };

  private onFocus = (event: Event) => {
    this.hasFocus = true;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  private onBlur = async (event: Event) => {
    await new Promise(res => setTimeout(res, 200));
    this.hasFocus = false;
    this.el.dispatchEvent(new FocusEvent(event.type, event));
  };

  private get text() {
    const option = this.options.find(o => o.value === this.value);
    return option ? option.innerText : '';
  }

  @Method()
  public async registerOption(option: HTMLBceOptionElement) {
    this.options = [...this.options, option];
  }

  @Watch('value')
  public watchValue() {
    this.filter = '';

    const event = new Event('input', { bubbles: true });
    this.el.dispatchEvent(event);
  }

  @Watch('filter')
  public watchFilter(value: string) {
    for (const option of this.options) option.filter = value;
  }

  componentDidLoad() {
    const reference = this.el.querySelector('input')!;
    const dropdown = this.el.querySelector('div')!;
    const container = this.el.closest('bce-root')!;

    // Initialize positioning engine
    createPopper(reference, dropdown, {
      placement: 'bottom-start',
      modifiers: [{ name: 'preventOverflow', options: { boundary: container } }]
    });
  }

  render() {
    return [
      <input
        type="text"
        value={this.hasFocus ? this.filter : this.text}
        placeholder={this.placeholder}
        disabled={this.disabled}
        onInput={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />,
      <bce-icon
        pre="fas"
        name="caret-down"
        fixed-width
        data-active={this.hasFocus}
      />,
      <div data-active={this.hasFocus}>
        {this.value && !this.filter && <bce-option-old value={null} />}
        <slot />
      </div>
    ];
  }
}
