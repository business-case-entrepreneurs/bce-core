import { Component, Element, h, Prop, Watch } from '@stencil/core';
import CodeFlask from 'codeflask';

@Component({
  tag: 'bce-code-editor',
  styleUrl: 'bce-code-editor.scss',
  shadow: false
})
export class BceCodeEditor {
  @Element()
  private el!: HTMLBceCodeEditorElement;

  @Prop()
  public value = '';

  @Prop({ reflect: true })
  public lineNumbers = false;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true })
  public compact = false;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  private editor?: any;

  private handleFocus = (event: FocusEvent) => {
    this.hasFocus = true;

    const e = new FocusEvent(event.type, { ...event, bubbles: true });
    this.el.dispatchEvent(e);
  };

  private handleBlur = (event: FocusEvent) => {
    this.hasFocus = false;

    const e = new FocusEvent(event.type, { ...event, bubbles: true });
    this.el.dispatchEvent(e);
  };

  @Watch('value')
  private watchValue(value: string) {
    if (this.editor) this.editor.updateCode(value);
  }

  @Watch('disabled')
  private watchDisabled(value: boolean) {
    if (!this.editor) return;

    if (value) this.editor.enableReadonlyMode();
    else this.editor.disableReadonlyMode();
  }

  private resize() {
    const min = window.innerWidth < 1024 || this.compact ? 48 : 40;

    // Reset
    const textarea = this.el.querySelector('textarea')!;
    textarea.style.setProperty('height', min + 'px');

    // Recalculate
    const height = min > textarea.scrollHeight ? min : textarea.scrollHeight;
    textarea.style.setProperty('height', height + 'px');
  }

  async componentDidLoad() {
    this.editor = new CodeFlask(this.el, {
      language: 'js',
      lineNumbers: this.lineNumbers,
      readonly: this.disabled
    });

    this.watchValue(this.value);
    this.watchDisabled(this.disabled);

    this.editor.onUpdate((code: string) => {
      this.resize();
      this.value = code;
      this.el.dispatchEvent(new Event('input'));
    });

    const textarea = this.el.querySelector('textarea')!;
    textarea.addEventListener('focus', this.handleFocus);
    textarea.addEventListener('blur', this.handleBlur);

    this.resize();
  }

  render() {
    return <slot />;
  }
}
