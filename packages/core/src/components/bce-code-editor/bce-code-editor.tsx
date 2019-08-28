import 'codemirror/mode/javascript/javascript';

import CodeMirror from 'codemirror';
import prettier from 'prettier/standalone';
import prettierTS from 'prettier/parser-typescript';

import { Component, Element, h, Prop, Watch, Method } from '@stencil/core';

@Component({
  tag: 'bce-code-editor',
  styleUrl: 'bce-code-editor.scss',
  styleUrls: ['../../../node_modules/codemirror/lib/codemirror.css'],
  shadow: false
})
export class BceCodeEditor {
  @Element()
  private el!: HTMLBceCodeEditorElement;

  @Prop()
  public value = '';

  @Prop({ reflect: true })
  public language = 'application/typescript';

  @Prop({ reflect: true })
  public lineNumbers = true;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ reflect: true })
  public format = false;

  private editor?: any;

  private ignoreInput = (event: Event) => {
    event.cancelBubble = true;
  };

  @Method()
  public async runFormatter() {
    if (!this.editor) return;

    try {
      const value = prettier.format(this.value, {
        parser: 'typescript',
        plugins: [prettierTS]
      });

      if (this.value !== value) {
        this.editor.setValue(value);
        this.el.dispatchEvent(new Event('input'));
      }
    } catch (e) {}
  }

  @Watch('value')
  private watchValue(value: string) {
    if (!this.editor) return;

    // TS typing is incomplete
    const editor = this.editor as any;

    const coords = editor.getCursor();
    editor.setValue(value);
    editor.setCursor(coords);
  }

  @Watch('disabled')
  private watchDisabled(value: boolean) {
    if (this.editor) this.editor.setOption('readOnly', value);
  }

  async componentDidLoad() {
    const textarea = this.el.querySelector('textarea')!;
    this.editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: this.lineNumbers,
      readOnly: this.disabled,
      tabindex: 0,
      viewportMargin: Infinity
    });

    this.el
      .querySelector('.CodeMirror')!
      .addEventListener('input', this.ignoreInput);

    this.watchValue(this.value);
    this.watchDisabled(this.disabled);

    if (this.format) await this.runFormatter();

    this.editor.on('change', (instance: any) => {
      this.value = instance.getValue();
      this.el.dispatchEvent(new Event('input'));
    });

    this.editor.on('blur', () => {
      if (!this.disabled && this.format) this.runFormatter();
      this.el.dispatchEvent(new Event('blur'));
    });
  }

  componentDidUnload() {
    if (this.editor) this.editor.toTextArea();
  }

  render() {
    return <textarea />;
  }
}
