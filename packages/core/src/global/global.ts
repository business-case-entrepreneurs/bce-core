import { setMode } from '@stencil/core';

import { UUID } from '../utils/uuid';
import { FileManager } from '../utils/file-manager';
import * as color from '../utils/color-scheme';

const bce: BCE = {
  file: FileManager.inMemory(),
  getColorScheme: color.getColorScheme,
  setColorScheme: color.setColorScheme,
  generateId: () => UUID.v4(),

  FileManager
};

const main = () => {
  // Setup global config
  window.BCE = window.BCE || bce;
  color.initColorScheme();

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

export default main;
