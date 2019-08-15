import { Component, h } from "@stencil/core";

@Component({
  tag: "bce-dialog",
  styleUrl: "bce-dialog.scss",
  shadow: false
})
export class BceDialog {
  render() {
    return <slot />;
  }
}
