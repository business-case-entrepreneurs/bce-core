import { setMode } from '@stencil/core';

setMode(elm => {
  const root = elm.closest('bce-root');
  return elm.getAttribute('mode') || (root && root.mode) || 'default';
});
