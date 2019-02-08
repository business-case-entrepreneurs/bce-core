import { AbstractElement, icon, IconLookup, IconName, IconPrefix, library } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { Component, Prop, Watch } from '@stencil/core';

// These icons are added by default
library.add(faQuestion);

@Component({
  tag: 'bce-icon'
})
export class BceIcon {
  @Prop({ reflectToAttr: true, mutable: true })
  public pre: IconPrefix = 'fas';

  @Prop({ reflectToAttr: true, mutable: true })
  public name: IconName = 'question';

  @Prop({ reflectToAttr: true, mutable: true })
  public raw?: string;

  @Prop({ reflectToAttr: true })
  public size?: 'xs' | 'sm' | 'lg' | '2x' | '3x' | '5x' | '7x' | '10x';

  @Prop({ reflectToAttr: true })
  public 'fixed-width'?: boolean;

  @Prop({ reflectToAttr: true })
  public 'list-item'?: boolean;

  @Prop({ reflectToAttr: true })
  public spin?: boolean;

  private get classes(): string[] {
    const classes = {
      'fa-spin': this.spin,
      'fa-fw': this['fixed-width'],
      'fa-li': this['list-item'],
      [`fa-${this.size}`]: this.size !== undefined
    };

    return Object.keys(classes).filter(key => !!(classes as any)[key]);
  }

  @Watch('raw')
  componentWillLoad() {
    if (!this.raw) return;

    const [p1, p2] = this.raw.split(':');
    this.pre = p2 ? (p1 as IconPrefix) : this.pre;
    this.name = p2 ? (p2 as IconName) : (p1 as IconName);
    this.raw = undefined;
  }

  renderIcon(element: AbstractElement) {
    const children: any = (element.children || []).map(child =>
      this.renderIcon(child)
    );
    return h(element.tag, element.attributes, children);
  }

  render() {
    const definition: IconLookup = { prefix: this.pre, iconName: this.name };
    const i = icon(definition, { classes: this.classes });

    if (!i) {
      console.warn('Could not find one or more icon(s)', definition);
      return null;
    }

    return this.renderIcon(i.abstract[0]);
  }
}
