import { ColorScheme } from '../models/color-scheme';

const handleMediaQuery = (event: MediaQueryList | MediaQueryListEvent) => {
  if (event.media !== '(prefers-color-scheme: dark)') return;

  const pref = getColorScheme();
  const color = pref === 'auto' ? (event.matches ? 'dark' : 'light') : pref;
  document.documentElement.setAttribute('color-scheme', color);
};

export const initColorScheme = () => {
  const match = window.matchMedia('(prefers-color-scheme: dark)');
  match.addEventListener
    ? match.addEventListener('change', handleMediaQuery)
    : match.addListener(handleMediaQuery);
  handleMediaQuery(match);
};

export const getColorScheme = (): ColorScheme => {
  const preference = localStorage.getItem('bce-color-scheme');
  return preference ? (preference as ColorScheme) : 'auto';
};

export const setColorScheme = (scheme: ColorScheme) => {
  if (scheme === 'dark' || scheme === 'light') {
    localStorage.setItem('bce-color-scheme', scheme);
    document.documentElement.setAttribute('color-scheme', scheme);
  } else {
    localStorage.removeItem('bce-color-scheme');
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    handleMediaQuery(match);
  }
};
