import type { Between, ByteReader, ArrayWithLength, u1, u2, u4 } from "./types";
import type { ConstantPool } from "./constantpool";

export type Attributes = Array<AttributeInfo & Record<string, number | number[]>>;

export function parseAttributes(br: ByteReader, count: number, constantPool: ConstantPool) {

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
  attributes: Attributes[];
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

type VerificationType<T> = { tag: T };
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

