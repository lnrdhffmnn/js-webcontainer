import { atomWithStorage } from "jotai/utils";

export const codeAtom = atomWithStorage<string>(
  "code",
  "console.log('Hello World');"
);
