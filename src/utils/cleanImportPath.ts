import path from "path";

const EXTENSIONS_TO_REMOVE = [".js", ".cjs", ".jsx", ".ts", ".tsx"];
const REGEX_INDEX_FILE = /(\\|\/)index$/;

export function cleanImportPath(importPath: string): string {
  let cleaned = importPath;

  const ext = path.extname(cleaned);
  if (EXTENSIONS_TO_REMOVE.includes(ext)) {
    cleaned = cleaned.substring(0, cleaned.length - ext.length);
  }

  if (REGEX_INDEX_FILE.test(cleaned)) {
    if (cleaned === "./index" || cleaned === ".\\index") {
      // do nothing
    } else {
      cleaned = cleaned.substring(0, cleaned.length - "\\index".length);
    }
  }

  return cleaned;
}
