import { Component, Prop } from '@stencil/core';
import { LogoMode } from '../../models/logo-mode';

@Component({
  tag: 'bce-logo',
  styleUrl: 'bce-logo.scss'
})
export class BceLogo {
  @Prop({ reflectToAttr: true })
  public mode!: LogoMode;

  private get colors() {
    return COLOR_MAP[this.mode] || COLOR_MAP[LogoMode.Default];
  }

  private get paths() {
    return PATHS.map((d, i) => <path d={d} fill={this.colors[i]} />);
  }

  render() {
    return [
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        {this.paths}
      </svg>
    ];
  }
}

const PATHS = [
  'M255.998,170.667l-123.593,-85.335l123.593,-85.33',
  'M255.998,0l123.593,85.335l-123.593,85.33',
  'M132.406,256l-123.589,-85.334l123.589,-85.331',
  'M132.406,85.333l123.592,85.335l-123.592,85.33',
  'M379.59,256l-123.593,-85.334l123.593,-85.331',
  'M379.59,85.333l123.593,85.335l-123.593,85.33',
  'M132.406,426.667l-123.589,-85.335l123.589,-85.33',
  'M132.406,256l123.592,85.335l-123.592,85.33',
  'M379.59,426.667l-123.593,-85.335l123.593,-85.33',
  'M379.59,256l123.593,85.335l-123.593,85.33',
  'M255.998,512l-123.593,-85.335l123.593,-85.33',
  'M255.998,341.333l123.593,85.335l-123.593,85.33'
];

// prettier-ignore
const COLOR_MAP: { [mode in LogoMode]: string[] } = {
  [LogoMode.Default] : [
    '#ec6023', '#f79b43',
    '#215475', '#75c2d5', '#2e6571', '#6abab7',
    '#215475', '#75c2d5', '#2e6571', '#6abab7',
    '#5c2a53', '#ab71a6'
  ],
  [LogoMode.Light]: [
    '#c7c7c7', '#f2f2f2',
    '#8c8c8c', '#f1f1f1', '#989898', '#e6e6e6',
    '#8c8c8c', '#f1f1f1', '#989898', '#e6e6e6',
    '#828282', '#cdcdcd'
  ],
  [LogoMode.Dark]: [
    'black', 'black',
    'black', 'black', 'black', 'black',
    'black', 'black', 'black', 'black',
    'black', 'black'
  ]
};
