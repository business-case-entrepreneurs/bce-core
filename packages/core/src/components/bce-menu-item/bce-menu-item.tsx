import { Component, Prop } from "@stencil/core";

import { Color } from "../../models/color";

@Component({
  tag: "bce-menu-item",
  styleUrl: "bce-menu-item.scss"
})
export class BceMenuItem {
  @Prop()
  public href!: string;

  highlightCurrent(e: any): void {
    console.log(e.target);
    const curPage = document.URL;
    const links: any = document.getElementsByTagName("a");
    for (let link of links) {
      if (link.href == curPage) {
        link.classList.add("current");
      } else {
        link.classList.remove("current");
      }
    }
  }

  render() {
    return (
      <a href={this.href} onClick={this.highlightCurrent}>
        <slot />
      </a>
    );
  }
}