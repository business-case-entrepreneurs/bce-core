import {
  AbstractElement,
  icon,
  IconLookup,
  IconName,
  IconPrefix,
  library
} from '@fortawesome/fontawesome-svg-core';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { Component, h, Prop, Watch } from '@stencil/core';

// These icons are added by default
library.add(faSquare);

@Component({
  tag: 'bce-icon'
})
export class BceIcon {
  public static DEFAULT_ICON: IconLookup = {
    prefix: 'far',
    iconName: 'square'
  };

  @Prop({ reflectToAttr: true, mutable: true })
  public pre: IconPrefix = BceIcon.DEFAULT_ICON.prefix;

  @Prop({ reflectToAttr: true, mutable: true })
  public name: IconName = BceIcon.DEFAULT_ICON.iconName;

  @Prop({ reflectToAttr: true, mutable: true })
  public raw?: string;

  @Prop({ reflectToAttr: true })
  public size?: 'xs' | 'sm' | 'lg' | '2x' | '3x' | '5x' | '7x' | '10x';

  @Prop({ reflectToAttr: true })
  public fixedWidth?: boolean;

  @Prop({ reflectToAttr: true })
  public listItem?: boolean;

  @Prop({ reflectToAttr: true })
  public spin?: boolean;

  private get classes(): string[] {
    const classes = {
      'fa-spin': this.spin,
      'fa-fw': this['fixedWidth'],
      'fa-li': this['listItem'],
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
      const alt = icon(BceIcon.DEFAULT_ICON, { classes: this.classes });
      return this.renderIcon(alt.abstract[0]);
    }

    return this.renderIcon(i.abstract[0]);
  }
}
