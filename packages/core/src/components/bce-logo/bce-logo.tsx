import { Component, Prop } from "@stencil/core";

@Component({
  tag: "bce-logo",
  styleUrl: "bce-logo.scss"
})
export class BceLogo {
  @Prop()
  public logoSrc?: string;

  render() {
    return <img src={this.logoSrc} />;
  }
}
