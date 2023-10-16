import {
  ERROR_MESSAGE_ID,
  NoExtraneousIndexRule,
} from "../../src/rules/no-extraneous-index";
import { createRuleTester } from "../helpers/rule-tester";

createRuleTester().run("no-extraneous-index", NoExtraneousIndexRule, {
  valid: [
    'import * as foo from "react";',
    'import foo from "../lib";',
    'import * as foo from "./dir";',
    'import bar from "./dir/file";',
    'import baz from "./index";',
    'const foo = require("react");',
    'const foo = require("../lib");',
    'const foo = require("./dir");',
    'const bar = require("./dir/file");',
    'const baz = require("./index");',
  ],
  invalid: [
    {
      code: 'import * as foo from "../lib/index";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      output: 'import * as foo from "../lib";',
    },
    {
      code: 'import "./bar/index";',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      output: 'import "./bar";',
    },
    {
      code: 'const x = require("../lib/index");',
      errors: [{ messageId: ERROR_MESSAGE_ID }],
      output: 'const x = require("../lib");',
    },
  ],
});
