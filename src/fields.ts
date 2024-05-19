import type { Attributes } from "./attributes";
import type { ConstantPool } from "./constantpool";
import { ByteReader, type u2 } from "./types";

export function parseFields(br: ByteReader, count: number, constantPool: ConstantPool) {

}

export type FieldInfo = {
  accessFlags: u2;
  nameIndex: u2;
  descriptorIndex: u2;
  attributesCount: u2;
  attributes: Attributes;
};

