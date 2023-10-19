/**
 * Explicit alias definitions. By default, alias rules will match
 * exactly. Alias rules support a single '*' which will match
 * everything that follows it (and which cannot be followed by anything
 * else). The string value in the lookup is the file path. If the alias
 * uses a wildcard, the file path is required to have a wildcard as well
 * at the end.
 *
 * @example
 * {
 *    "@ahlec/*": "src/*",
 *    "@single-file": "src/foo/bar/baz.ts",
 * }
 */
interface AliasRules {
  [alias: string]: string;
}

export const ALIASES_SETTINGS_KEY = "ahlec/aliases";
export const ROOT_SETTINGS_KEY = "ahlec/root";

export interface AhlecEslintPluginSettings {
  [ALIASES_SETTINGS_KEY]?: AliasRules;
  [ROOT_SETTINGS_KEY]?: string;
}
