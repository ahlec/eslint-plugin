const REGEX_PARENT_NAV = /\.\.(\\|\/)/;

export function isRelativePathToParent(path: string): boolean {
  return REGEX_PARENT_NAV.test(path);
}
