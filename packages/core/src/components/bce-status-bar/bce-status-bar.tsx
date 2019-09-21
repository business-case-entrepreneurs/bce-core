import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bce-status-bar',
  styleUrl: 'bce-status-bar.scss',
  shadow: false
})
export class BceStatusBar {
  @Prop({ reflect: true })
  public color?: string;

  render() {
    return (
      <svg>
        <polygon points="5,5 15,5 10,15" fill="currentColor" />
        <circle cx="25" cy="10" r="5" fill="currentColor" />
        <rect x="35" y="5" width="10" height="10" fill="currentColor" />
      </svg>
    );
  }
}
