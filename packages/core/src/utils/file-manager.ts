import { FileRef } from '../models/file-ref';
import { FileServer } from '../models/file-server';
import { BceFile } from './bce-file';

export class FileManager {
  #data = new Map<string, FileRef>();
  #observer = new Map<FileManager.Observer, string[] | undefined>();
  #queue = new Map<string, { file: FileRef; progress: number }>();

  #serverCancel: FileServer['cancel'];
  #serverDelete: FileServer['delete'];
  #serverRename: FileServer['rename'];
  #serverUpload: FileServer['upload'];

  public static inMemory(options: Partial<InMemoryOptions> = {}) {
    return createInMemoryFileManager({ delay: {}, ...options });
  }

  public cancel: FileServer['cancel'] = async id => {
    const queue = this.#queue.get(id);
    if (queue) {
      this.#queue.delete(id);
      this.executeObservers([id]);
    }

    return this.#serverCancel(id);
  };

  public delete: FileServer['delete'] = async id => {
    const queue = this.#queue.get(id);
    const data = this.#data.get(id);

    if (queue) this.#queue.delete(id);
    if (data) this.#data.delete(id);
    if (queue || data) this.executeObservers([id]);

    return this.#serverDelete(id);
  };

  public rename: FileServer['rename'] = async (id, name) => {
    const queue = this.#queue.get(id);
    const data = this.#data.get(id);

    if (queue) this.#queue.set(id, { ...queue, file: { ...queue.file, name } });
    if (data) this.#data.set(id, { ...data, name });
    if (queue || data) this.executeObservers([id]);

    return this.#serverRename(id, name);
  };

  public upload = async (file: BceFile, metadata?: any): Promise<FileRef> => {
    // Create file ref for queue
    const { id, name, type } = file;
    const hash = await file.hash();
    const url = URL.createObjectURL(file.blob);
    const queued: FileRef = { hash, id, name, type, url };
    this.#queue.set(file.id, { file: queued, progress: 0 });
    this.executeObservers([id]);

    // Perform upload task
    const partial = await this.#serverUpload(file, metadata);

    // Remove from queue
    const ref = { ...queued, ...partial };
    if (url !== ref.url) URL.revokeObjectURL(queued.url);
    this.#queue.set(file.id, { file: ref, progress: 1 });
    this.executeObservers([id]);
    return ref;
  };

  constructor(handlers: FileServer) {
    this.#serverCancel = handlers.cancel;
    this.#serverDelete = handlers.delete;
    this.#serverRename = handlers.rename;
    this.#serverUpload = handlers.upload;
  }

  public get(id: string): FileRef | undefined {
    return this.#data.get(id);
  }

  public getIds() {
    // const files = [...this.#data.keys(), ...this.#queue.keys()];
    const files: string[] = [];

    // Using simple loops for compatibility
    this.#data.forEach((_, key) => files.push(key));
    this.#queue.forEach((_, key) => files.push(key));

    return Array.from(new Set(files));
  }

  public setFiles(files: FileRef[]) {
    const data = new Map<string, FileRef>();
    for (const file of files) {
      this.#queue.delete(file.id);
      data.set(file.id, file);
    }

    const ids = this.getIds();
    const changes = ids.filter(id => {
      const prev = this.#data.get(id);
      const next = data.get(id);
      return !this.isEqual(prev, next);
    });

    this.#data = data;
    if (changes.length) this.executeObservers(changes);
  }

  public setProgress(id: string, progress: number) {
    const queue = this.#queue.get(id);
    if (!queue) return;

    this.#queue.set(id, { ...queue, progress });
    this.executeObservers([id]);
  }

  public subscribe(observer: FileManager.Observer, filter?: string[]) {
    this.#observer.set(observer, filter);
    observer(this.getDataObject(filter));
    return () => this.unsubscribe(observer);
  }

  public unsubscribe(observer: FileManager.Observer) {
    this.#observer.delete(observer);
  }

  private executeObservers(ids: string[]) {
    for (const [observer, filter] of this.#observer.entries()) {
      if (!filter || ids.some(id => filter.indexOf(id) >= 0))
        observer(this.getDataObject(filter));
    }
  }

  private getDataObject(filter?: string[]) {
    const files = this.getIds();
    return files.reduce<FileManager.Data>((acc, id) => {
      if (filter && filter.indexOf(id) < 0) return acc;

      const data = this.#data.get(id);
      const queue = this.#queue.get(id);
      acc[id] = { file: data || queue?.file!, progress: queue?.progress ?? 1 };
      return acc;
    }, {});
  }

  private isEqual(ref1?: FileRef, ref2?: FileRef): boolean {
    // Check existence
    if (ref1 == undefined || ref2 == undefined) return ref1 === ref2;

    // Check change in progress
    if (typeof ref1 === 'number' || typeof ref2 === 'number')
      return ref1 === ref2;

    // Check change in file structure
    for (const prop in ref1) {
      if ((ref1 as any)[prop] !== (ref2 as any)[prop]) return false;
    }

    return true;
  }
}

export namespace FileManager {
  export type Data = { [id: string]: { file: FileRef; progress: number } };
  export type DataMap = Map<string, { file: FileRef; progress: number }>;
  export type Observer = (data: Data) => Promise<void> | void;
}

interface InMemoryOptions {
  delay: { min?: number; max?: number };
}

const createInMemoryFileManager = (options: InMemoryOptions): FileManager => {
  const tasks = new Map<string, number>();
  const files = new Map<string, FileRef>();

  const cancel: FileServer['cancel'] = async id => {
    const task = tasks.get(id);
    if (!task) return;

    window.clearTimeout(task);
    tasks.delete(id);
  };

  const doDelete: FileServer['delete'] = async id => {
    files.delete(id);
    update();
  };

  const rename: FileServer['rename'] = async (id, name) => {
    const file = files.get(id);
    if (!file) return;

    files.set(file.id, { ...file, name });
    update();
  };

  const upload: FileServer['upload'] = file => {
    const { min = 2000, max = 5000 } = options.delay;

    return new Promise(res => {
      const delay = Math.random() * (max - min + 1) + min;
      const timer = window.setTimeout(async () => {
        const ref: FileRef = {
          hash: await file.hash(),
          id: file.id,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file.blob)
        };

        tasks.delete(file.id);
        files.set(file.id, ref);
        res(ref);
        update();
      }, delay);
      tasks.set(file.id, timer);
    });
  };

  const update = () => {
    manager.setFiles(Array.from(files.values()));
  };

  const manager = new FileManager({ cancel, delete: doDelete, rename, upload });
  return manager;
};
