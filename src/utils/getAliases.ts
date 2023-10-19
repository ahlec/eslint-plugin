import { trimEnd } from "lodash";
import path from "path";
import { Rule } from "eslint";
import { ALIASES_SETTINGS_KEY } from "../settings";
import getRoot from "./getRoot";
import { isIndexableObject } from "./typeguards";

interface AliasDefinition {
  matchesAbsolute: (absoluteFilepath: string) => boolean;
  /**
   * @throws if the filepath isn't a match for this alias
   */
  convertToAlias: (absoluteFilepath: string) => string;
}

function explodePathPieces(filepath: string): readonly string[] {
  return filepath.split(/\\|\//);
}

export function buildSingleFileAlias(
  alias: string,
  singleFileAbsolutePath: string,
): AliasDefinition {
  return {
    convertToAlias: (): string => alias,
    matchesAbsolute: (absoluteFilepath): boolean =>
      absoluteFilepath === singleFileAbsolutePath,
  };
}

export function buildWildcardAlias(
  rawAlias: string,
  rootPathWithoutWildcard: string,
): AliasDefinition {
  // Remove any trailing separators and/or the wildcard from the settings
  const baseAlias = trimEnd(rawAlias, "\\/*");
  const rootPathPieces = explodePathPieces(
    trimEnd(rootPathWithoutWildcard, "\\/*"),
  );

  return {
    convertToAlias: (absoluteFilepath): string => {
      const absolutePathPieces = explodePathPieces(absoluteFilepath);
      if (absolutePathPieces.length < rootPathPieces.length) {
        throw new Error();
      }

      if (absolutePathPieces.length === rootPathPieces.length) {
        return baseAlias;
      }

      return (
        baseAlias +
        path.sep +
        absolutePathPieces.slice(rootPathPieces.length).join(path.sep)
      );
    },
    matchesAbsolute: (absoluteFilepath): boolean => {
      const absolutePathPieces = explodePathPieces(absoluteFilepath);
      for (let index = 0; index < rootPathPieces.length; ++index) {
        if (absolutePathPieces.length <= index) {
          // Absolute path is too short to be a match
          return false;
        }

        if (absolutePathPieces[index] !== rootPathPieces[index]) {
          // Paths differ
          return false;
        }
      }

      return true;
    },
  };
}

function getAliases(
  settings: Rule.RuleContext["settings"],
): readonly AliasDefinition[] {
  // Check to see if the field is set in the settings
  const raw: unknown = settings[ALIASES_SETTINGS_KEY];
  if (typeof raw === "undefined") {
    return [];
  }

  if (!isIndexableObject(raw)) {
    throw new Error(
      `'${ALIASES_SETTINGS_KEY}' setting expects to be an object`,
    );
  }

  // Get necessary settings
  const root = getRoot(settings);

  // Process and validate the alias rules
  const definitions: AliasDefinition[] = [];
  Object.entries(raw).forEach(([alias, rawVal]): void => {
    // First, validate that the value is a string
    if (typeof rawVal !== "string") {
      throw new Error(`Value for alias '${alias}' must be a string`);
    }

    // Next, validate that alias and value both match in terms of type
    // (single vs. wildcard)
    const aliasWildcardIndex = alias.indexOf("*");
    const valueWildcardIndex = rawVal.indexOf("*");
    const doesAliasHaveWildcard = aliasWildcardIndex >= 0;
    const doesValueHaveWildcard = valueWildcardIndex >= 0;
    if (doesAliasHaveWildcard !== doesValueHaveWildcard) {
      throw new Error(
        `Mismatch on alias '${alias}' -- ${
          doesAliasHaveWildcard
            ? "alias uses wildcard but value doesn't"
            : "value uses wildcard but alias doesn't"
        }`,
      );
    }

    // If the alias is a wildcard type, ensure that the wildcard comes
    // at the end.
    // This should ALSO validate (implicitly) that there's just a single
    // wildcard character
    if (doesAliasHaveWildcard) {
      if (aliasWildcardIndex !== alias.length - 1) {
        throw new Error(
          `Alias '${alias}' should have wildcard at end of definition`,
        );
      }

      if (valueWildcardIndex !== rawVal.length - 1) {
        throw new Error(
          `Value for alias '${alias}' should have wildcard at end of definition`,
        );
      }
    }

    // Build the alias definition based on the type
    definitions.push(
      doesAliasHaveWildcard
        ? buildWildcardAlias(alias, path.resolve(root, rawVal))
        : buildSingleFileAlias(alias, path.resolve(root, rawVal)),
    );
  });

  return definitions;
}

export default getAliases;
