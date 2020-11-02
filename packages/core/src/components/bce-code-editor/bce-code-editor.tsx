import { Component, Element, h, Method, Prop, Watch } from '@stencil/core';
import CodeFlask from 'codeflask';

import { getInputCreator } from '../bce-input-creator/input-creator';
import { ValidatorError } from '../../utils/validator';

@Component({
  tag: 'bce-code-editor',
  styleUrl: 'bce-code-editor.scss',
  shadow: true
})
export class CodeEditor {
  @Element()
  private el!: HTMLBceCodeEditorElement;

  @Prop({ reflect: true })
  public compact = false;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true })
  public error?: boolean;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  @Prop({ reflect: true })
  public info?: string;

  @Prop({ reflect: true })
  public label?: string;

  @Prop({ reflect: true })
  public lineNumbers = false;

  @Prop({ reflect: true })
  public name?: string;

  @Prop()
  public tooltip?: string;

  @Prop({ reflect: true })
  public validation?: string;

  @Prop({ mutable: true })
  public value?: string;

  #editor?: any;
  #initialValue?: string;
  #inputCreator = getInputCreator(this, err => (this.error = !!err));

  private handleBlur = (event: FocusEvent) => {
    this.hasFocus = false;
    this.#inputCreator.validate();

    const e = new FocusEvent(event.type, { ...event, bubbles: true });
    this.el.dispatchEvent(e);
  };

  private handleFocus = (event: FocusEvent) => {
    this.hasFocus = true;

    const e = new FocusEvent(event.type, { ...event, bubbles: true });
    this.el.dispatchEvent(e);
  };

  constructor() {
    this.#initialValue = this.value;
  }

  @Watch('value')
  private watchValue(value?: string) {
    if (this.#editor) this.#editor.updateCode(value);
  }

  @Watch('disabled')
  private watchDisabled(value: boolean) {
    if (!this.#editor) return;

    if (value) this.#editor.enableReadonlyMode();
    else this.#editor.disableReadonlyMode();
  }

  @Method()
  public async reset() {
    this.value = this.#initialValue;
    this.#inputCreator.reset();
  }

  @Method()
  public async validate(silent = false): Promise<ValidatorError[]> {
    return this.#inputCreator.validate(silent);
  }

  private resize() {
    const min = window.innerWidth < 1024 || this.compact ? 48 : 40;

    // Reset
    const textarea = this.el.querySelector('textarea')!;
    const container = this.el.querySelector('.codeflask')! as HTMLElement;
    textarea.style.setProperty('height', min + 'px');

    // Recalculate
    const height = min > textarea.scrollHeight ? min : textarea.scrollHeight;
    textarea.style.setProperty('height', height + 'px');
    container.style.setProperty('height', height + 'px');
  }

  async componentDidLoad() {
    this.#editor = new CodeFlask(this.el, {
      language: 'js',
      lineNumbers: this.lineNumbers,
      readonly: this.disabled
    });

    this.watchValue(this.value);
    this.watchDisabled(this.disabled);

    this.#editor.onUpdate((code: string) => {
      this.resize();
      this.value = code;

      const event = new Event('input', { bubbles: true, composed: true });
      this.el.dispatchEvent(event);
    });

    const textarea = this.el.querySelector('textarea')!;
    textarea.addEventListener('focus', this.handleFocus);
    textarea.addEventListener('blur', this.handleBlur);

    this.resize();
  }

  render() {
    const InputCreator = this.#inputCreator;
    return (
      <InputCreator>
        <slot />
      </InputCreator>
    );
  }
}
