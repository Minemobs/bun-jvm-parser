import type { CodeAttribute } from "./attributes";
import type { u1, u2, u4 } from "./types";

export type Instruction<T extends keyof _instructions> = _instructions[T];

export function instructionsToString(instructions: Instructions[]): string[] {
  const buff: string[] = [];
  for (const instruction of instructions) {
    buff.push(instructionToString(instruction));
  }
  return buff;
}

export function getInstructions(attr: CodeAttribute): BaseInstruction[] {
  const code = attr.code;
  const instructions: BaseInstruction[] = [];
  for (let i = 0; i < code.length; i++) {
    const [newIndex, instruction] = getInstruction(code, i);
    instructions.push(instruction);
    i = newIndex;
  }
  return instructions;
}

function readInt32(code: number[], index: number): number {
  return (code[index] << 24) | (code[index + 1] << 16) | (code[index + 2] << 8) | code[index + 3];
}

function readInt16(code: number[], index: number): number {
  return (code[index] << 8) | code[index + 1];
}

function getInstruction(code: number[], index: number): [number, BaseInstruction] {
  // const name = Buffer.from((cp[index] as ConstantUtf8Info).bytes).toString("utf8");
  const name = instructionToString(code[index]);
  if(name === "nop") {
    console.log("Nop at index:", index);
  }
  switch (name) {
    case "nop":
    case "aconst_null":
    case "iconst_m1":
    case "iconst_0":
    case "iconst_1":
    case "iconst_2":
    case "iconst_3":
    case "iconst_4":
    case "iconst_5":
    case "lconst_0":
    case "lconst_1":
    case "fconst_0":
    case "fconst_1":
    case "fconst_2":
    case "dconst_0":
    case "dconst_1":
    case "iload_0":
    case "iload_1":
    case "iload_2":
    case "iload_3":
    case "lload_0":
    case "lload_1":
    case "lload_2":
    case "lload_3":
    case "fload_0":
    case "fload_1":
    case "fload_2":
    case "fload_3":
    case "dload_0":
    case "dload_1":
    case "dload_2":
    case "dload_3":
    case "aload_0":
    case "aload_1":
    case "aload_2":
    case "aload_3":
    case "iaload":
    case "laload":
    case "faload":
    case "daload":
    case "aaload":
    case "baload":
    case "caload":
    case "saload":
    case "istore_0":
    case "istore_1":
    case "istore_2":
    case "istore_3":
    case "lstore_0":
    case "lstore_1":
    case "lstore_2":
    case "lstore_3":
    case "fstore_0":
    case "fstore_1":
    case "fstore_2":
    case "fstore_3":
    case "dstore_0":
    case "dstore_1":
    case "dstore_2":
    case "dstore_3":
    case "astore_0":
    case "astore_1":
    case "astore_2":
    case "astore_3":
    case "iastore":
    case "lastore":
    case "fastore":
    case "dastore":
    case "aastore":
    case "bastore":
    case "castore":
    case "sastore":
    case "pop":
    case "pop2":
    case "dup":
    case "dup_x1":
    case "dup_x2":
    case "dup2":
    case "dup2_x1":
    case "dup2_x2":
    case "swap":
    case "iadd":
    case "ladd":
    case "fadd":
    case "dadd":
    case "isub":
    case "lsub":
    case "fsub":
    case "dsub":
    case "imul":
    case "lmul":
    case "fmul":
    case "dmul":
    case "idiv":
    case "ldiv":
    case "fdiv":
    case "ddiv":
    case "irem":
    case "lrem":
    case "frem":
    case "drem":
    case "ineg":
    case "lneg":
    case "fneg":
    case "dneg":
    case "ishl":
    case "lshl":
    case "ishr":
    case "lshr":
    case "iushr":
    case "lushr":
    case "iand":
    case "land":
    case "ior":
    case "lor":
    case "ixor":
    case "lxor":
    case "i2l":
    case "i2f":
    case "i2d":
    case "l2i":
    case "l2f":
    case "l2d":
    case "f2i":
    case "f2l":
    case "f2d":
    case "d2i":
    case "d2l":
    case "d2f":
    case "i2b":
    case "i2c":
    case "i2s":
    case "lcmp":
    case "fcmpl":
    case "fcmpg":
    case "dcmpl":
    case "dcmpg":
    case "ireturn":
    case "lreturn":
    case "freturn":
    case "dreturn":
    case "areturn":
    case "return":
    case "arraylength":
    case "athrow":
    case "monitorenter":
    case "monitorexit":
    case "breakpoint":
    case "impdep1":
    case "impdep2":
      return [index, { name } as BaseInstruction];
    case "bipush":
      return [ index + 1, { name, byte: code[index + 1]} as BiPushInstruction];
    case "sipush":
      return [ index + 2, { name, byte: readInt16(code, index + 1)} as SiPushInstruction];
    case "ldc":
      return [ index + 1, { name, index: code[index + 1]} as LdcInstruction];
    case "ldc_w":
    case "ldc2_w":
      return [ index + 2, { name, indexbyte: readInt16(code, index + 1)} as Ldc_WInstruction];
    case "iload":
    case "lload":
    case "fload":
    case "dload":
    case "aload":
    case "istore":
    case "lstore":
    case "fstore":
    case "dstore":
    case "astore":
      return [ index + 1, { name, index: code[index + 1]} as ILoadInstruction];
    case "iinc":
      return [ index + 2, { name, index: code[index + 1], const: code[index + 2]} as IIncInstruction];
    case "ifeq":
    case "ifne":
    case "iflt":
    case "ifge":
    case "ifgt":
    case "ifle":
    case "if_icmpeq":
    case "if_icmpne":
    case "if_icmplt":
    case "if_icmpge":
    case "if_icmpgt":
    case "if_icmple":
    case "if_acmpeq":
    case "if_acmpne":
    case "goto":
    case "jsr":
    case "ifnull":
    case "ifnonnull":
      return [index + 2, { name, branchbyte: readInt16(code, index + 1)} as IfEqInstruction];
    case "ret":
      return [index + 1, { name, index: code[index + 1] } as RetInstruction];
    case "tableswitch":
      return getTableSwitchInstruction(name, index, code);
    case "lookupswitch":
      return getLookupSwitchInstruction(name, index, code);
    case "getstatic":
    case "putstatic":
    case "getfield":
    case "putfield":
    case "invokevirtual":
    case "invokespecial":
    case "invokestatic":
    case "new":
    case "anewarray":
    case "checkcast":
    case "instanceof":
      return [ index + 2, { name, indexbyte: readInt16(code, index + 1) } as GetStaticInstruction];
    case "invokeinterface":
      return [ index + 4, { name, indexbyte: readInt16(code, index + 1), count: code[index + 3], "_": 0} as InvokeInterfaceInstruction];
    case "invokedynamic":
      return [ index + 4, { name, indexbyte: readInt16(code, index + 1), "_": 0} as InvokeInterfaceInstruction];
    case "newarray":
      return [ index + 1, { name, atype: code[index + 1] } as NewArrayInstruction];
    case "wide":
      return getWideInstruction(name, index, code);
    case "multianewarray":
      return [ index + 3, { name, indexbyte: readInt16(code, index + 1), dimensions: code[index + 3] } as MultiANewArrayInstruction];
    case "goto_w":
    case "jsr_w":
      return [ index + 4, { name, branchbyte: readInt32(code, index + 1) } as Goto_WInstruction];
    default: throw Error("Unknown instruction: " + name, { cause: { name, code, index } });
  }
}

function getWideInstruction(name: string, index: number, code: number[]): [number, WideInstruction] {
   const opcode = code[index + 1];
   if(opcode === Instructions.IINC) {
     return [index + 5, { name, iinc: 132, index: readInt16(code, index + 2), const: readInt16(code, index + 4)}];
   } else {
     return [index + 3, { name, opcode, index: readInt16(code, index + 2) }];
   }
}

function getTableSwitchInstruction(name: string, index: number, code: number[]): [number, TableSwitchInstruction] {
  const startsAt = 4 - ((index + 1) % 4);
  let i = index + startsAt;
  const defaultByte = readInt32(code, i);
  i += 4;
  const lowByte = readInt32(code, i);
  i += 4;
  const highByte = readInt32(code, i);
  i += 4;
  const offsetsNum = highByte - lowByte + 1;
  const offsets: u4[] = [];
  for(let j = 0; j < offsetsNum; j++) {
    offsets[j] = readInt32(code, i);
    i += 4;
  }
  return [ i - 1, { name, padding: 0, defaultByte, highByte, lowByte, jumpOffsets: offsets }];
}

function getLookupSwitchInstruction(name: string, index: number, code: number[]): [number, LookupSwitchInstruction] {
  const startsAt = 4 - ((index + 1) % 4);
  let i = index + startsAt + 1;
  const defaultByte = readInt32(code, i);
  i += 4;
  const npairs = readInt32(code, i);
  i += 4;
  const offsets: LookupSwitchInstruction["matchOffsetPairs"] = [];
  for(let j = 0; j < npairs; j++) {
    const value = readInt32(code, i);
    i += 4;
    const offset = readInt32(code, i);
    i += 4;
    offsets.push({ matchCase: value, offset });
  }
  return [ i - 1, { name, padding: 0, defaultByte, npairs, matchOffsetPairs: offsets }];
}

type BaseInstruction = { name: string };
type BiPushInstruction = { byte: u1 } & BaseInstruction;
type SiPushInstruction = { byte: u2 } & BaseInstruction;
type LdcInstruction = { index: u1 } & BaseInstruction;
type Ldc_WInstruction = { indexbyte: u2 } & BaseInstruction;
type Ldc2_WInstruction = { indexbyte: u2 } & BaseInstruction;
type ILoadInstruction = { index: u1 } & BaseInstruction;
type LLoadInstruction = { index: u1 } & BaseInstruction;
type FLoadInstruction = { index: u1 } & BaseInstruction;
type DLoadInstruction = { index: u1 } & BaseInstruction;
type ALoadInstruction = { index: u1 } & BaseInstruction;
type IStoreInstruction = { index: u1 } & BaseInstruction;
type LStoreInstruction = { index: u1 } & BaseInstruction;
type FStoreInstruction = { index: u1 } & BaseInstruction;
type DStoreInstruction = { index: u1 } & BaseInstruction;
type AStoreInstruction = { index: u1 } & BaseInstruction;
type IIncInstruction = { index: u1, const: u1 } & BaseInstruction;
type IfEqInstruction = { branchbyte: u2 } & BaseInstruction;
type IfNeInstruction = { branchbyte: u2 } & BaseInstruction;
type IfLtInstruction = { branchbyte: u2 } & BaseInstruction;
type IfGeInstruction = { branchbyte: u2 } & BaseInstruction;
type IfGtInstruction = { branchbyte: u2 } & BaseInstruction;
type IfLeInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ICmpEqInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ICmpNeInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ICmpLtInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ICmpGeInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ICmpGtInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ICmpLeInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ACmpEqInstruction = { branchbyte: u2 } & BaseInstruction;
type If_ACmpNeInstruction = { branchbyte: u2 } & BaseInstruction;
type GotoInstruction = { branchbyte: u2 } & BaseInstruction;
type JsrInstruction = { branchbyte: u2 } & BaseInstruction;
type RetInstruction = { index: u1 } & BaseInstruction;
type GetStaticInstruction = { indexbyte: u2 } & BaseInstruction;
type PutStaticInstruction = { indexbyte: u2 } & BaseInstruction;
type GetFieldInstruction = { indexbyte: u2 } & BaseInstruction;
type PutFieldInstruction = { indexbyte: u2 } & BaseInstruction;
type InvokeVirtualInstruction = { indexbyte: u2 } & BaseInstruction;
type InvokeSpecialInstruction = { indexbyte: u2 } & BaseInstruction;
type InvokeStaticInstruction = { indexbyte: u2 } & BaseInstruction;
type InvokeInterfaceInstruction = { indexbyte: u2, count: u1, _: u2 } & BaseInstruction;
type InvokeDynamicInstruction = { indexbyte: u2, _: u2 } & BaseInstruction;
type NewInstruction = { indexbyte: u2 } & BaseInstruction;
type NewArrayInstruction = { atype: u1 } & BaseInstruction;
type ANewArrayInstruction = { indexbyte: u2 } & BaseInstruction;
type CheckCastInstruction = { indexbyte: u2 } & BaseInstruction;
type InstanceofInstruction = { indexbyte: u2 } & BaseInstruction;
type MultiANewArrayInstruction = { indexbyte: u2, dimensions: u1 } & BaseInstruction;
type IfNullInstruction = { branchbyte: u2 } & BaseInstruction;
type IfNonNullInstruction = { branchbyte: u2 } & BaseInstruction;
type Goto_WInstruction = { branchbyte: u4 } & BaseInstruction;
type Jsr_WInstruction = { branchbyte: u4 } & BaseInstruction;
type TableSwitchInstruction = {
  /* Between 0-3 bytes of padding,
  * in order to know how much padding is necessary we have to check the
  * index inside the code array and it should be a multiple of 4
  * otherwise we add padding until it is
  */
  padding: number;
  defaultByte: u4;
  lowByte: u4;
  highByte: u4;
  jumpOffsets: u4[]; // high - low + 1 number of bytes
} & BaseInstruction;
type WideInstruction = { opcode: u1, index: u2 } & BaseInstruction | { iinc: 132, index: u2, const: u2 } & BaseInstruction;
type LookupSwitchInstruction = {
  padding: number; //same as tableswitch
  defaultByte: u4;
  npairs: u4;
  matchOffsetPairs: { matchCase: u4, offset: u4 }[];
} & BaseInstruction;

type _instructions = {
  NOP: BaseInstruction;
  ACONST_NULL: BaseInstruction;
  ICONST_M1: BaseInstruction;
  ICONST_0: BaseInstruction;
  ICONST_1: BaseInstruction;
  ICONST_2: BaseInstruction;
  ICONST_3: BaseInstruction;
  ICONST_4: BaseInstruction;
  ICONST_5: BaseInstruction;
  LCONST_0: BaseInstruction;
  LCONST_1: BaseInstruction;
  FCONST_0: BaseInstruction;
  FCONST_1: BaseInstruction;
  FCONST_2: BaseInstruction;
  DCONST_0: BaseInstruction;
  DCONST_1: BaseInstruction;
  BIPUSH: BiPushInstruction;
  SIPUSH: SiPushInstruction;
  LDC: LdcInstruction;
  LDC_W: Ldc_WInstruction;
  LDC2_W: Ldc2_WInstruction;
  ILOAD: ILoadInstruction;
  LLOAD: LLoadInstruction;
  FLOAD: FLoadInstruction;
  DLOAD: DLoadInstruction;
  ALOAD: ALoadInstruction;
  ILOAD_0: BaseInstruction;
  ILOAD_1: BaseInstruction;
  ILOAD_2: BaseInstruction;
  ILOAD_3: BaseInstruction;
  LLOAD_0: BaseInstruction;
  LLOAD_1: BaseInstruction;
  LLOAD_2: BaseInstruction;
  LLOAD_3: BaseInstruction;
  FLOAD_0: BaseInstruction;
  FLOAD_1: BaseInstruction;
  FLOAD_2: BaseInstruction;
  FLOAD_3: BaseInstruction;
  DLOAD_0: BaseInstruction;
  DLOAD_1: BaseInstruction;
  DLOAD_2: BaseInstruction;
  DLOAD_3: BaseInstruction;
  ALOAD_0: BaseInstruction;
  ALOAD_1: BaseInstruction;
  ALOAD_2: BaseInstruction;
  ALOAD_3: BaseInstruction;
  IALOAD: BaseInstruction;
  LALOAD: BaseInstruction;
  FALOAD: BaseInstruction;
  DALOAD: BaseInstruction;
  AALOAD: BaseInstruction;
  BALOAD: BaseInstruction;
  CALOAD: BaseInstruction;
  SALOAD: BaseInstruction;
  ISTORE: IStoreInstruction;
  LSTORE: LStoreInstruction;
  FSTORE: FStoreInstruction;
  DSTORE: DStoreInstruction;
  ASTORE: AStoreInstruction;
  ISTORE_0: BaseInstruction;
  ISTORE_1: BaseInstruction;
  ISTORE_2: BaseInstruction;
  ISTORE_3: BaseInstruction;
  LSTORE_0: BaseInstruction;
  LSTORE_1: BaseInstruction;
  LSTORE_2: BaseInstruction;
  LSTORE_3: BaseInstruction;
  FSTORE_0: BaseInstruction;
  FSTORE_1: BaseInstruction;
  FSTORE_2: BaseInstruction;
  FSTORE_3: BaseInstruction;
  DSTORE_0: BaseInstruction;
  DSTORE_1: BaseInstruction;
  DSTORE_2: BaseInstruction;
  DSTORE_3: BaseInstruction;
  ASTORE_0: BaseInstruction;
  ASTORE_1: BaseInstruction;
  ASTORE_2: BaseInstruction;
  ASTORE_3: BaseInstruction;
  IASTORE: BaseInstruction;
  LASTORE: BaseInstruction;
  FASTORE: BaseInstruction;
  DASTORE: BaseInstruction;
  AASTORE: BaseInstruction;
  BASTORE: BaseInstruction;
  CASTORE: BaseInstruction;
  SASTORE: BaseInstruction;
  POP: BaseInstruction;
  POP2: BaseInstruction;
  DUP: BaseInstruction;
  DUP_X1: BaseInstruction;
  DUP_X2: BaseInstruction;
  DUP2: BaseInstruction;
  DUP2_X1: BaseInstruction;
  DUP2_X2: BaseInstruction;
  SWAP: BaseInstruction;
  IADD: BaseInstruction;
  LADD: BaseInstruction;
  FADD: BaseInstruction;
  DADD: BaseInstruction;
  ISUB: BaseInstruction;
  LSUB: BaseInstruction;
  FSUB: BaseInstruction;
  DSUB: BaseInstruction;
  IMUL: BaseInstruction;
  LMUL: BaseInstruction;
  FMUL: BaseInstruction;
  DMUL: BaseInstruction;
  IDIV: BaseInstruction;
  LDIV: BaseInstruction;
  FDIV: BaseInstruction;
  DDIV: BaseInstruction;
  IREM: BaseInstruction;
  LREM: BaseInstruction;
  FREM: BaseInstruction;
  DREM: BaseInstruction;
  INEG: BaseInstruction;
  LNEG: BaseInstruction;
  FNEG: BaseInstruction;
  DNEG: BaseInstruction;
  ISHL: BaseInstruction;
  LSHL: BaseInstruction;
  ISHR: BaseInstruction;
  LSHR: BaseInstruction;
  IUSHR: BaseInstruction;
  LUSHR: BaseInstruction;
  IAND: BaseInstruction;
  LAND: BaseInstruction;
  IOR: BaseInstruction;
  LOR: BaseInstruction;
  IXOR: BaseInstruction;
  LXOR: BaseInstruction;
  IINC: IIncInstruction;
  I2L: BaseInstruction;
  I2F: BaseInstruction;
  I2D: BaseInstruction;
  L2I: BaseInstruction;
  L2F: BaseInstruction;
  L2D: BaseInstruction;
  F2I: BaseInstruction;
  F2L: BaseInstruction;
  F2D: BaseInstruction;
  D2I: BaseInstruction;
  D2L: BaseInstruction;
  D2F: BaseInstruction;
  I2B: BaseInstruction;
  I2C: BaseInstruction;
  I2S: BaseInstruction;
  LCMP: BaseInstruction;
  FCMPL: BaseInstruction;
  FCMPG: BaseInstruction;
  DCMPL: BaseInstruction;
  DCMPG: BaseInstruction;
  IFEQ: IfEqInstruction;
  IFNE: IfNeInstruction;
  IFLT: IfLtInstruction;
  IFGE: IfGeInstruction;
  IFGT: IfGtInstruction;
  IFLE: IfLeInstruction;
  IF_ICMPEQ: If_ICmpEqInstruction;
  IF_ICMPNE: If_ICmpNeInstruction;
  IF_ICMPLT: If_ICmpLtInstruction;
  IF_ICMPGE: If_ICmpGeInstruction;
  IF_ICMPGT: If_ICmpGtInstruction;
  IF_ICMPLE: If_ICmpLeInstruction;
  IF_ACMPEQ: If_ACmpEqInstruction;
  IF_ACMPNE: If_ACmpNeInstruction;
  GOTO: GotoInstruction;
  JSR: JsrInstruction;
  RET: RetInstruction;
  TABLESWITCH: TableSwitchInstruction;
  LOOKUPSWITCH: LookupSwitchInstruction;
  IRETURN: BaseInstruction;
  LRETURN: BaseInstruction;
  FRETURN: BaseInstruction;
  DRETURN: BaseInstruction;
  ARETURN: BaseInstruction;
  RETURN: BaseInstruction;
  GETSTATIC: GetStaticInstruction;
  PUTSTATIC: PutStaticInstruction;
  GETFIELD: GetFieldInstruction;
  PUTFIELD: PutFieldInstruction;
  INVOKEVIRTUAL: InvokeVirtualInstruction;
  INVOKESPECIAL: InvokeSpecialInstruction;
  INVOKESTATIC: InvokeStaticInstruction;
  INVOKEINTERFACE: InvokeInterfaceInstruction;
  INVOKEDYNAMIC: InvokeDynamicInstruction;
  NEW: NewInstruction;
  NEWARRAY: NewArrayInstruction;
  ANEWARRAY: ANewArrayInstruction;
  ARRAYLENGTH: BaseInstruction;
  ATHROW: BaseInstruction;
  CHECKCAST: CheckCastInstruction;
  INSTANCEOF: InstanceofInstruction;
  MONITORENTER: BaseInstruction;
  MONITOREXIT: BaseInstruction;
  WIDE: WideInstruction;
  MULTIANEWARRAY: MultiANewArrayInstruction;
  IFNULL: IfNullInstruction;
  IFNONNULL: IfNonNullInstruction;
  GOTO_W: Goto_WInstruction;
  JSR_W: Jsr_WInstruction;
  BREAKPOINT: BaseInstruction;
  IMPDEP1: BaseInstruction;
  IMPDEP2: BaseInstruction
};

export const enum Instructions {
  NOP = 0,
  ACONST_NULL = 1,
  ICONST_M1 = 2,
  ICONST_0 = 3,
  ICONST_1 = 4,
  ICONST_2 = 5,
  ICONST_3 = 6,
  ICONST_4 = 7,
  ICONST_5 = 8,
  LCONST_0 = 9,
  LCONST_1 = 10,
  FCONST_0 = 11,
  FCONST_1 = 12,
  FCONST_2 = 13,
  DCONST_0 = 14,
  DCONST_1 = 15,
  BIPUSH = 16,
  SIPUSH = 17,
  LDC = 18,
  LDC_W = 19,
  LDC2_W = 20,
  ILOAD = 21,
  LLOAD = 22,
  FLOAD = 23,
  DLOAD = 24,
  ALOAD = 25,
  ILOAD_0 = 26,
  ILOAD_1 = 27,
  ILOAD_2 = 28,
  ILOAD_3 = 29,
  LLOAD_0 = 30,
  LLOAD_1 = 31,
  LLOAD_2 = 32,
  LLOAD_3 = 33,
  FLOAD_0 = 34,
  FLOAD_1 = 35,
  FLOAD_2 = 36,
  FLOAD_3 = 37,
  DLOAD_0 = 38,
  DLOAD_1 = 39,
  DLOAD_2 = 40,
  DLOAD_3 = 41,
  ALOAD_0 = 42,
  ALOAD_1 = 43,
  ALOAD_2 = 44,
  ALOAD_3 = 45,
  IALOAD = 46,
  LALOAD = 47,
  FALOAD = 48,
  DALOAD = 49,
  AALOAD = 50,
  BALOAD = 51,
  CALOAD = 52,
  SALOAD = 53,
  ISTORE = 54,
  LSTORE = 55,
  FSTORE = 56,
  DSTORE = 57,
  ASTORE = 58,
  ISTORE_0 = 59,
  ISTORE_1 = 60,
  ISTORE_2 = 61,
  ISTORE_3 = 62,
  LSTORE_0 = 63,
  LSTORE_1 = 64,
  LSTORE_2 = 65,
  LSTORE_3 = 66,
  FSTORE_0 = 67,
  FSTORE_1 = 68,
  FSTORE_2 = 69,
  FSTORE_3 = 70,
  DSTORE_0 = 71,
  DSTORE_1 = 72,
  DSTORE_2 = 73,
  DSTORE_3 = 74,
  ASTORE_0 = 75,
  ASTORE_1 = 76,
  ASTORE_2 = 77,
  ASTORE_3 = 78,
  IASTORE = 79,
  LASTORE = 80,
  FASTORE = 81,
  DASTORE = 82,
  AASTORE = 83,
  BASTORE = 84,
  CASTORE = 85,
  SASTORE = 86,
  POP = 87,
  POP2 = 88,
  DUP = 89,
  DUP_X1 = 90,
  DUP_X2 = 91,
  DUP2 = 92,
  DUP2_X1 = 93,
  DUP2_X2 = 94,
  SWAP = 95,
  IADD = 96,
  LADD = 97,
  FADD = 98,
  DADD = 99,
  ISUB = 100,
  LSUB = 101,
  FSUB = 102,
  DSUB = 103,
  IMUL = 104,
  LMUL = 105,
  FMUL = 106,
  DMUL = 107,
  IDIV = 108,
  LDIV = 109,
  FDIV = 110,
  DDIV = 111,
  IREM = 112,
  LREM = 113,
  FREM = 114,
  DREM = 115,
  INEG = 116,
  LNEG = 117,
  FNEG = 118,
  DNEG = 119,
  ISHL = 120,
  LSHL = 121,
  ISHR = 122,
  LSHR = 123,
  IUSHR = 124,
  LUSHR = 125,
  IAND = 126,
  LAND = 127,
  IOR = 128,
  LOR = 129,
  IXOR = 130,
  LXOR = 131,
  IINC = 132,
  I2L = 133,
  I2F = 134,
  I2D = 135,
  L2I = 136,
  L2F = 137,
  L2D = 138,
  F2I = 139,
  F2L = 140,
  F2D = 141,
  D2I = 142,
  D2L = 143,
  D2F = 144,
  I2B = 145,
  I2C = 146,
  I2S = 147,
  LCMP = 148,
  FCMPL = 149,
  FCMPG = 150,
  DCMPL = 151,
  DCMPG = 152,
  IFEQ = 153,
  IFNE = 154,
  IFLT = 155,
  IFGE = 156,
  IFGT = 157,
  IFLE = 158,
  IF_ICMPEQ = 159,
  IF_ICMPNE = 160,
  IF_ICMPLT = 161,
  IF_ICMPGE = 162,
  IF_ICMPGT = 163,
  IF_ICMPLE = 164,
  IF_ACMPEQ = 165,
  IF_ACMPNE = 166,
  GOTO = 167,
  JSR = 168,
  RET = 169,
  TABLESWITCH = 170,
  LOOKUPSWITCH = 171,
  IRETURN = 172,
  LRETURN = 173,
  FRETURN = 174,
  DRETURN = 175,
  ARETURN = 176,
  RETURN = 177,
  GETSTATIC = 178,
  PUTSTATIC = 179,
  GETFIELD = 180,
  PUTFIELD = 181,
  INVOKEVIRTUAL = 182,
  INVOKESPECIAL = 183,
  INVOKESTATIC = 184,
  INVOKEINTERFACE = 185,
  INVOKEDYNAMIC = 186,
  NEW = 187,
  NEWARRAY = 188,
  ANEWARRAY = 189,
  ARRAYLENGTH = 190,
  ATHROW = 191,
  CHECKCAST = 192,
  INSTANCEOF = 193,
  MONITORENTER = 194,
  MONITOREXIT = 195,
  WIDE = 196,
  MULTIANEWARRAY = 197,
  IFNULL = 198,
  IFNONNULL = 199,
  GOTO_W = 200,
  JSR_W = 201,
  BREAKPOINT = 202,
  IMPDEP1 = 254,
  IMPDEP2 = 255
};

function instructionToString(instruction: Instructions): Lowercase<keyof _instructions> {
  switch (instruction) {
    case Instructions.NOP: return "nop";
    case Instructions.ACONST_NULL: return "aconst_null";
    case Instructions.ICONST_M1: return "iconst_m1";
    case Instructions.ICONST_0: return "iconst_0";
    case Instructions.ICONST_1: return "iconst_1";
    case Instructions.ICONST_2: return "iconst_2";
    case Instructions.ICONST_3: return "iconst_3";
    case Instructions.ICONST_4: return "iconst_4";
    case Instructions.ICONST_5: return "iconst_5";
    case Instructions.LCONST_0: return "lconst_0";
    case Instructions.LCONST_1: return "lconst_1";
    case Instructions.FCONST_0: return "fconst_0";
    case Instructions.FCONST_1: return "fconst_1";
    case Instructions.FCONST_2: return "fconst_2";
    case Instructions.DCONST_0: return "dconst_0";
    case Instructions.DCONST_1: return "dconst_1";
    case Instructions.BIPUSH: return "bipush";
    case Instructions.SIPUSH: return "sipush";
    case Instructions.LDC: return "ldc";
    case Instructions.LDC_W: return "ldc_w";
    case Instructions.LDC2_W: return "ldc2_w";
    case Instructions.ILOAD: return "iload";
    case Instructions.LLOAD: return "lload";
    case Instructions.FLOAD: return "fload";
    case Instructions.DLOAD: return "dload";
    case Instructions.ALOAD: return "aload";
    case Instructions.ILOAD_0: return "iload_0";
    case Instructions.ILOAD_1: return "iload_1";
    case Instructions.ILOAD_2: return "iload_2";
    case Instructions.ILOAD_3: return "iload_3";
    case Instructions.LLOAD_0: return "lload_0";
    case Instructions.LLOAD_1: return "lload_1";
    case Instructions.LLOAD_2: return "lload_2";
    case Instructions.LLOAD_3: return "lload_3";
    case Instructions.FLOAD_0: return "fload_0";
    case Instructions.FLOAD_1: return "fload_1";
    case Instructions.FLOAD_2: return "fload_2";
    case Instructions.FLOAD_3: return "fload_3";
    case Instructions.DLOAD_0: return "dload_0";
    case Instructions.DLOAD_1: return "dload_1";
    case Instructions.DLOAD_2: return "dload_2";
    case Instructions.DLOAD_3: return "dload_3";
    case Instructions.ALOAD_0: return "aload_0";
    case Instructions.ALOAD_1: return "aload_1";
    case Instructions.ALOAD_2: return "aload_2";
    case Instructions.ALOAD_3: return "aload_3";
    case Instructions.IALOAD: return "iaload";
    case Instructions.LALOAD: return "laload";
    case Instructions.FALOAD: return "faload";
    case Instructions.DALOAD: return "daload";
    case Instructions.AALOAD: return "aaload";
    case Instructions.BALOAD: return "baload";
    case Instructions.CALOAD: return "caload";
    case Instructions.SALOAD: return "saload";
    case Instructions.ISTORE: return "istore";
    case Instructions.LSTORE: return "lstore";
    case Instructions.FSTORE: return "fstore";
    case Instructions.DSTORE: return "dstore";
    case Instructions.ASTORE: return "astore";
    case Instructions.ISTORE_0: return "istore_0";
    case Instructions.ISTORE_1: return "istore_1";
    case Instructions.ISTORE_2: return "istore_2";
    case Instructions.ISTORE_3: return "istore_3";
    case Instructions.LSTORE_0: return "lstore_0";
    case Instructions.LSTORE_1: return "lstore_1";
    case Instructions.LSTORE_2: return "lstore_2";
    case Instructions.LSTORE_3: return "lstore_3";
    case Instructions.FSTORE_0: return "fstore_0";
    case Instructions.FSTORE_1: return "fstore_1";
    case Instructions.FSTORE_2: return "fstore_2";
    case Instructions.FSTORE_3: return "fstore_3";
    case Instructions.DSTORE_0: return "dstore_0";
    case Instructions.DSTORE_1: return "dstore_1";
    case Instructions.DSTORE_2: return "dstore_2";
    case Instructions.DSTORE_3: return "dstore_3";
    case Instructions.ASTORE_0: return "astore_0";
    case Instructions.ASTORE_1: return "astore_1";
    case Instructions.ASTORE_2: return "astore_2";
    case Instructions.ASTORE_3: return "astore_3";
    case Instructions.IASTORE: return "iastore";
    case Instructions.LASTORE: return "lastore";
    case Instructions.FASTORE: return "fastore";
    case Instructions.DASTORE: return "dastore";
    case Instructions.AASTORE: return "aastore";
    case Instructions.BASTORE: return "bastore";
    case Instructions.CASTORE: return "castore";
    case Instructions.SASTORE: return "sastore";
    case Instructions.POP: return "pop";
    case Instructions.POP2: return "pop2";
    case Instructions.DUP: return "dup";
    case Instructions.DUP_X1: return "dup_x1";
    case Instructions.DUP_X2: return "dup_x2";
    case Instructions.DUP2: return "dup2";
    case Instructions.DUP2_X1: return "dup2_x1";
    case Instructions.DUP2_X2: return "dup2_x2";
    case Instructions.SWAP: return "swap";
    case Instructions.IADD: return "iadd";
    case Instructions.LADD: return "ladd";
    case Instructions.FADD: return "fadd";
    case Instructions.DADD: return "dadd";
    case Instructions.ISUB: return "isub";
    case Instructions.LSUB: return "lsub";
    case Instructions.FSUB: return "fsub";
    case Instructions.DSUB: return "dsub";
    case Instructions.IMUL: return "imul";
    case Instructions.LMUL: return "lmul";
    case Instructions.FMUL: return "fmul";
    case Instructions.DMUL: return "dmul";
    case Instructions.IDIV: return "idiv";
    case Instructions.LDIV: return "ldiv";
    case Instructions.FDIV: return "fdiv";
    case Instructions.DDIV: return "ddiv";
    case Instructions.IREM: return "irem";
    case Instructions.LREM: return "lrem";
    case Instructions.FREM: return "frem";
    case Instructions.DREM: return "drem";
    case Instructions.INEG: return "ineg";
    case Instructions.LNEG: return "lneg";
    case Instructions.FNEG: return "fneg";
    case Instructions.DNEG: return "dneg";
    case Instructions.ISHL: return "ishl";
    case Instructions.LSHL: return "lshl";
    case Instructions.ISHR: return "ishr";
    case Instructions.LSHR: return "lshr";
    case Instructions.IUSHR: return "iushr";
    case Instructions.LUSHR: return "lushr";
    case Instructions.IAND: return "iand";
    case Instructions.LAND: return "land";
    case Instructions.IOR: return "ior";
    case Instructions.LOR: return "lor";
    case Instructions.IXOR: return "ixor";
    case Instructions.LXOR: return "lxor";
    case Instructions.IINC: return "iinc";
    case Instructions.I2L: return "i2l";
    case Instructions.I2F: return "i2f";
    case Instructions.I2D: return "i2d";
    case Instructions.L2I: return "l2i";
    case Instructions.L2F: return "l2f";
    case Instructions.L2D: return "l2d";
    case Instructions.F2I: return "f2i";
    case Instructions.F2L: return "f2l";
    case Instructions.F2D: return "f2d";
    case Instructions.D2I: return "d2i";
    case Instructions.D2L: return "d2l";
    case Instructions.D2F: return "d2f";
    case Instructions.I2B: return "i2b";
    case Instructions.I2C: return "i2c";
    case Instructions.I2S: return "i2s";
    case Instructions.LCMP: return "lcmp";
    case Instructions.FCMPL: return "fcmpl";
    case Instructions.FCMPG: return "fcmpg";
    case Instructions.DCMPL: return "dcmpl";
    case Instructions.DCMPG: return "dcmpg";
    case Instructions.IFEQ: return "ifeq";
    case Instructions.IFNE: return "ifne";
    case Instructions.IFLT: return "iflt";
    case Instructions.IFGE: return "ifge";
    case Instructions.IFGT: return "ifgt";
    case Instructions.IFLE: return "ifle";
    case Instructions.IF_ICMPEQ: return "if_icmpeq";
    case Instructions.IF_ICMPNE: return "if_icmpne";
    case Instructions.IF_ICMPLT: return "if_icmplt";
    case Instructions.IF_ICMPGE: return "if_icmpge";
    case Instructions.IF_ICMPGT: return "if_icmpgt";
    case Instructions.IF_ICMPLE: return "if_icmple";
    case Instructions.IF_ACMPEQ: return "if_acmpeq";
    case Instructions.IF_ACMPNE: return "if_acmpne";
    case Instructions.GOTO: return "goto";
    case Instructions.JSR: return "jsr";
    case Instructions.RET: return "ret";
    case Instructions.TABLESWITCH: return "tableswitch";
    case Instructions.LOOKUPSWITCH: return "lookupswitch";
    case Instructions.IRETURN: return "ireturn";
    case Instructions.LRETURN: return "lreturn";
    case Instructions.FRETURN: return "freturn";
    case Instructions.DRETURN: return "dreturn";
    case Instructions.ARETURN: return "areturn";
    case Instructions.RETURN: return "return";
    case Instructions.GETSTATIC: return "getstatic";
    case Instructions.PUTSTATIC: return "putstatic";
    case Instructions.GETFIELD: return "getfield";
    case Instructions.PUTFIELD: return "putfield";
    case Instructions.INVOKEVIRTUAL: return "invokevirtual";
    case Instructions.INVOKESPECIAL: return "invokespecial";
    case Instructions.INVOKESTATIC: return "invokestatic";
    case Instructions.INVOKEINTERFACE: return "invokeinterface";
    case Instructions.INVOKEDYNAMIC: return "invokedynamic";
    case Instructions.NEW: return "new";
    case Instructions.NEWARRAY: return "newarray";
    case Instructions.ANEWARRAY: return "anewarray";
    case Instructions.ARRAYLENGTH: return "arraylength";
    case Instructions.ATHROW: return "athrow";
    case Instructions.CHECKCAST: return "checkcast";
    case Instructions.INSTANCEOF: return "instanceof";
    case Instructions.MONITORENTER: return "monitorenter";
    case Instructions.MONITOREXIT: return "monitorexit";
    case Instructions.WIDE: return "wide";
    case Instructions.MULTIANEWARRAY: return "multianewarray";
    case Instructions.IFNULL: return "ifnull";
    case Instructions.IFNONNULL: return "ifnonnull";
    case Instructions.GOTO_W: return "goto_w";
    case Instructions.JSR_W: return "jsr_w";
    case Instructions.BREAKPOINT: return "breakpoint";
    case Instructions.IMPDEP1: return "impdep1";
    case Instructions.IMPDEP2: return "impdep2";
  }
}
