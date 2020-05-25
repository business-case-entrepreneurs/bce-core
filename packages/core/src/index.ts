import { FileManager } from './utils/file-manager';

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
    generateId: () => string;
    setColorScheme: (scheme: 'auto' | 'dark' | 'light') => void;
    FileManager: typeof FileManager;
  }

  interface Window {
    BCE: BCE;
  }
}
