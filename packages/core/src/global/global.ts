import { library } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';
import { setMode } from '@stencil/core';

import { UUID } from '../utils/uuid';
import { FileManager } from '../utils/file-manager';

const bce: BCE = {
  file: FileManager.inMemory(),
  generateId: () => UUID.v4(),

  FileManager
};

const main = () => {
  // Setup global config
  window.BCE = window.BCE || bce;

  // Temporary
  library.add(
    FAS.faHome,
    FAS.faChartLine,
    FAS.faUsers,
    FAS.faBuilding,
    FAS.faUserPlus,
    FAS.faUserTag,
    FAS.faCreditCard,
    FAS.faTools,
    FAS.faUserCircle,
    FAS.faCity,
    FAS.faFileInvoice,
    FAS.faShapes,
    FAS.faCog
  );

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
