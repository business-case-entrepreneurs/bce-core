export class UUID {
  public static uuid: string;
  public static v4(): string {
    const uuidV4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      c => {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
    this.uuid = uuidV4;
    return this.uuid;
  }
}
