import { parseAttributes, type Attributes } from "./attributes";
import type { ConstantPool } from "./constantpool";
import { ByteReader, type u2 } from "./types";

function parseMethod(br: ByteReader, constantPool: ConstantPool): MethodInfo {
  const [accessFlags, nameIndex, descriptorIndex, attributesCount] = br.getUint16s(4);
  const attributes = parseAttributes(br, attributesCount, constantPool);
  return {
    accessFlags,
    nameIndex,
    descriptorIndex,
    attributesCount,
    attributes
  }
}

export function parseMethods(br: ByteReader, count: number, constantPool: ConstantPool): MethodInfo[] {
  const fields: MethodInfo[] = [];
  for (let i = 0; i < count; i++) {
    fields.push(parseMethod(br, constantPool));
  }
  return fields;
}

export type MethodInfo = {
  accessFlags: u2;
  nameIndex: u2;
  descriptorIndex: u2;
  attributesCount: u2;
  attributes: Attributes;
};


