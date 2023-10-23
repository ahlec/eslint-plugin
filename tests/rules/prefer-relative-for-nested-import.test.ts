import {
  ERROR_MESSAGE_ID,
  PreferRelativeForNestedImport,
} from "../../src/rules/prefer-relative-for-nested-import";
import { createRuleTester } from "../helpers/rule-tester";

createRuleTester({
  "ahlec/aliases": {
    "@foo/*": "foo/*",
    "@conf": "foo/conf.json",
    "@baz/*": "bar/baz/*",
  },
  "ahlec/root": "/home/root/code/my-repo/src",
}).run("prefer-relative-for-nested-import", PreferRelativeForNestedImport, {
  valid: [
    {
      code: 'import foo from "./myfile";',
      filename: "/home/root/code/my-repo/src/foo/index.ts",
    },
    {
      code: 'import another from "@baz/another";',
      filename: "/home/root/code/my-repo/src/foo/index.ts",
    },
    {
      code: 'import bar from "../bar";',
      filename: "/home/root/code/my-repo/src/foo/index.ts",
    },
    {
      code: 'import conf from "./conf.json";',
      filename: "/home/root/code/my-repo/src/foo/index.ts",
    },
    {
      code: 'import conf from "@conf";',
      filename: "/home/root/code/my-repo/src/baz/index.ts",
    },
    {
      code: 'import c from "./a/b/c";',
      filename: "/home/root/code/my-repo/src/foo/index.ts",
    },
  ],
  invalid: [
    {
      code: 'import baz from "@foo/file.js";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      filename: "/home/root/code/my-repo/src/foo/index.ts",
      output: 'import baz from "./file";',
    },
    {
      code: 'import conf from "@conf";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      filename: "/home/root/code/my-repo/src/foo/index.ts",
      output: 'import conf from "./conf.json";',
    },
    {
      code: 'import c from "@foo/a/b/c";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      filename: "/home/root/code/my-repo/src/foo/index.ts",
      output: 'import c from "./a/b/c";',
    },
  ],
});
