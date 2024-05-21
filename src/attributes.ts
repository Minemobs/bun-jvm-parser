import type { Between, ByteReader, ArrayWithLength, u1, u2, u4 } from "./types";
import type { ConstantPool, ConstantUtf8Info } from "./constantpool";

export type Attributes = Array<AttributeInfo & Record<string, unknown>>;

export function parseAttributes(br: ByteReader, count: number, constantPool: ConstantPool): Attributes {
  return [];
}

function readVerificationType(br: ByteReader): VerificationTypeInfo {
  const tag = br.getUint8();
  const data = br.getUint16();
  if(tag === 7) return { tag, cpoolIndex: data };
  if(tag === 8) return { tag, offset: data };
  return { tag: tag as 0 };
}

function readStackMapFrame(br: ByteReader, constantPool: ConstantPool): StackMapFrame {
  const frameType = br.getUint8();
  if(frameType >= 0 && frameType <= 63) return { frameType };
  if(frameType >= 64 && frameType <= 127) return { frameType, stack: [readVerificationType(br)] };
  if(frameType === 247) return { frameType, offsetDelta: br.getUint16(), stack: [readVerificationType(br)] };
  if(frameType >= 248 && frameType <= 250) return { frameType, offsetDelta: br.getUint16() };
  if(frameType === 251) return { frameType, offsetDelta: br.getUint16() };
  if(frameType >= 252 && frameType <= 254) {
    const offsetDelta = br.getUint16();
    const locals = [];
    const length = frameType - 251;
    for(let i = 0; i < length; i++) locals.push(readVerificationType(br));
    return { frameType, offsetDelta, locals };
  }
  if(frameType === 255) {
    const offsetDelta = br.getUint16();
    const numberOfLocals = br.getUint16();
    const locals: VerificationTypeInfo[] = [];
    for(let i = 0; i < numberOfLocals; i++) locals.push(readVerificationType(br));
    const numberOfStackItems = br.getUint16();
    const stack: VerificationTypeInfo[] = [];
    for(let i = 0; i < numberOfStackItems; i++) stack.push(readVerificationType(br));
    return { frameType, offsetDelta, numberOfLocals, locals, numberOfStackItems, stack };
  }
  throw Error("Unknown frame type");
}

function readExceptionTable(br: ByteReader, length: u2): ExceptionTable {
  return {
    startPC: br.getUint16(),
    endPC: br.getUint16(),
    handlerPC: br.getUint16(),
    catchType: br.getUint16()
  };
}

function readCodeAttribute(br: ByteReader, constantPool: ConstantPool, { attributeNameIndex, attributeLength }: AttributeInfo): CodeAttribute {
  const maxStack = br.getUint16();
  const maxLocals = br.getUint16();
  const codeLength = br.getUint32();
  const code = br.getUint8s(codeLength);
  const exceptionTableLength = br.getUint16();
  const exceptionTable: ExceptionTable[] = [];
  for(let i = 0; i < exceptionTableLength; i++) exceptionTable.push(readExceptionTable(br, exceptionTableLength));
  const attributesCount = br.getUint16();
  const attributes: Attributes = [];
  for(let i = 0; i < attributesCount; i++) attributes.push(readAttribute(br, constantPool));
  return {
    attributeNameIndex,
    attributeLength,
    maxStack,
    maxLocals,
    codeLength,
    code,
    exceptionTableLength,
    exceptionTable,
    attributesCount,
    attributes
  }
}

export function readAttribute(br: ByteReader, constantPool: ConstantPool): Attributes[number] {
  const nameIndex = br.getUint16();
  const length = br.getUint32();
  const obj: Attributes[number] = { attributeNameIndex: nameIndex, attributeLength: length };
  const name = Buffer.from((constantPool[nameIndex - 1] as ConstantUtf8Info).bytes).toString("utf8");
  switch(name) {
    case "ConstantValue":
      (obj as ConstantValueAttribute).constantValueIndex = br.getUint16();
      break;
    case "Code":
      return readCodeAttribute(br, constantPool, obj);
    case "StackMapTable":
      const smtAttribute = obj as StackMapTableAttribute;
      smtAttribute.numberOfEntries = br.getUint16();
      smtAttribute.entries = [];
      for(let i = 0; i < smtAttribute.numberOfEntries; i++) smtAttribute.entries.push(readStackMapFrame(br, constantPool));
      break;
    case "Exceptions":
      const excAttribute = obj as ExceptionsAttribute;
      excAttribute.numberOfExceptions = br.getUint16();
      excAttribute.exceptionIndexTable = br.getUint8();
      break;
    case "InnerClasses":
      break;
  }
  return obj;
}

export type AttributeInfo = {
  attributeNameIndex: u2;
  attributeLength: u4;
};

export type ConstantValueAttribute = AttributeInfo & {
  constantValueIndex: u2;
};

export type CodeAttribute = AttributeInfo & {
  maxStack: u2;
  maxLocals: u2;
  codeLength: u4;
  code: u1[];
  exceptionTableLength: u2;
  exceptionTable: ExceptionTable[];
  attributesCount: u2;
  attributes: Attributes;
};

export type StackMapTableAttribute = AttributeInfo & {
  numberOfEntries: u2;
  entries: StackMapFrame[];
};

type ExceptionsAttribute = AttributeInfo & {
  numberOfExceptions: u2;
  exceptionIndexTable: u1;
};

type InnerClassesAttribute = AttributeInfo & {
  numberOfClasses: u2;
  classes: Classes[];
};

type EnclosingMethodAttribute = AttributeInfo & {
  classIndex: u2;
  methodIndex: u2;
};

type SyntheticAttribute = Omit<AttributeInfo, "attributeLength"> & {
  attributeLength: 0;
};

type SignatureAttribute = AttributeInfo & { signatureIndex: u2 };

type SourceFileAttribute = AttributeInfo & { sourceFileIndex: u2 };

type SourceDebugExtensionAttribute = AttributeInfo & {
  debugExtension: ArrayWithLength<u1, AttributeInfo["attributeLength"]>
};

type LineNumberAttribute = AttributeInfo & {
  lineNumberTableLength: u2;
  lineNumberTable: LineNumberTable[];
};

type LocalVariableTableAttribute = AttributeInfo & {
  localVaraibleTableLength: u2;
  localVariableTable: LocalVariableTable[];
};

type LocalVariableTypeTableAttribute = AttributeInfo & {
  localVariableTypeTableLength: u2;
  localVariableTypeTable: LocalVariableTypeTable[];
};

type DeprecatedAttribute = Omit<AttributeInfo, "attributeLength"> & {
  attributeLength: 0;
};

type RuntimeVisibleAnnotationsAttribute = AttributeInfo & {
  numAnnotations: u2;
  annotations: Annotation[];
};

type RuntimeInvisibleAnnotationsAttribute = AttributeInfo & {
  numAnnotations: u2;
  annotations: Annotation[];
};

type RuntimeVisibleParameterAnnotationsAttribute = AttributeInfo & {
  numParameters: u1;
  parameterAnnotations: ParameterAnnotations[];
};

type RuntimeInvisibleParameterAnnotationsAttribute = RuntimeVisibleParameterAnnotationsAttribute;

type RuntimeVisibleTypeAnnotationsAttribute = AttributeInfo & {
  numAnnotations: u2;
  annotations: TypeAnnotation[];
}

type RuntimeInvisibleTypeAnnotationsAttribute = RuntimeVisibleTypeAnnotationsAttribute;

type AnnotationDefaultAttribute = AttributeInfo & {
  defaultValue: ElementValue;
};

type BootstrapMethodsAttribute = AttributeInfo & {
  numBootstrapMethods: u2;
  bootstrapMethods: BootstrapMethods[];
};

type MethodParameters = AttributeInfo & {
  parametersCount: u1;
  parameters: Parameters[];
};

// Other
type Parameters = {
  nameIndex: u2;
  accessFlags: u2;
};

type BootstrapMethods = {
  bootstrapMethodRef: u2;
  numBootstrapArguments: u2;
  bootstrapArguments: u2[];
};

type Path = {
    typePathKind: u1;
    typeArgumentIndex: u1;
};

type TypePath = {
  pathLength: u1;
  path: Path[];
};

type TargetInfo = 
  TypeParameterTarget |
  SuperTypeTarget |
  TypeParameterBoundTarget |
  EmptyTarget |
  FormalParameterTarget |
  ThrowsTarget |
  LocalvarTarget |
  CatchTarget |
  OffsetTarget |
  TypeArgumentTarget;


type TypeParameterTarget = { typeParameterIndex: u1 };
type SuperTypeTarget = { superTypeIndex: u2 };
type TypeParameterBoundTarget = { typeParameterIndex: u1; boundIndex: u1 };
type EmptyTarget = Record<never, never>;
type FormalParameterTarget = { formalParameterIndex: u1 };
type ThrowsTarget = { throwsTypeIndex: u2 };
type LocalvarTarget = { tableLength: u2; table: Table[] };
type CatchTarget = { exceptionTableIndex: u2 };
type OffsetTarget = { offset: u2 };
type TypeArgumentTarget = { offset: u2; typeArgumentIndex: u1 };

type TypeAnnotation = {
  targetType: u1;
  targetInfo: TargetInfo;
  targetPath: TypePath;
  typeIndex: u2;
  numElementValuePairs: u2;
  elementValuePairs: ElementValuePairs[];
};

type ParameterAnnotations = {
  numAnnotations: u2;
  annotations: Annotation[];
};

type ElementValue = {
  tag: u1;
  value: u2 | { typeNameIndex: u2; constNameIndex: u2 } | u2 | Annotation | { numValues: u2; values: ElementValue[] };
};

type ElementValuePairs = {
  elementNameIndex: u2;
  value: ElementValue;
};

type Annotation = {
  typeIndex: u2;
  numElementValuePairs: u2;
  elementValuePairs: ElementValuePairs[];
};

type Table = { startPC: u2; length: u2; index: u2 };

type LocalVariableTypeTable = {
  startPC: u2;
  length: u2;
  nameIndex: u2;
  signatureIndex: u2;
  index: u2;
};

type LocalVariableTable = {
  startPC: u2;
  length: u2;
  nameIndex: u2;
  descriptorIndex: u2;
  index: u2;
};

type LineNumberTable = {
  startPC: u2;
  lineNumber: u2
};

type Classes = {
  innerClassInfoIndex: u2;
  outerClassInfoIndex: u2;
  innerNameIndex: u2;
  innerClassAccessFlags: u2;
};

type VerificationType<T extends u1> = { tag: T };
type TopVariableInfo = VerificationType<0>;
type IntergerVariableInfo = VerificationType<1>;
type FloatVariableInfo = VerificationType<2>;
type LongVariableInfo = VerificationType<4>;
type DoubleVariableInfo = VerificationType<3>;
type NullVariableInfo = VerificationType<5>;
type UninitializedThisVariableInfo = VerificationType<6>;
type ObjectVariableInfo = VerificationType<7> & { cpoolIndex: u2 };
type UninitializedVariableInfo = VerificationType<8> & { offset: u2 };

type VerificationTypeInfo =
  TopVariableInfo |
  IntergerVariableInfo |
  FloatVariableInfo |
  LongVariableInfo |
  DoubleVariableInfo |
  NullVariableInfo |
  UninitializedThisVariableInfo |
  ObjectVariableInfo |
  UninitializedVariableInfo;

type Frame<T> = { frameType: T };
type SameFrame = Frame<Between<u1, 0, 63>>;
type SameLocals1StackItemFrame = Frame<Between<u1, 64, 127>> & { stack: ArrayWithLength<VerificationTypeInfo, 1> };
type SameLocals1StackItemFrameExtended = Frame<247> & { offsetDelta: u2, stack: ArrayWithLength<VerificationTypeInfo, 1> };
type ChopFrame = Frame<Between<u1, 248, 250>> & { offsetDelta: u2 };
type SameFrameExtended = Frame<251> & { offsetDelta: u2 };
type AppendFrame = Frame<Between<u1, 252, 254>> & { offsetDelta: u2, locals: VerificationTypeInfo[] /* Length = this.frameType - 251 ~= [1; 3] */ }
type FullFrame = Frame<255> & { offsetDelta: u2, numberOfLocals: u2, locals: VerificationTypeInfo[], numberOfStackItems: u2, stack: VerificationTypeInfo[] };

type StackMapFrame =
  SameFrame |
  SameLocals1StackItemFrame |
  SameLocals1StackItemFrameExtended |
  ChopFrame |
  SameFrameExtended |
  AppendFrame |
  FullFrame;

type ExceptionTable = {
  startPC: u2;
  endPC: u2;
  handlerPC: u2;
  catchType: u2;
};

