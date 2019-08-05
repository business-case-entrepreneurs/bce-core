export class File extends Blob {
  readonly id: string;
  readonly name: string;

  constructor(id: string, name: string, data: Blob) {
    super([data], { type: data.type });
    this.id = id;
    this.name = name;
  }
}
