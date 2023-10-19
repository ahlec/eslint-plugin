import { cleanImportPath } from "../../src/utils/cleanImportPath";

describe("cleanImportPath", () => {
  it("removes .js extensions", (): void => {
    expect(cleanImportPath("@foo/file.js")).toBe("@foo/file");
    expect(cleanImportPath("@foo/file.jsx")).toBe("@foo/file");
    expect(cleanImportPath("@foo/file.cjs")).toBe("@foo/file");
    expect(cleanImportPath("@foo/file.generated.js")).toBe(
      "@foo/file.generated",
    );
  });

  it("removes .ts extensions", (): void => {
    expect(cleanImportPath("@foo/file.ts")).toBe("@foo/file");
    expect(cleanImportPath("@foo/file.tsx")).toBe("@foo/file");
    expect(cleanImportPath("@foo/file.generated.ts")).toBe(
      "@foo/file.generated",
    );
    expect(cleanImportPath("@foo/file.generated.tsx")).toBe(
      "@foo/file.generated",
    );
  });

  it("doesn't remove non-JavaScript extensions", (): void => {
    expect(cleanImportPath("@foo/file.log")).toBe("@foo/file.log");
    expect(cleanImportPath("@foo/file.json")).toBe("@foo/file.json");
  });

  it("doesn't remove JavaScript extensions that aren't the final extension", (): void => {
    expect(cleanImportPath("@foo/file.js.default")).toBe(
      "@foo/file.js.default",
    );
    expect(cleanImportPath("@foo/file.ts.default")).toBe(
      "@foo/file.ts.default",
    );
  });

  it("removes explicit index file from path", (): void => {
    expect(cleanImportPath("@foo/bar/index")).toBe("@foo/bar");
    expect(cleanImportPath("@foo/index.js")).toBe("@foo");
    expect(cleanImportPath("@foo/bar/index.tsx")).toBe("@foo/bar");
  });

  it("DOESN'T remove explicit index file if importing from own directory", (): void => {
    expect(cleanImportPath("./index")).toBe("./index");
    expect(cleanImportPath("./index.js")).toBe("./index");
    expect(cleanImportPath("./index.ts")).toBe("./index");
    expect(cleanImportPath("./index.tsx")).toBe("./index");
  });

  it("DOESN'T remove index file from path if it has a non-JavaScript extension", (): void => {
    expect(cleanImportPath("@foo/index.log")).toBe("@foo/index.log");
    expect(cleanImportPath("@foo/index.txt")).toBe("@foo/index.txt");
  });

  it("DOESN'T remove index file from path if not the final piece of path", (): void => {
    expect(cleanImportPath("@foo/index/myfile.ts")).toBe("@foo/index/myfile");
    expect(cleanImportPath("@foo/index/index.ts")).toBe("@foo/index");
  });

  it("doesn't just naively truncate 'index' off the end of the path", (): void => {
    expect(cleanImportPath("@foo/myindex")).toBe("@foo/myindex");
    expect(cleanImportPath("@index")).toBe("@index");
  });
});
