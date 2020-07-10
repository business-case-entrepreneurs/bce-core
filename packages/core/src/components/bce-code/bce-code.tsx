import 'prismjs';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-tsx.min';
import 'prismjs/components/prism-typescript.min';

import { Component, Element, h, Prop } from '@stencil/core';

// Set Prism to manual mode
(window.Prism as any).manual = true;

export type BceCodeLanguage =
  | 'clike'
  | 'css'
  | 'html'
  | 'javascript'
  | 'js'
  | 'jsx'
  | 'mathml'
  | 'none'
  | 'svg'
  | 'ts'
  | 'tsx'
  | 'typescript'
  | 'xml';

@Component({
  tag: 'bce-code',
  styleUrl: 'bce-code.scss',
  shadow: true
})
export class Code {
  @Element()
  private el!: HTMLBceCodeElement;

  @Prop({ reflect: true })
  public async?: boolean;

  @Prop({ reflect: true })
  public inline?: boolean;

  @Prop({ reflect: true })
  public language: BceCodeLanguage = 'none';

  @Prop()
  public value: string | string[] = '';

  private highlight() {
    const query = this.inline ? 'code' : 'pre';
    const el = this.el.shadowRoot!.querySelector(query)!;
    if (el) window.Prism.highlightAllUnder(el, !!this.async);
  }

  componentDidLoad() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  renderCode(classes: string, content: string) {
    return (
      <code class={classes} key={content}>
        {content}
      </code>
    );
  }

  renderPre(classes: string, content: string) {
    return (
      <pre class={classes} key={content}>
        {this.renderCode(classes, content)}
      </pre>
    );
  }

  render() {
    const classes = `language-${this.language}`;
    const content = Array.isArray(this.value)
      ? this.value.join('\n')
      : this.value;

    return this.inline
      ? this.renderCode(classes, content)
      : this.renderPre(classes, content);
  }
}
