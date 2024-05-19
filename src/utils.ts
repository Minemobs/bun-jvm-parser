import type { ConstantClassInfo, ConstantPool, ConstantUtf8Info } from "./constantpool";
import type { ByteReader } from "./types";

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

export function getClassName(thisClassIndex: number, constantPool: ConstantPool) {
  const clazz = constantPool[thisClassIndex - 1] as ConstantClassInfo;
  const str = constantPool[clazz.nameIndex - 1] as ConstantUtf8Info;
  return Buffer.from(str.bytes).toString("utf8");
}

export function parseInterfaces(br: ByteReader, count: number, constantPool: ConstantPool): Array<ConstantClassInfo> {
  const array: ConstantClassInfo[] = [];
  for(let i = 0; i < count; i++) {
    const interfaceIndex = br.getUint16();
    array.push(constantPool[interfaceIndex - 1] as ConstantClassInfo);
  }
  return array;
}
