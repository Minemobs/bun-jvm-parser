import type { CodeAttribute } from "./attributes";
import type { ConstantClassInfo, ConstantPool, ConstantUtf8Info } from "./constantpool";
import type { Instructions } from "./instructions";
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

export function fieldAccessFlagsToString(flags: number): string[] {
  const flagsArray: string[] = [];
  if((flags & 0x0001) !== 0) flagsArray.push("ACC_PUBLIC");
  if((flags & 0x0002) !== 0) flagsArray.push("ACC_PRIVATE");
  if((flags & 0x0004) !== 0) flagsArray.push("ACC_PROTECTED");
  if((flags & 0x0008) !== 0) flagsArray.push("ACC_STATIC");
  if((flags & 0x0010) !== 0) flagsArray.push("ACC_FINAL");
  if((flags & 0x0040) !== 0) flagsArray.push("ACC_VOLATILE");
  if((flags & 0x0080) !== 0) flagsArray.push("ACC_TRANSIENT");
  if((flags & 0x1000) !== 0) flagsArray.push("ACC_SYNTHETIC");
  if((flags & 0x4000) !== 0) flagsArray.push("ACC_ENUM");
  return flagsArray;
}

export function methodAccessFlagsToString(flags: number): string[] {
  const flagsArray: string[] = [];
  if((flags & 0x0001) !== 0) flagsArray.push("ACC_PUBLIC");
  if((flags & 0x0002) !== 0) flagsArray.push("ACC_PRIVATE");
  if((flags & 0x0004) !== 0) flagsArray.push("ACC_PROTECTED");
  if((flags & 0x0008) !== 0) flagsArray.push("ACC_STATIC");
  if((flags & 0x0010) !== 0) flagsArray.push("ACC_FINAL");
  if((flags & 0x0020) !== 0) flagsArray.push("ACC_SYNCHRONIZED");
  if((flags & 0x0040) !== 0) flagsArray.push("ACC_BRIDGE");
  if((flags & 0x0080) !== 0) flagsArray.push("ACC_VARARGS");
  if((flags & 0x0100) !== 0) flagsArray.push("ACC_NATIVE");
  if((flags & 0x0400) !== 0) flagsArray.push("ACC_ABSTRACT");
  if((flags & 0x0400) !== 0) flagsArray.push("ACC_STRICT");
  if((flags & 0x1000) !== 0) flagsArray.push("ACC_SYNTHETIC");
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

