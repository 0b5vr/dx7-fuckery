export class BinaryWriter {
  public buffer: ArrayBuffer;
  public array: Uint8Array;
  public view: DataView;
  public head: number;

  constructor(size: number) {
    this.buffer = new ArrayBuffer(size);
    this.array = new Uint8Array(this.buffer);
    this.view = new DataView(this.buffer);
    this.head = 0;
  }

  writeByte(value: number) {
    this.array[this.head++] = value;
  }

  writeUint16(value: number, littleEndian?: boolean) {
    this.view.setUint16(this.head, value, littleEndian);
    this.head += 2;
  }

  writeUint32(value: number, littleEndian?: boolean) {
    this.view.setUint32(this.head, value, littleEndian);
    this.head += 4;
  }

  writeChar(char: string) {
    this.writeByte(char.charCodeAt(0));
  }

  writeChars(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.writeChar(str[i]);
    }
  }

  writeBuffer(buffer: ArrayBuffer) {
    const sourceArray = new Uint8Array(buffer);
    this.array.set(sourceArray, this.head);
    this.head += sourceArray.length;
  }
}