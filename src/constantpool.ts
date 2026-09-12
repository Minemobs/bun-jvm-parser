import type { ByteReader, u1, u2, u4 } from "../index";

export function parseConstantPool(br: ByteReader, count: number): ConstantPool {
  const array: ConstantPool = [];
  for (let i = 0; i < count - 1; i++) {
    const tag = br.getUint8();
    array.push(readConstantPool(br, tag));
    if (tag === ConstantPoolTypes.long || tag === ConstantPoolTypes.double) {
      i++;
      array.push({ tag: 0 });
    }
  }
  return array;
}

function readConstantPool(br: ByteReader, tag: ConstantPoolTypes): ConstantPool[number] {
  switch (tag) {
    case ConstantPoolTypes.class:
      return { tag, nameIndex: br.getUint16() };
    case ConstantPoolTypes.fieldref:
      return { tag, classIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() };
    case ConstantPoolTypes.methodref:
      return { tag, classIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() };
    case ConstantPoolTypes.interfaceMethodref:
      return { tag, classIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() };
    case ConstantPoolTypes.string:
      return { tag, stringIndex: br.getUint16() };
    case ConstantPoolTypes.integer:
      return { tag, bytes: br.getUint32() };
    case ConstantPoolTypes.float:
      return { tag, bytes: br.getUint32() };
    case ConstantPoolTypes.long:
      return { tag, highBytes: br.getUint32(), lowBytes: br.getUint32() };
    case ConstantPoolTypes.double:
      return { tag, highBytes: br.getUint32(), lowBytes: br.getUint32() };
    case ConstantPoolTypes.nameAndType:
      return { tag, nameIndex: br.getUint16(), descriptorIndex: br.getUint16() };
    case ConstantPoolTypes.utf8:
      const length = br.getUint16();
      return { tag, length, bytes: br.getUint8s(length) };
    case ConstantPoolTypes.methodHandle:
      return { tag, referenceKind: br.getUint8(), referenceIndex: br.getUint16() };
    case ConstantPoolTypes.methodType:
      return { tag, descriptorIndex: br.getUint16() };
    case ConstantPoolTypes.invokeDynamic:
      return { tag, bootstrapMethodAttrIndex: br.getUint16(), nameAndTypeIndex: br.getUint16() };
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
  dynamic = 17,
  module = 19,
  package = 20,
}

export function poolTagToString(tag: number) {
  switch (tag) {
    case 7: return "Class";
    case 9: return "Fieldref";
    case 10: return "Methodref";
    case 11: return "InterfaceMethodref";
    case 8: return "String";
    case 3: return "Integer";
    case 4: return "Float";
    case 5: return "Long";
    case 6: return "Double";
    case 12: return "NameAndType";
    case 1: return "Utf8";
    case 15: return "MethodHandle";
    case 16: return "MethodType";
    case 18: return "InvokeDynamic";
    case 17: return "Dynamic";
    case 19: return "Module";
    case 20: return "Package";
    default: throw Error("Unknown tag");
  }
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

export type ConstantModuleInfo = CPInfo<ConstantPoolTypes.module> & {
  nameIndex: u2;
}

export type ConstantPackageInfo = CPInfo<ConstantPoolTypes.package> & {
  nameIndex: u2;
}

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

export type ConstantDynamicInfo = CPInfo<ConstantPoolTypes.dynamic> & Omit<ConstantInvokeDynamicInfo, "tag">;

export type ConstantPool = Array<
  CPInfo<0>
  | ConstantInfoMethodRef
  | ConstantClassInfo
  | ConstantModuleInfo
  | ConstantPackageInfo
  | FieldRefInfo
  | ConstantInterfanceMethodRefInfo
  | ConstantStringInfo
  | ConstantIntergerInfo
  | ConstantFloatInfo
  | ConstantLongInfo
  | ConstantDoubleInfo
  | ConstantNameAndTypeInfo
  | ConstantUtf8Info
  | ConstantMethodHandleInfo
  | ConstantMethodTypeInfo
  | ConstantInvokeDynamicInfo
  | ConstantDynamicInfo
>;
