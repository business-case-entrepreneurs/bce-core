export class BceFile {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly blob: Blob;

  #digest?: number[];
  #digestAlg?: string;

  constructor(id: string, name: string, data: Blob) {
    this.id = id;
    this.name = name;
    this.type = data.type;
    this.blob = data;
  }

  public async hash(algorithm = 'SHA-256', output = 'hex') {
    if (!this.#digest || this.#digestAlg !== algorithm) {
      const data = await this.blob.arrayBuffer();
      const buffer = await crypto.subtle.digest(algorithm, data);
      this.#digestAlg = algorithm;
      this.#digest = Array.from(new Uint8Array(buffer));
    }

    switch (output) {
      default:
      case 'array':
        return this.#digest;
      case 'hex':
        return this.#digest.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  }
}
