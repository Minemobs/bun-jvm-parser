type u1 = number;
type u2 = number;
type u4 = number;

export function toVersion(majorVersion: number): number | string {
  if (majorVersion < 45) return NaN;
  if (majorVersion === 49) return 5;
  if (majorVersion < 49) {
    return `1.${majorVersion - 45 + 1}`;
  }
  return majorVersion - 50 + 6;
}

export function toStringAccessFlags(flags: number): string[] {
  const flagsArray: string[] = [];
  if((flags & 0x0001) !== 0) flagsArray.push("ACC_PUBLIC");
  if((flags & 0x0010) !== 0) flagsArray.push("ACC_FINAL");
  if((flags & 0x0020) !== 0) flagsArray.push("ACC_SUPER");
  if((flags & 0x0200) !== 0) flagsArray.push("ACC_INTERFACE");
  if((flags & 0x0400) !== 0) flagsArray.push("ACC_ABSTRACT");
  if((flags & 0x1000) !== 0) flagsArray.push("ACC_SYNTHETIC");
  if((flags & 0x2000) !== 0) flagsArray.push("ACC_ANNOTATION");
  if((flags & 0x4000) !== 0) flagsArray.push("ACC_ENUM");
  return flagsArray;
}

export function getClassName(thisClassIndex: number, constantPool: ReturnType<typeof parseConstantPool>) {
  const clazz = constantPool[thisClassIndex - 1] as ConstantClassInfo;
  const str = constantPool[clazz.nameIndex - 1] as ConstantUtf8Info;
  return Buffer.from(str.bytes).toString("utf8");
}

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
  getUint8s(amount: number): number[] {
    const data: number[] = [];
    for(let i = 0; i < amount; i++) {
      data.push(this.getUint8());
    }
    return data;
  }
}

export function parseInterfaces(br: ByteReader, count: number, constantPool: ReturnType<typeof parseConstantPool>): Array<ConstantClassInfo> {
  const array: ConstantClassInfo[] = [];
  for(let i = 0; i < count; i++) {
    const interfaceIndex = br.getUint16();
    array.push(constantPool[interfaceIndex - 1] as ConstantClassInfo);
  }
  return array;
}

export function parseConstantPool(br: ByteReader, count: number): Array<CPInfo<number> & Record<string, number | number[]>> {
  const array: ReturnType<typeof parseConstantPool> = [];
  for(let i = 0; i < count - 1; i++) {
    const tag = br.getUint8();
    if(tag === ConstantPoolTypes.long || tag === ConstantPoolTypes.double) i++;
    array.push(readConstantPool(br, tag));
  }
  return array;
}

function readConstantPool(br: ByteReader, tag: ConstantPoolTypes): CPInfo<number> & Record<string, number | number[]> {
  switch(tag) {
    case ConstantPoolTypes.class:
      return { tag, nameIndex: br.getUint16() } as ConstantClassInfo;
    case ConstantPoolTypes.fieldref:
      return { tag, classIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() } as FieldRefInfo;
    case ConstantPoolTypes.methodref:
      return { tag, classIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() } as ConstantInfoMethodRef;
    case ConstantPoolTypes.interfaceMethodref:
      return { tag, classIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() } as ConstantInterfanceMethodRefInfo;
    case ConstantPoolTypes.string:
      return { tag, stringIndex: br.getUint16() } as ConstantStringInfo;
    case ConstantPoolTypes.integer:
      return { tag, bytes: br.getUint32() } as ConstantIntergerInfo;
    case ConstantPoolTypes.float:
      return { tag, bytes: br.getUint32() } as ConstantFloatInfo;
    case ConstantPoolTypes.long:
      return { tag, highBytes: br.getUint32(), lowBytes: br.getUint32() } as ConstantLongInfo;
    case ConstantPoolTypes.double:
      return { tag, highBytes: br.getUint32(), lowBytes: br.getUint32() } as ConstantDoubleInfo;
    case ConstantPoolTypes.nameAndType:
      return { tag, nameIndex: br.getUint16(), descriptorIndex: br.getUint16() } as ConstantNameAndTypeInfo;
    case ConstantPoolTypes.utf8:
      const length = br.getUint16();
      return { tag, length, bytes: br.getUint8s(length) } as ConstantUtf8Info;
    case ConstantPoolTypes.methodHandle:
      return { tag, referenceKind: br.getUint8(), referenceIndex: br.getUint16() } as ConstantMethodHandleInfo;
    case ConstantPoolTypes.methodType:
      return { tag, descriptorIndex: br.getUint16() } as ConstantMethodTypeInfo;
    case ConstantPoolTypes.invokeDynamic:
      return { tag, bootstrapMethodAttrIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() } as ConstantInvokeDynamicInfo;
    default:
      throw Error("Unexpected tag: " + tag + " at byte offset: " + (br.offset - 1));
  }
}

export const enum ConstantPoolTypes {
  class = 7,
  fieldref = 9,
  methodref = 10,
  interfaceMethodref = 11,
  string = 8,
  integer = 3,
  float = 4,
  long = 5,
  double = 6,
  nameAndType = 12,
  utf8 = 1,
  methodHandle = 15,
  methodType = 16,
  invokeDynamic = 18,
}

export type CPInfo<T extends u1> = {
  tag: T;
};

export type ConstantInfoMethodRef = CPInfo<ConstantPoolTypes.methodref> & {
  classIndex: u2;
  nameAndTypeIndex: u2;
};

export type ConstantClassInfo = CPInfo<ConstantPoolTypes.class> & {
  nameIndex: u2;
};

export type FieldRefInfo = CPInfo<ConstantPoolTypes.fieldref> & {
  classIndex: u2;
  nameAndTypeIndex: u2;
};

export type ConstantInterfanceMethodRefInfo = CPInfo<ConstantPoolTypes.interfaceMethodref> & {
  classIndex: u2;
  nameAndTypeIndex: u2;
};

export type ConstantStringInfo = CPInfo<ConstantPoolTypes.string> & {
  stringIndex: u2;
};

export type ConstantIntergerInfo = CPInfo<ConstantPoolTypes.integer> & {
  bytes: u4;
};

export type ConstantFloatInfo = CPInfo<ConstantPoolTypes.float> & {
  bytes: u4;
};

export type ConstantLongInfo = CPInfo<ConstantPoolTypes.long> & {
  highBytes: u4;
  lowBytes: u4;
};

export type ConstantDoubleInfo = CPInfo<ConstantPoolTypes.double> & {
  highBytes: u4;
  lowBytes: u4;
};

export type ConstantNameAndTypeInfo = CPInfo<ConstantPoolTypes.nameAndType> & {
  nameIndex: u2;
  descriptorIndex: u2;
};

export type ConstantUtf8Info = CPInfo<ConstantPoolTypes.utf8> & {
  length: u2;
  bytes: u1[];
};

export type ConstantMethodHandleInfo = CPInfo<ConstantPoolTypes.methodHandle> & {
  referenceKind: u1;
  referenceIndex: u2;
};

export type ConstantMethodTypeInfo = CPInfo<ConstantPoolTypes.methodType> & {
  descriptorIndex: u2;
};

export type ConstantInvokeDynamicInfo = CPInfo<ConstantPoolTypes.invokeDynamic> & {
  bootstrapMethodAttrIndex: u2;
  nameAndTypeIndex: u2;
};
