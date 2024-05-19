import { toVersion, ByteReader, toStringAccessFlags, parseConstantPool, getClassName, parseInterfaces, type ConstantUtf8Info } from "./utils";

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
  console.table(constantPool);
  console.table(interfaces.map(it => constantPool[it.nameIndex - 1] as ConstantUtf8Info).map(it => Buffer.from(it.bytes).toString("utf8")));
}


const file = await Bun.file(Bun.argv[2]).arrayBuffer();
readBytes(file);
