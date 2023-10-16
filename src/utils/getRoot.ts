import path from "path";
import { Rule } from "eslint";
import { ROOT_SETTINGS_KEY } from "../settings";

function getDefaultRoot(): string {
  return process.cwd();
}

function getRoot(settings: Rule.RuleContext["settings"]): string {
  const value = settings[ROOT_SETTINGS_KEY];
  if (typeof value === "undefined") {
    return getDefaultRoot();
  }

  if (typeof value !== "string") {
    throw new Error(`'${ROOT_SETTINGS_KEY}' setting must be a string`);
  }

  if (value.startsWith("/")) {
    return value;
  }

  return path.resolve(process.cwd(), value);
}

export default getRoot;
