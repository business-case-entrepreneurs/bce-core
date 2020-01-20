import { setMode } from '@stencil/core';

import { ScrollSpy } from './utils/scroll-spy';

const main = () => {
  // Temporary
  const spy = new ScrollSpy('bce-nav > a');
  window.onload = () => spy.detect();

  setMode(el => {
    const root = el.closest('bce-root');

    // Component specific mode's (e.g. bce-button within bce-fab)
    if (isParentChild(el, 'bce-fab', 'bce-button')) return 'bce-fab';
    if (isParentChild(el, 'bce-select', 'bce-chip')) return 'bce-select';
    if (isParentChild(el, 'bce-header', 'bce-nav')) return 'bce-header';
    if (isParentChild(el, 'bce-side-bar', 'bce-nav')) return 'bce-side-bar';

    return el.getAttribute('mode') || (root && root.mode) || 'default';
  });
};

const isParentChild = (el: HTMLElement, parent: string, child: string) => {
  const elParent = el.parentElement && el.parentElement.tagName;
  const elChild = el.tagName;
  return elParent === parent.toUpperCase() && elChild === child.toUpperCase();
};

export default main;
