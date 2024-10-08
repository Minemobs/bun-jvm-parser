import { parseAttributes, type Attributes } from "./attributes";
import type { ConstantPool } from "./constantpool";
import { ByteReader, type u2 } from "./types";

function parseField(br: ByteReader, constantPool: ConstantPool): FieldInfo {
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

export function parseFields(br: ByteReader, count: number, constantPool: ConstantPool): FieldInfo[] {
  const fields: FieldInfo[] = [];
  for (let i = 0; i < count; i++) {
    fields.push(parseField(br, constantPool));
  }
  return fields;
}

export type FieldInfo = {
  accessFlags: u2;
  nameIndex: u2;
  descriptorIndex: u2;
  attributesCount: u2;
  attributes: Attributes;
};

