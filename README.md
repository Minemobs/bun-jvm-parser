# bun-jvm-parser

bun-jvm-parser is a library to parse JVM ByteCode, whilst the name of this project contains `bun`, it can still be used on any JS runtime.

> [!WARNING]
  As of now, every index in the constant pool are off by one because the JVM classpool starts at index 1 compared to our classpool which starts at 0.
  In order to index into an element you'll have to substract one:
  ```js
  const poolIndex = getPoolIndexFrom(....);
  const element = constantPool[poolIndex - 1];
  ```

## How to use:
Currently, the library isn't on NPM or JSR because it hasn't been tested properly (especially with modules), if you wish to use it you'll have to clone the repository in your project.
For an example on how to use the library, please look at `example/example.ts`
