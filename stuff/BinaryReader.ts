export class BinaryReader {
  public buffer: ArrayBuffer;
  public array: Uint8Array;
  public view: DataView;
  public head: number;

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer;
    this.array = new Uint8Array(buffer);
    this.view = new DataView(buffer);
    this.head = 0;
  }

  readByte() {
    return this.array[this.head ++];
  }

  readUint16(littleEndian?: boolean) {
    const result = this.view.getUint16(this.head, littleEndian);
    this.head += 2;
    return result;
  }

  readUint32(littleEndian?: boolean) {
    const result = this.view.getUint32(this.head, littleEndian);
    this.head += 4;
    return result;
  }

  readChar() {
    return String.fromCharCode(this.readByte());
  }

  readChars(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.readChar();
    }
    return result;
  }
}
