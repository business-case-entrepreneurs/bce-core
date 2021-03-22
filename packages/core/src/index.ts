import { ColorScheme } from './models/color-scheme';
import { getColorShade, setColorShade } from './utils/color';
import { FileManager } from './utils/file-manager';
import { ScrollSpy } from './utils/scroll-spy';

export * from './models/color-scheme';
export * from './models/condition';
export * from './models/file-ref';
export * from './models/file-server';
export * from './models/file-store';
export * from './utils/bce-file';
export * from './utils/color';
export * from './utils/debounce';
export * from './utils/file-manager';
export * from './utils/is-email';
export * from './utils/modulo';
export * from './utils/ripple';
export * from './utils/scroll-spy';
export * from './utils/throttle';
export * from './utils/uuid';
export * from './utils/validator';

declare global {
  interface BceCore {
    file: FileManager;
    FileManager: typeof FileManager;
    generateId: () => string;
    getColorScheme: () => ColorScheme;
    getColorShade: typeof getColorShade;
    setColorScheme: (scheme: ColorScheme) => void;
    setColorShade: typeof setColorShade;
    ScrollSpy: typeof ScrollSpy;
  }

  interface Window {
    BCE: BceCore;
  }
}
