import type * as ESTree from "estree";
import type { Rule } from "eslint";

type SimpleStringLiteral = ESTree.SimpleLiteral & { value: string };

interface ModuleImport {
  node: ESTree.Node;
  type: "import" | "require";
  source: string;
  sourceNode: SimpleStringLiteral;
}

type ProcessModuleFn = (statement: ModuleImport) => void;

function assertIsSimpleStringLiteral(
  literal: ESTree.Literal,
): asserts literal is SimpleStringLiteral {
  if (typeof literal.value !== "string") {
    throw new Error(
      `Unexpected encounter of ${typeof literal.value} in import source`,
    );
  }

  if ("regex" in literal) {
    throw new Error("Unexpected RegExpLiteral in import statement");
  }

  if ("bigint" in literal) {
    throw new Error("Unexpected BigIntLiteral in import statement");
  }
}

function makeModuleListener(
  this: void,
  process: ProcessModuleFn,
): Rule.RuleListener {
  return {
    CallExpression: (node): void => {
      if (
        node.callee.type !== "Identifier" ||
        node.callee.name !== "require" ||
        node.arguments.length !== 1 ||
        node.arguments[0].type !== "Literal" ||
        typeof node.arguments[0].value !== "string"
      ) {
        return;
      }

      assertIsSimpleStringLiteral(node.arguments[0]);

      process({
        node,
        type: "require",
        source: node.arguments[0].value,
        sourceNode: node.arguments[0],
      });
    },
    ImportDeclaration: (node) => {
      assertIsSimpleStringLiteral(node.source);
      process({
        node,
        type: "import",
        source: node.source.value,
        sourceNode: node.source,
      });
    },
  };
}

export default makeModuleListener;
