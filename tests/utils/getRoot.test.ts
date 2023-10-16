import { ROOT_SETTINGS_KEY } from "../../src/settings";
import getRoot from "../../src/utils/getRoot";

describe("getRoot", () => {
  const spy = jest.spyOn(process, "cwd");

  test("it returns cwd when setting undefined", () => {
    spy.mockReturnValue("/foo/bar/baz");
    expect(getRoot({})).toBe("/foo/bar/baz");
    expect(getRoot({ other: true })).toBe("/foo/bar/baz");
  });

  test("it throws error when non-string value found in setting", () => {
    expect(() => getRoot({ [ROOT_SETTINGS_KEY]: true })).toThrowError();
    expect(() => getRoot({ [ROOT_SETTINGS_KEY]: null })).toThrowError();
    expect(() =>
      getRoot({
        [ROOT_SETTINGS_KEY]: { foo: 12 },
      }),
    ).toThrowError();
    expect(() =>
      getRoot({ [ROOT_SETTINGS_KEY]: ["foo", "bar"] }),
    ).toThrowError();
  });

  test("it returns the value EXACTLY as found in settings if given absolute path", () => {
    expect(
      getRoot({
        [ROOT_SETTINGS_KEY]: "/home/alec/test",
      }),
    ).toBe("/home/alec/test");
    expect(
      getRoot({
        [ROOT_SETTINGS_KEY]: "/",
      }),
    ).toBe("/");
  });

  test("it resolves value relative to CWD if not given an absolute path", () => {
    spy.mockReturnValue("/home/foo");
    expect(
      getRoot({
        [ROOT_SETTINGS_KEY]: "src",
      }),
    ).toBe("/home/foo/src");
    expect(
      getRoot({
        [ROOT_SETTINGS_KEY]: "./src",
      }),
    ).toBe("/home/foo/src");
    expect(
      getRoot({
        [ROOT_SETTINGS_KEY]: ".",
      }),
    ).toBe("/home/foo");
    expect(
      getRoot({
        [ROOT_SETTINGS_KEY]: "../bar/src",
      }),
    ).toBe("/home/bar/src");
  });
});
