import { Component, Prop } from "@stencil/core";

import { Color } from "../../models/color";

@Component({
  tag: "bce-header",
  styleUrl: "bce-header.scss"
})
export class BceHeader {
  @Prop({ reflectToAttr: true })
  public color?: Color;

  @Prop()
  public logoSrc?: string;

  render() {
    return [
      <img src={this.logoSrc} />,
      <bce-menu>
        <slot />
      </bce-menu>
    ];
  }
}
