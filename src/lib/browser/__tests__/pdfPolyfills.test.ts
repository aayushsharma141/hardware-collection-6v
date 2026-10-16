import { describe, it, expect } from "vitest";
import { installPdfPolyfills } from "../pdfPolyfills";

interface PromiseWithResolversStatic {
  withResolvers?: <T>() => {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
  };
}

describe("pdfPolyfills", () => {
  it("installs Promise.withResolvers and functions correctly", async () => {
    installPdfPolyfills();
    const P = Promise as unknown as PromiseWithResolversStatic;
    expect(typeof P.withResolvers).toBe("function");

    const resolvers = P.withResolvers?.<string>();
    expect(resolvers).toBeDefined();
    resolvers?.resolve("success");
    const result = await resolvers?.promise;
    expect(result).toBe("success");
  });

  it("handles Promise.withResolvers rejection", async () => {
    installPdfPolyfills();
    const P = Promise as unknown as PromiseWithResolversStatic;
    const resolvers = P.withResolvers?.<string>();
    expect(resolvers).toBeDefined();
    resolvers?.reject(new Error("failed"));
    await expect(resolvers?.promise).rejects.toThrow("failed");
  });

  it("ensures Object.hasOwn works reliably", () => {
    installPdfPolyfills();
    expect(Object.hasOwn({ test: 1 }, "test")).toBe(true);
    expect(Object.hasOwn({ test: 1 }, "missing")).toBe(false);
  });

  it("ensures Array.prototype.at works reliably with negative indices", () => {
    installPdfPolyfills();
    const arr = [10, 20, 30];
    expect(arr.at(0)).toBe(10);
    expect(arr.at(-1)).toBe(30);
    expect(arr.at(5)).toBeUndefined();
  });
});
