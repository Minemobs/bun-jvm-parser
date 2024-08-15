import type { CodeAttribute } from "./attributes";

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

function instructionToString(instruction: Instructions): string {
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

export function instructionsToString(instructions: Instructions[]): string[] {
  const buff: string[] = [];
  for (const instruction of instructions) {
    buff.push(instructionToString(instruction));
  }
  return buff;
}

export function getInstructions(attr: CodeAttribute): Instructions[] {
  const code = attr.code;
  const instructions: Instructions[] = [];
  //Fix loop by parsing every instructions
  for(let i = 0; i < code.length; i+= 4) {
    instructions.push(code[i]);
  }
  return instructions;
}
