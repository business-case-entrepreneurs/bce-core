import { setMode } from '@stencil/core';

setMode(elm => {
  const root = elm.closest('bce-root');
  return (root && root.mode) || 'default';
});
