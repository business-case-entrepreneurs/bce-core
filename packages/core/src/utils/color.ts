type ColorRGBA = { r: number; g: number; b: number; a: number };
type ColorPrimitive = ColorRGBA | string;
type ColorAny = ColorPrimitive | Color;

export class Color {
  #rgba: ColorRGBA;

  public get hex() {
    const { rgba } = this;
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
    const base = `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`;
    const alpha = rgba.a == 1 ? '' : toHex(rgba.a * 255);
    return `#${base}${alpha}`;
  }

  public get rgba() {
    return this.#rgba;
  }

  constructor(color: ColorAny) {
    const rgba = this._parseColor(color);
    if (rgba == null) throw new Error('Unknown color: ' + color);

    this.#rgba = rgba;
  }

  public static mix(c1: Color, c2: Color, weight = 0.5) {
    const { r: r1, g: g1, b: b1, a: a1 } = c1.rgba;
    const { r: r2, g: g2, b: b2, a: a2 } = c2.rgba;

    const w = 2 * weight - 1;
    const a = a1 - a2;

    const w1 = ((w * a == -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
    const w2 = 1 - w1;

    return new Color({
      r: w1 * r1 + w2 * r2,
      g: w1 * g1 + w2 * g2,
      b: w1 * b1 + w2 * b2,
      a: a1 * weight + a2 * (1 - weight)
    });
  }

  public static multiply(c1: Color, c2: Color) {
    const { r: r1, g: g1, b: b1 } = c1.rgba;
    const { r: r2, g: g2, b: b2 } = c2.rgba;

    return new Color({
      r: (r1 * r2) / 255,
      g: (g1 * g2) / 255,
      b: (b1 * b2) / 255,
      a: 1
    });
  }

  public mix(color: Color) {
    this.#rgba = { ...Color.multiply(this, color).rgba };
  }

  public multiply(color: Color) {
    this.#rgba = { ...Color.multiply(this, color).rgba };
  }

  private _parseColor(color: ColorAny): ColorRGBA | null {
    if (color instanceof Color) return color.rgba;
    if (typeof color !== 'string') return color;

    return color.startsWith('#')
      ? this._parseHex(color)
      : this._parseRgba(color);
  }

  private _parseHex(hex: string): ColorRGBA | null {
    const shortRegex = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
    const full = hex.replace(shortRegex, (_, r, g, b, a) => {
      const opacity = a ?? 'f';
      return '#' + r + r + g + g + b + b + opacity + opacity;
    });

    const fullRegex = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
    var result = fullRegex.exec(full);
    if (!result) return null;

    const alpha = parseInt(result[4], 16);
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: isNaN(alpha) ? 1 : alpha / 255
    };
  }

  private _parseRgba(rgba: string): ColorRGBA | null {
    const regex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+)(%)?)?\)$/;
    const match = rgba.match(regex);
    if (!match) return null;

    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
      a: match[5] !== '%' ? parseFloat(match[4]) : parseInt(match[4], 10) / 100
    };
  }
}

export const colorShade = (color1: string, color2 = '#fff', mix = '#fff') => {
  const c1 = new Color(color1);
  const c2 = new Color(color2);
  const c3 = new Color(mix);
  if (!c1 || !c2 || !c3) return null;

  const mixL = c3;
  const mixD = Color.multiply(c1, c1);

  return {
    c300: Color.mix(c1, mixL, 0.7).hex,
    c400: Color.mix(c1, mixL, 0.85).hex,
    c500: c1.hex,
    c600: Color.mix(c1, mixD, 0.87).hex,
    c700: Color.mix(c1, mixD, 0.7).hex,
    con1: new Color({ ...c2.rgba, a: 0.87 }).hex,
    con2: new Color({ ...c2.rgba, a: 0.6 }).hex,
    con3: new Color({ ...c2.rgba, a: 0.38 }).hex,
    con4: new Color({ ...c2.rgba, a: 0.1 }).hex
  };
};

export const getColorShade = (el: HTMLElement, name: string): string => {
  const style = getComputedStyle(el);
  const color1 = style.getPropertyValue(`--bce-c500-${name}`).trim();
  const color2 = style.getPropertyValue(`--bce-con1-${name}`).trim();
  return `${color1} ${new Color({ ...new Color(color2).rgba, a: 1 }).hex}`;
};

export const setColorShade = (
  el: HTMLElement,
  name: string,
  colors: string,
  mix?: string
) => {
  const [color1, color2] = colors.split(' ');
  const shades = colorShade(color1, color2, mix);
  for (const shade of Object.keys(shades || {})) {
    const color = (shades as any)[shade];
    el.style.setProperty(`--bce-${shade}-${name}`, color);
  }
};
