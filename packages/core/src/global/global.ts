import { setMode } from '@stencil/core';

import { ScrollSpy } from '../utils/scroll-spy';

const main = () => {
  // Temporary
  const spy = new ScrollSpy('bce-nav > a');
  window.onload = () => spy.detect();

  setMode(el => {
    // Component specific mode's (e.g. bce-button within bce-fab)
    if (chain(el, 'bce-button', 'bce-fab')) return 'bce-fab';
    if (chain(el, 'bce-chip', 'bce-select')) return 'bce-select';
    if (chain(el, 'bce-link', 'bce-link')) return 'bce-link';
    if (chain(el, 'bce-nav', 'bce-header')) return 'bce-header';
    if (chain(el, 'bce-nav', 'bce-side-bar')) return 'bce-side-bar';

    const root = el.closest('bce-root');
    return el.getAttribute('mode') || (root && root.mode) || 'default';
  });
};

const chain = (el: HTMLElement, child: string, ...parents: string[]) => {
  if (el.tagName !== child.toUpperCase()) return false;

  let cur = el;
  for (const parent of parents) {
    const par = cur.parentElement;
    if (!par || par.tagName !== parent.toUpperCase()) return false;
    cur = par;
  }

  return true;
};

export default main;
