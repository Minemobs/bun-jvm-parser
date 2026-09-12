import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";
import {
  type CodeAttribute, type ConstantUtf8Info,
  parseConstantPool, parseAttributes, parseFields, getInstructions, parseMethods, parseInterfaces,
  ByteReader, toVersion, toStringAccessFlags, getClassName, fieldAccessFlagsToString, methodAccessFlagsToString,
  type u2,
  ConstantPoolTypes,
  type ConstantPool,
  poolTagToString,
  type ConstantClassInfo,
  type ConstantNameAndTypeInfo
} from "../index";

function readBytes(buffer: ArrayBufferLike) {
  const dv = new DataView(buffer);
  const br = new ByteReader(dv);
  const magic = br.getUint32();
  if(magic != 0xCAFEBABE)
    throw Error("The provided file is not a JVM class");
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

  if (argv[3] === "full") {
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
    console.table(constantPool.map(it => {
      const clone : Record<string, unknown> = {...it};
      clone.tag = poolTagToString(it.tag);
      if (it.tag === ConstantPoolTypes.utf8)
        clone.bytes = Buffer.from(it.bytes).toString("utf8");
      return clone;
    }));
    console.log('-'.repeat(5) + "interfaces" + '-'.repeat(5));
    console.table(interfaces.map(it => constantPool[it.nameIndex - 1] as ConstantUtf8Info).map(it => Buffer.from(it.bytes).toString("utf8")));
    console.log('-'.repeat(5) + "fields" + '-'.repeat(5));
    console.table(fields.map(it => { return { accessFlags: fieldAccessFlagsToString(it.accessFlags), nameIndex: it.nameIndex, descriptorIndex: it.descriptorIndex, attributes: it.attributes } }));
    console.log('-'.repeat(5) + "methods" + '-'.repeat(5));
    console.table(methods.map(it => { return { accessFlags: methodAccessFlagsToString(it.accessFlags), nameIndex: it.nameIndex, descriptorIndex: it.descriptorIndex, attributes: it.attributes } }));
    console.log('-'.repeat(5) + "attributes" + '-'.repeat(5));
    console.table(attributes);
  }

  const instructions =
    methods.flatMap(
      it => it.attributes
        .filter(it => Buffer.from((constantPool[it.attributeNameIndex - 1] as ConstantUtf8Info).bytes).toString("utf8") === "Code")
        .map(att => [it.nameIndex, att] as [u2, CodeAttribute])
    )
      .map(([nameIndex, attr]) => {
        const functionName = Buffer.from((constantPool[nameIndex - 1] as ConstantUtf8Info).bytes).toString("utf8");
        const attrs = getInstructions(attr);
        const prettyInstructions = prettyPrintInstructions(constantPool, attrs).map(it => '\t' + it).join("\n");
        return `${functionName}() {\n${prettyInstructions}\n};`;
      });
  console.log(instructions.join("\n\n"))
}

function prettyPrintInstructions(constantPool: ConstantPool, instructions: ReturnType<typeof getInstructions>): string[] {
  const buffer: string[] = [];
  for (const instruction of instructions) {
    let str;
    switch (instruction.name) {
      case "invokevirtual":
      case "invokestatic":
      case "invokedynamic":
      case "invokespecial": {
        const constant = constantPool[instruction.indexbyte - 1];
        if(constant.tag === ConstantPoolTypes.methodref) {
          const getUtf8 = (i: number) => Buffer.from((constantPool[i - 1] as ConstantUtf8Info).bytes).toString("utf8");
          const clazz = constantPool[constant.classIndex - 1] as ConstantClassInfo;
          const nameAndType = constantPool[constant.nameAndTypeIndex - 1] as ConstantNameAndTypeInfo;
          const clazzName = getUtf8(clazz.nameIndex);
          const functionName = getUtf8(nameAndType.nameIndex);
          const typeName = getUtf8(nameAndType.descriptorIndex);
          str = `${clazzName}.${functionName}:${typeName}`;
        }
        break;
      }
      //@ts-expect-error
      case "ldc": {
        const constant = constantPool[instruction.index - 1];
        if (constant.tag === ConstantPoolTypes.utf8) {
          str = `"${Buffer.from(constant.bytes).toString("utf8")}"`;
          break;
        }
        if(constant.tag === ConstantPoolTypes.string) {
          str = `${Buffer.from((constantPool[constant.stringIndex - 1] as ConstantUtf8Info).bytes).toString("utf8")}`
          break;
        }
      }
      default: {
        const json = Object.keys(instruction).length == 1 ? "" : JSON.stringify(instruction, (k, v) => k == "name" ? undefined : v);
        str = json;
        break;
      }
    }
    buffer.push(`${instruction.name}\t${str}`);
  }
  return buffer;
}

if (argv.length < 3) {
  console.log("Usage %s example.ts <file> [full]", argv[0]);
  exit(1);
}

const file = new Uint8Array(readFileSync(argv[2])).buffer;
readBytes(file);
