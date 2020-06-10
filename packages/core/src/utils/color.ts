type RGBA = { r: number; g: number; b: number; a: number };

export const colorShade = (color1: string, color2 = '#fff', mix = '#fff') => {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);
  const c3 = parseColor(mix);
  if (!c1 || !c2 || !c3) return null;

  const mixL = c3;
  const mixD = colorMultiply(c1, c1);

  return {
    c300: rgbaToHex(colorMix(c1, mixL, 0.7)),
    c400: rgbaToHex(colorMix(c1, mixL, 0.85)),
    c500: rgbaToHex(c1),
    c600: rgbaToHex(colorMix(c1, mixD, 0.87)),
    c700: rgbaToHex(colorMix(c1, mixD, 0.7)),
    con1: rgbaToHex({ ...c2, a: 0.87 }),
    con2: rgbaToHex({ ...c2, a: 0.6 }),
    con3: rgbaToHex({ ...c2, a: 0.38 }),
    con4: rgbaToHex({ ...c2, a: 0.1 })
  };
};

export const getColorShade = (el: HTMLElement, name: string): string => {
  const style = getComputedStyle(el);
  const color1 = style.getPropertyValue(`--bce-c500-${name}`).trim();
  const color2 = style.getPropertyValue(`--bce-con1-${name}`).trim();
  return `${color1} ${rgbaToHex({ ...parseRgba(color2)!, a: 1 })}`;
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

const parseColor = (color: string): RGBA | null => {
  return color.startsWith('#') ? parseHex(color) : parseRgba(color);
};

const parseHex = (hex: string): RGBA | null => {
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
};

const parseRgba = (rgba: string): RGBA | null => {
  const regex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+)(%)?)?\)$/;
  const match = rgba.match(regex);
  if (!match) return null;

  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[5] !== '%' ? parseFloat(match[4]) : parseInt(match[4], 10) / 100
  };
};

const rgbaToHex = (rgba: RGBA): string => {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  const base = `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`;
  const alpha = rgba.a == 1 ? '' : toHex(rgba.a * 255);
  return `#${base}${alpha}`;
};

const colorMix = (c1: RGBA, c2: RGBA, weight = 0.5): RGBA => {
  const w = 2 * weight - 1;
  const a = c1.a - c2.a;

  const w1 = ((w * a == -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
  const w2 = 1 - w1;

  return {
    r: w1 * c1.r + w2 * c2.r,
    g: w1 * c1.g + w2 * c2.g,
    b: w1 * c1.b + w2 * c2.b,
    a: c1.a * weight + c2.a * (1 - weight)
  };
};

const colorMultiply = (c1: RGBA, c2: RGBA): RGBA => {
  return {
    r: (c1.r * c2.r) / 255,
    g: (c1.g * c2.g) / 255,
    b: (c1.b * c2.b) / 255,
    a: 1
  };
};
