import { setMode } from '@stencil/core';

setMode(el => {
  const root = el.closest('bce-root');

  // Component specific mode's (e.g. bce-button within bce-fab)
  if (isFabButton(el)) return 'fab';

  return el.getAttribute('mode') || (root && root.mode) || 'default';
});

const isFabButton = (el: HTMLElement) => {
  const parent = el.parentElement && el.parentElement.tagName;
  const child = el.tagName;
  return child === 'BCE-BUTTON' && parent === 'BCE-FAB';
};
