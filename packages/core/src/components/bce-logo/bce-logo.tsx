import { Component, Prop, h } from '@stencil/core';

import { LogoDesign } from '../../models/logo-design';

@Component({
  tag: 'bce-logo',
  styleUrl: 'bce-logo.scss',
  shadow: true
})
export class BceLogo {
  @Prop()
  public colorMap?: { [Design in LogoDesign]: string[][] };

  @Prop()
  public design?: LogoDesign;

  public get colors() {
    const map = this.colorMap || COLOR_MAP;
    return this.design ? map[this.design] : map['technology'];
  }

  public get paths() {
    return this.design ? PATH_MAP[this.design] : PATH_MAP['technology'];
  }

  render() {
    const { colors, paths } = this;

    return (
      <svg
        focusable="false"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {paths.map((d, i) => {
          const x = i < this.paths.length / 2 ? 0 : 1;
          const y = i % (this.paths.length / 2);
          return <path fill={colors[x][y]} d={d} />;
        })}
      </svg>
    );
  }
}

const PATH_MAP: { [Design in LogoDesign]: string[] } = {
  consulting: [],
  technology: [
    'M 80,136 l 160,0 l-80,-120 z',
    'M 80,136 l 160,0 l-80, 120 z',
    'M  0,256 l 160,0 l-80,-120 z',
    'M  0,256 l 160,0 l-80, 120 z',
    'M 80,376 l 160,0 l-80,-120 z',
    'M 80,376 l 160,0 l-80, 120 z',
    'M432,136 l-160,0 l 80,-120 z',
    'M432,136 l-160,0 l 80, 120 z',
    'M512,256 l-160,0 l 80,-120 z',
    'M512,256 l-160,0 l 80, 120 z',
    'M432,376 l-160,0 l 80,-120 z',
    'M432,376 l-160,0 l 80, 120 z'
  ]
};

const COLOR_MAP: { [Design in LogoDesign]: string[][] } = {
  consulting: [[], []],
  technology: [
    ['#000000', '#464c53', '#5d2041', '#af82b0', '#005d90', '#9ed9f8'],
    ['#000000', '#464c53', '#ac2e19', '#e76739', '#005d90', '#9ed9f8']
  ]
};
