import { describe, it, expect, beforeEach } from "vitest";
import { lockScroll, unlockScroll } from "../scrollLock";

// Provide minimal document.body mock for node environment
if (typeof document === "undefined") {
  (globalThis as unknown as { document: { body: { style: { overflow: string } } } }).document = {
    body: {
      style: {
        overflow: "",
      },
    },
  };
}

describe("scrollLock utility", () => {
  beforeEach(() => {
    // Reset body style before each test
    document.body.style.overflow = "";
    // Reset internal lockCount by unlocking repeatedly
    unlockScroll();
    unlockScroll();
    unlockScroll();
  });

  it("sets body overflow to hidden on first lock", () => {
    expect(document.body.style.overflow).toBe("");
    lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("maintains hidden overflow when multiple callers lock", () => {
    lockScroll();
    lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("only restores body overflow when all callers have unlocked", () => {
    lockScroll(); // count = 1
    lockScroll(); // count = 2

    unlockScroll(); // count = 1
    expect(document.body.style.overflow).toBe("hidden");

    unlockScroll(); // count = 0
    expect(document.body.style.overflow).toBe("");
  });

  it("does not go below zero if unlocked more times than locked", () => {
    unlockScroll();
    unlockScroll();
    expect(document.body.style.overflow).toBe("");

    // Next lock should still cleanly set to hidden
    lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlockScroll();
    expect(document.body.style.overflow).toBe("");
  });
});
