export type u1 = number;
export type u2 = number;
export type u4 = number;

// Only for documentation purposes, doesn't do anything
export type ArrayWithLength<T, _max> = Array<T>;
export type Between<T, _minInclusive, _maxInclusive> = T;

export class ByteReader {
  offset: number = 0;
  #dv: DataView;

  constructor(dv: DataView) {
    this.#dv = dv;
  }

  getBigInt64(littleEndian?: boolean) { const data = this.#dv.getBigInt64(this.offset, littleEndian); this.offset += 8; return data; }
  getBigUint64(littleEndian?: boolean) { const data = this.#dv.getBigUint64(this.offset, littleEndian); this.offset += 8; return data; }
  getFloat32(littleEndian?: boolean) { const data = this.#dv.getFloat32(this.offset, littleEndian); this.offset += 4; return data; }
  getFloat64(littleEndian?: boolean) { const data = this.#dv.getFloat64(this.offset, littleEndian); this.offset += 8; return data; }
  getInt16(littleEndian?: boolean) { const data = this.#dv.getInt16(this.offset, littleEndian); this.offset += 2; return data; }
  getInt32(littleEndian?: boolean) { const data = this.#dv.getInt32(this.offset, littleEndian); this.offset += 4; return data; }
  getInt8() { const data = this.#dv.getInt8(this.offset); this.offset += 1; return data; }
  getUint16(littleEndian?: boolean) { const data = this.#dv.getUint16(this.offset, littleEndian); this.offset += 2; return data; }
  getUint32(littleEndian?: boolean) { const data = this.#dv.getUint32(this.offset, littleEndian); this.offset += 4; return data; }
  getUint8() { const data = this.#dv.getUint8(this.offset); this.offset += 1; return data; }
  getUint8s(amount: number): u1[] {
    const data: number[] = [];
    for(let i = 0; i < amount; i++) {
      data.push(this.getUint8());
    }
    return data;
  }
  getUint16s(amount: number): u2[] {
    const data: number[] = [];
    for(let i = 0; i < amount; i++) {
      data.push(this.getUint16());
    }
    return data;
  }
}

