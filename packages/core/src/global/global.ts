import { setMode } from '@stencil/core';

import { UUID } from '../utils/uuid';
import { FileManager } from '../utils/file-manager';

const setColorScheme = (scheme: string) => {
  if (scheme === 'dark' || scheme === 'light') {
    localStorage.setItem('bce-color-scheme', scheme);
    document.documentElement.setAttribute('color-scheme', scheme);
  } else {
    localStorage.removeItem('bce-color-scheme');
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    handleMediaQuery(match);
  }
};

const bce: BCE = {
  file: FileManager.inMemory(),
  setColorScheme,
  generateId: () => UUID.v4(),

  FileManager
};

const main = () => {
  // Setup global config
  window.BCE = window.BCE || bce;

  // Detect preferred color scheme
  const match = window.matchMedia('(prefers-color-scheme: dark)');
  match.addEventListener
    ? match.addEventListener('change', handleMediaQuery)
    : match.addListener(handleMediaQuery);
  handleMediaQuery(match);

  setMode(el => {
    // Component specific mode's (e.g. bce-button within bce-fab)
    if (chain(el, 'bce-button', 'bce-fab')) return 'bce-fab';
    if (chain(el, 'bce-button', 'bce-menu')) return 'bce-menu';
    if (chain(el, 'bce-link', 'bce-link')) return 'bce-link';
    if (chain(el, 'bce-nav', 'bce-header')) return 'bce-header';
    if (chain(el, 'bce-nav', 'bce-side-bar')) return 'bce-side-bar';

    const root = el.closest('bce-root');
    return el.getAttribute('mode') || (root && root.mode) || 'default';
  });
};

const chain = (el: HTMLElement, child: string, ...parents: string[]) => {
  if (!el.matches(child)) return false;

  for (const parent of parents) {
    const cur = el.parentElement;
    if (!cur || !cur.matches(parent)) return false;
    el = cur;
  }

  return true;
};

const handleMediaQuery = (event: MediaQueryList | MediaQueryListEvent) => {
  switch (event.media) {
    case '(prefers-color-scheme: dark)':
      const preference = localStorage.getItem('bce-color-scheme');
      const color = preference || (event.matches ? 'dark' : 'light');
      document.documentElement.setAttribute('color-scheme', color);
      break;
  }
};

export default main;
