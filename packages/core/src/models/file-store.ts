export interface FileStore {
  cancel(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  rename(id: string, name: string): Promise<void>;
  upload(id: string, file: File, metadata: any): Promise<FileRef | undefined>;

  subscribe(observer: Observer, filter?: string[]): () => void;
  unsubscribe(observer: Observer): void;

  dispose(): void;
}

interface Entry {
  claim: { id: string; name: string };
  progress?: number;
  record: FileRef;
}

interface FileRef {
  hash: string;
  id: string;
  type: string;
  url: string;
}

type Observer = (data: FileStore.Data) => Promise<void> | void;

export namespace FileStore {
  export type Data = Record<string, Entry>;
}
