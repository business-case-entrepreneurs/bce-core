export class UUID {
  public static v4(): string {
    return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0];
      const n = parseInt(c, 10);
      return (n ^ (r & (15 >> (n / 4)))).toString(16);
    });
  }
}
