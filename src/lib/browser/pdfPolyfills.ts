/**
 * iOS & Safari Polyfills for PDF.js compatibility across all iOS versions.
 *
 * 1. Promise.withResolvers:
 *    Required by pdfjs-dist v4+ & v6+. Natively added in Safari 17.4 (iOS 17.4+).
 *    In iOS 15, 16, and 17.0–17.3, missing this causes:
 *    "TypeError: Promise.withResolvers is not a function".
 *
 * 2. Promise.try:
 *    Adopted in modern ECMAScript toolchains.
 *
 * 3. Object.hasOwn:
 *    Natively added in Safari 15.4 (iOS 15.4+). Required for iOS 15.0–15.3.
 *
 * 4. Array.prototype.at:
 *    Natively added in Safari 15.4 (iOS 15.4+). Required for iOS 15.0–15.3.
 */

export function installPdfPolyfills(): void {
  const g = typeof globalThis !== "undefined" ? (globalThis as Record<string, unknown>) : null;
  if (!g) return;

  const P = g.Promise as { withResolvers?: unknown; try?: unknown } | undefined;
  if (P && typeof P.withResolvers !== "function") {
    P.withResolvers = function <T>() {
      let resolve!: (value: T | PromiseLike<T>) => void;
      let reject!: (reason?: unknown) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }

  if (P && typeof P.try !== "function") {
    P.try = function <T>(fn: () => T | PromiseLike<T>): Promise<T> {
      return new Promise((resolve) => {
        resolve(fn());
      });
    };
  }

  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = function (obj: object, prop: PropertyKey): boolean {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };
  }

  if (typeof Array.prototype.at !== "function") {
    Array.prototype.at = function <T>(this: T[], n: number): T | undefined {
      let idx = Math.trunc(n) || 0;
      if (idx < 0) idx += this.length;
      if (idx < 0 || idx >= this.length) return undefined;
      return this[idx];
    };
  }
}

// Automatically install immediately upon import
installPdfPolyfills();
