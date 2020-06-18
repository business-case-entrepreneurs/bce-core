import { ColorScheme } from './models/color-scheme';
import { FileManager } from './utils/file-manager';
import { getColorShade, setColorShade } from './utils/color';

export * from './models/color-scheme';
export * from './models/condition';
export * from './models/file-ref';
export * from './models/file-server';
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
  interface BCE {
    file: FileManager;
    FileManager: typeof FileManager;
    generateId: () => string;
    getColorScheme: () => ColorScheme;
    getColorShade: typeof getColorShade;
    setColorScheme: (scheme: ColorScheme) => void;
    setColorShade: typeof setColorShade;
  }

  interface Window {
    BCE: BCE;
  }
}
