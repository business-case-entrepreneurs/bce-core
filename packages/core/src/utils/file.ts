export class File {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly blob: Blob;

  constructor(id: string, name: string, data: Blob) {
    this.id = id;
    this.name = name;
    this.type = data.type;
    this.blob = data;
  }
}
