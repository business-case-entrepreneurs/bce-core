import {
  AbstractElement,
  icon,
  IconLookup,
  IconName,
  IconPrefix,
  library
} from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-regular-svg-icons';
import { Component, h, Prop, Watch } from '@stencil/core';

library.add(FAS.faSquare);

@Component({
  tag: 'bce-icon',
  styleUrl:
    '../../../node_modules/@fortawesome/fontawesome-svg-core/styles.css',
  shadow: true
})
export class Icon {
  public static DEFAULT_ICON: IconLookup = {
    prefix: 'far',
    iconName: 'square'
  };

  @Prop({ reflect: true, mutable: true })
  public pre: IconPrefix = Icon.DEFAULT_ICON.prefix;

  @Prop({ reflect: true, mutable: true })
  public name: IconName = Icon.DEFAULT_ICON.iconName;

  @Prop({ reflect: true, mutable: true })
  public raw?: string;

  @Prop({ reflect: true })
  public size?: 'xs' | 'sm' | 'lg' | '2x' | '3x' | '5x' | '7x' | '10x';

  @Prop({ reflect: true })
  public fixedWidth?: boolean;

  @Prop({ reflect: true })
  public listItem?: boolean;

  @Prop({ reflect: true })
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
    return (h as any)(element.tag, element.attributes, children);
  }

  render() {
    const definition: IconLookup = {
      prefix: this.pre,
      iconName: this.name
    };
    const i = icon(definition, { classes: this.classes });

    if (!i) {
      console.warn('Could not find one or more icon(s)', definition);
      const alt = icon(Icon.DEFAULT_ICON, { classes: this.classes });
      return this.renderIcon(alt.abstract[0]);
    }

    return this.renderIcon(i.abstract[0]);
  }
}
