import { describe, expect, it, vi, afterEach } from "vitest";
import { subscribe, getSnapshot, getServerSnapshot } from "../useIsDesktop";

describe("useIsDesktop helpers", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    globalThis.window = originalWindow;
    vi.restoreAllMocks();
  });

  it("getServerSnapshot returns false for SSR consistency", () => {
    expect(getServerSnapshot()).toBe(false);
  });

  it("returns false from getSnapshot when window is undefined", () => {
    // @ts-expect-error simulating SSR
    delete globalThis.window;
    expect(getSnapshot()).toBe(false);
  });

  it("returns matchMedia query result for 768px boundary", () => {
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(min-width: 768px)",
    }));

    globalThis.window = {
      matchMedia: matchMediaMock,
    } as unknown as Window & typeof globalThis;

    expect(getSnapshot()).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith("(min-width: 768px)");
  });

  it("subscribe handles undefined window safely by returning a no-op", () => {
    // @ts-expect-error simulating SSR
    delete globalThis.window;
    const unsub = subscribe(() => {});
    expect(typeof unsub).toBe("function");
    expect(() => unsub()).not.toThrow();
  });

  it("subscribe attaches and detaches change event listener", () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });

    globalThis.window = {
      matchMedia: matchMediaMock,
    } as unknown as Window & typeof globalThis;

    const onChange = vi.fn();
    const unsub = subscribe(onChange);

    expect(addEventListener).toHaveBeenCalledWith("change", onChange);

    unsub();
    expect(removeEventListener).toHaveBeenCalledWith("change", onChange);
  });
});
