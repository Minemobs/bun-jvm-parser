import { toVersion, ByteReader, toStringAccessFlags, parseConstantPool, getThisClassName } from "./utils";

function readBytes(buffer: ArrayBuffer) {
  const dv = new DataView(buffer);
  const br = new ByteReader(dv);
  const magic = br.getUint32();
  const minor = br.getUint16();
  const major = br.getUint16();
  const constantPoolCount = br.getUint16();
  const constantPool = parseConstantPool(br, constantPoolCount);
  const accessFlags = br.getUint16();
  const thisClass = br.getUint8();
  const superClass = br.getUint8();
  const interfacesCount = br.getUint8();

  console.log(`
    Magic: ${magic}
    MinorVersion: ${minor}
    majorVersion: ${toVersion(major)}
    cpCount: ${constantPoolCount}
    accessFlags: ${toStringAccessFlags(accessFlags)}
    thisClass: ${getThisClassName(thisClass, constantPool)}
    superClass: ${(superClass)}
    interfacesCount: ${interfacesCount}
    `.split("\n").map(it => it.trim()).filter(it => it.length !== 0).join("\n"))
  console.table(constantPool);
}


const file = await Bun.file(Bun.argv[2]).arrayBuffer();
readBytes(file);
