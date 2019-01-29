import { AbstractElement, icon, IconName, IconPrefix, library } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { Component, Prop } from '@stencil/core';

// These icons are added by default
library.add(faQuestion);

@Component({
  tag: 'bce-icon'
})
export class BceIcon {
  @Prop({ reflectToAttr: true })
  public pre: IconPrefix = 'fas';

  @Prop({ reflectToAttr: true })
  public name: IconName = 'question';

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

  private convert(element: AbstractElement) {
    const children: any = (element.children || []).map(child =>
      this.convert(child)
    );
    return h(element.tag, element.attributes, children);
  }

  render() {
    const definition = { prefix: this.pre, iconName: this.name };
    const i = icon(definition, { classes: this.classes });

    if (!i) {
      console.warn('Could not find one or more icon(s)', definition);
      return null;
    }

    return this.convert(i.abstract[0]);
  }
}
