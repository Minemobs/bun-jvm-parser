import { readFileSync } from "node:fs";
import {
  type CodeAttribute, type ConstantUtf8Info,
  parseConstantPool, parseAttributes, parseFields, getInstructions, parseMethods, parseInterfaces,
  ByteReader, toVersion, toStringAccessFlags, getClassName, fieldAccessFlagsToString, methodAccessFlagsToString,
  type Attributes
} from "./src/index";
import { argv } from "node:process";
import type { u2 } from "./src/types.js";

function readBytes(buffer: ArrayBufferLike) {
  const dv = new DataView(buffer);
  const br = new ByteReader(dv);
  const magic = br.getUint32();
  const minor = br.getUint16();
  const major = br.getUint16();
  const constantPoolCount = br.getUint16();
  const constantPool = parseConstantPool(br, constantPoolCount);
  const accessFlags = br.getUint16();
  const thisClass = br.getUint16();
  const superClass = br.getUint16();
  const interfacesCount = br.getUint16();
  const interfaces = parseInterfaces(br, interfacesCount, constantPool);
  const fieldsCount = br.getUint16();
  const fields = parseFields(br, fieldsCount, constantPool);
  const methodsCount = br.getUint16();
  const methods = parseMethods(br, methodsCount, constantPool);
  const attributesCount = br.getUint16();
  const attributes = parseAttributes(br, attributesCount, constantPool);

  if(Bun.argv[3] === "full") {
    console.log(`
      Magic: ${magic}
      MinorVersion: ${minor}
      majorVersion: ${toVersion(major)}
      cpCount: ${constantPoolCount}
      accessFlags: ${toStringAccessFlags(accessFlags)}
      thisClass: ${getClassName(thisClass, constantPool)}
      superClass: ${getClassName(superClass, constantPool)}
      interfacesCount: ${interfacesCount}
      fieldsCount: ${fieldsCount}
      `.split("\n").map(it => it.trim()).filter(it => it.length !== 0).join("\n"))
    console.log('-'.repeat(5) + "Constant pool" + '-'.repeat(5));
    console.table(constantPool);
    console.log('-'.repeat(5) + "interfaces" + '-'.repeat(5));
    console.table(interfaces.map(it => constantPool[it.nameIndex - 1] as ConstantUtf8Info).map(it => Buffer.from(it.bytes).toString("utf8")));
    console.log('-'.repeat(5) + "fields" + '-'.repeat(5));
    console.table(fields.map(it => { return { accessFlags: fieldAccessFlagsToString(it.accessFlags), nameIndex: it.nameIndex, descriptorIndex: it.descriptorIndex, attributes: it.attributes } }));
    console.log('-'.repeat(5) + "methods" + '-'.repeat(5));
    console.table(methods.map(it => { return { accessFlags: methodAccessFlagsToString(it.accessFlags), nameIndex: it.nameIndex, descriptorIndex: it.descriptorIndex, attributes: it.attributes } }));
    console.log('-'.repeat(5) + "attributes" + '-'.repeat(5));
    console.table(attributes);
  }

  const instructions = methods.flatMap(it => it.attributes
      .filter(it => Buffer.from((constantPool[it.attributeNameIndex - 1] as ConstantUtf8Info).bytes).toString("utf8") === "Code")
      .map(att => [it.nameIndex, att] as [u2, Attributes[number]])
    ).map(it => { return { function_name: Buffer.from((constantPool[it[0] - 1] as ConstantUtf8Info).bytes).toString("utf8"), attributes: getInstructions(it[1] as CodeAttribute) } });
  console.log(JSON.stringify(instructions, undefined, "  "));
}


//const file = await Bun.file(Bun.argv[2]).arrayBuffer();
const file = new Uint8Array(readFileSync(argv[2])).buffer;
readBytes(file);
