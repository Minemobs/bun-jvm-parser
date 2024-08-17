import { parseAttributes, type CodeAttribute } from "./src/attributes";
import { parseConstantPool, type ConstantUtf8Info } from "./src/constantpool";
import { parseFields } from "./src/fields";
import { getInstructions } from "./src/instructions";
import { parseMethods } from "./src/methods";
import { ByteReader } from "./src/types";
import { toVersion, toStringAccessFlags, getClassName, parseInterfaces, fieldAccessFlagsToString, methodAccessFlagsToString } from "./src/utils";

function readBytes(buffer: ArrayBuffer) {
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
    methodsCount: ${methodsCount}
    attributesCount: ${attributesCount}
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

  const instructions = methods.flatMap(it => it.attributes
      .filter(it => Buffer.from((constantPool[it.attributeNameIndex - 1] as ConstantUtf8Info).bytes).toString("utf8") === "Code")
    ).map(it => getInstructions(it as CodeAttribute));
  console.log(instructions);
}


const file = await Bun.file(Bun.argv[2]).arrayBuffer();
readBytes(file);
