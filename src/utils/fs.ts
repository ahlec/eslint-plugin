const REGEX_PARENT_NAV = /\.\.(\\|\/)/;

export function isRelativePathToParent(path: string): boolean {
  return path === ".." || REGEX_PARENT_NAV.test(path);
}
