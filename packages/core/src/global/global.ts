import { setMode } from '@stencil/core';

import { UUID } from '../utils/uuid';
import { FileManager } from '../utils/file-manager';
import { getColorShade, setColorShade } from '../utils/color';
import * as color from '../utils/color-scheme';
import { ScrollSpy } from '../utils/scroll-spy';

const bce: BceCore = {
  file: FileManager.inMemory(),
  FileManager,
  generateId: () => UUID.v4(),
  getColorScheme: color.getColorScheme,
  getColorShade,
  setColorScheme: color.setColorScheme,
  setColorShade,
  ScrollSpy
};

const main = () => {
  // Setup global config
  window.BCE = window.BCE || bce;
  color.initColorScheme();

  setMode(el => {
    // Component specific mode's (e.g. bce-button within bce-fab)
    if (chain(el, 'bce-button', 'bce-fab')) return 'fab';
    if (chain(el, 'bce-button', 'bce-menu')) return 'menu';
    if (chain(el, 'bce-link', 'bce-link')) return 'link';
    if (chain(el, 'bce-link', 'bce-nav', 'bce-header')) return 'header';
    if (chain(el, 'bce-nav', 'bce-header')) return 'header';
    if (chain(el, 'bce-nav', 'bce-side-bar')) return 'sidebar';

    const root = el.closest('bce-root');
    return el.getAttribute('mode') || (root && root.mode) || 'regular';
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

export default main;
