import {
  ERROR_MESSAGE_ID,
  PreferAliasForParentImportRule,
} from "../../src/rules/prefer-alias-for-parent-import";
import { createRuleTester } from "../helpers/rule-tester";

createRuleTester({
  "ahlec/aliases": {
    "@foo/*": "foo/*",
    "@conf": "foo/conf.json",
    "@baz/*": "bar/baz/*",
  },
  "ahlec/root": "/home/root/code/my-repo/src",
}).run("prefer-alias-for-parent-import", PreferAliasForParentImportRule, {
  valid: [
    {
      code: 'import foo from "@foo/myfile";',
      filename: "/home/root/code/my-repo/src/foo/index.ts",
    },
    {
      code: 'import foo from "./myfile";',
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
  ],
  invalid: [
    {
      code: 'import baz from "../bar/baz/file.js";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      filename: "/home/root/code/my-repo/src/foo/index.ts",
      output: 'import baz from "@baz/file";',
    },
    {
      code: 'import conf from "../foo/conf.json";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      filename: "/home/root/code/my-repo/src/bar/index.ts",
      output: 'import conf from "@conf";',
    },
    {
      code: 'import foo from "../foo/index";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      filename: "/home/root/code/my-repo/src/bar/index.ts",
      output: 'import foo from "@foo";',
    },
    {
      code: 'import foo from "../foo/myfile";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      filename: "/home/root/code/my-repo/src/bar/index.ts",
      output: 'import foo from "@foo/myfile";',
    },
  ],
});
