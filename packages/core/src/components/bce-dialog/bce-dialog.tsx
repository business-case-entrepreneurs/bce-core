import { Component, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "bce-dialog",
  styleUrl: "bce-dialog.scss",
  shadow: false
})
export class BceDialog {
  @Prop({ reflect: true })
  public active: boolean = false;

  render() {
    return (
      <Host active={this.active}>
        <div class="dialog-container">
          <slot />
        </div>
      </Host>
    );
  }
}
