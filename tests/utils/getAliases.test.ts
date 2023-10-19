import { ALIASES_SETTINGS_KEY } from "../../src/settings";
import getAliases, {
  buildSingleFileAlias,
  buildWildcardAlias,
} from "../../src/utils/getAliases";

interface IncludedAliasCase {
  absolute: string;
  expectedAlias: string;
}

describe("buildSingleFileAlias", () => {
  describe.each<{
    alias: string;
    path: string;
    excluded: readonly string[];
  }>([
    {
      alias: "@myfile",
      path: "/home/root/code/foo/bar/baz.ts",
      excluded: [
        "/home/foo",
        "/home/root/code/bar",
        "/",
        "/home/root/code/football",
        "/home/root/code/foo/bar/baz",
        "/home/root/code/foo/bar",
        "/home/root/code/foo/bar/baz.tsx",
        "/home/root/code/foo/bar/baz/boop.ts",
      ],
    },
  ])("ALIAS: $path → $alias", (spec): void => {
    const alias = buildSingleFileAlias(spec.alias, spec.path);

    describe(`INCLUDED: ${spec.path}`, () => {
      it("should identify the absolute path as included", () => {
        expect(alias.matchesAbsolute(spec.path)).toBe(true);
      });

      it("should convert the absolute path to the expected alias", () => {
        expect(alias.convertToAlias(spec.path)).toBe(spec.alias);
      });
    });

    describe.each(spec.excluded)("OUTSIDE: %s", (excluded): void => {
      it("should identify the absolute path as NOT being included", () => {
        expect(alias.matchesAbsolute(excluded)).toBe(false);
      });
    });
  });
});

describe("buildWildcardAlias", () => {
  describe.each<{
    alias: string;
    path: string;
    included: readonly IncludedAliasCase[];
    excluded: readonly string[];
  }>([
    {
      alias: "@foo",
      path: "/home/root/code/foo",
      included: [
        {
          absolute: "/home/root/code/foo/index.ts",
          expectedAlias: "@foo/index.ts",
        },
        {
          absolute: "/home/root/code/foo",
          expectedAlias: "@foo",
        },
        {
          absolute: "/home/root/code/foo/bar/baz.ts",
          expectedAlias: "@foo/bar/baz.ts",
        },
        {
          absolute: "/home/root/code/foo/some-file.log",
          expectedAlias: "@foo/some-file.log",
        },
      ],
      excluded: [
        "/home/foo",
        "/home/root/code/bar",
        "/",
        "/home/root/code/football",
        "/home/root/code/foo.log",
      ],
    },
  ])("ALIAS: $path → $alias", (spec): void => {
    const alias = buildWildcardAlias(spec.alias, spec.path);

    describe.each(spec.included)("INCLUDED: $absolute", (included): void => {
      it("should identify the absolute path as included", () => {
        expect(alias.matchesAbsolute(included.absolute)).toBe(true);
      });

      it("should convert the absolute path to the expected alias", () => {
        expect(alias.convertToAlias(included.absolute)).toBe(
          included.expectedAlias,
        );
      });
    });

    describe.each(spec.excluded)("OUTSIDE: %s", (excluded): void => {
      it("should identify the absolute path as NOT being included", () => {
        expect(alias.matchesAbsolute(excluded)).toBe(false);
      });
    });
  });
});

describe("getAliases", () => {
  test("it returns an empty array if not specified", () => {
    expect(getAliases({})).toEqual([]);
  });

  test("it throws an error if provided something other than an object", () => {
    expect(() => getAliases({ [ALIASES_SETTINGS_KEY]: true })).toThrowError();
    expect(() => getAliases({ [ALIASES_SETTINGS_KEY]: 1234 })).toThrowError();
    expect(() => getAliases({ [ALIASES_SETTINGS_KEY]: null })).toThrowError();
    expect(() => getAliases({ [ALIASES_SETTINGS_KEY]: "foo" })).toThrowError();
    expect(() =>
      getAliases({ [ALIASES_SETTINGS_KEY]: [123, 4567] }),
    ).toThrowError();
  });

  test("it returns an empty array if provided an empty object", () => {
    expect(
      getAliases({
        [ALIASES_SETTINGS_KEY]: {},
      }),
    ).toEqual([]);
  });

  test("it throws errors if provided an object with non-string values", () => {
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          hello: 1234,
        },
      }),
    ).toThrowError();
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          foo: null,
        },
      }),
    ).toThrowError();
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          bar: ["baz", "boo"],
        },
      }),
    ).toThrowError();
  });

  test("it throws errors if alias uses wildcard but value doesn't or vice versa", () => {
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          "@alec/*": "src/",
        },
      }),
    ).toThrowError();

    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          "@alec/": "src/*",
        },
      }),
    ).toThrowError();
  });

  test("it throws errors if wildcard doesn't come at end of string for alias or value", () => {
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          "@alec/*as": "src/*",
        },
      }),
    ).toThrowError();
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          "@alec/*": "src/*asdf",
        },
      }),
    ).toThrowError();
  });

  test("it throws errors if multiple wildcards found in alias or value", () => {
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          "@alec/**": "src/*",
        },
      }),
    ).toThrowError();
    expect(() =>
      getAliases({
        [ALIASES_SETTINGS_KEY]: {
          "@alec/*": "src/**",
        },
      }),
    ).toThrowError();
  });
});
