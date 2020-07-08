import { FileRef } from './file-ref';
import { BceFile } from '../utils/bce-file';

export interface FileServer {
  readonly cancel: (id: string) => Promise<void>;
  readonly delete: (id: string) => Promise<void>;
  readonly rename: (id: string, name: string) => Promise<void>;
  readonly upload: (file: BceFile, metadata: any) => Promise<Partial<FileRef>>;
}
