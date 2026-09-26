/**
 * Universal runtime polyfills for client-side device compatibility.
 * Especially critical for iOS Safari < 17.4, older Android WebViews,
 * and in-app browsers (WhatsApp, Instagram, Slack, etc.).
 */

// 1. ES2024 Promise.withResolvers (Required by pdfjs-dist 4.4+ and 6.x)
if (typeof Promise.withResolvers === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// 2. ES2022 Object.hasOwn
if (typeof Object.hasOwn === "undefined") {
  Object.hasOwn = function (obj: object, prop: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

// 3. URL.canParse (Safari < 17.0)
if (typeof URL.canParse === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (URL as any).canParse = function (url: string | URL, base?: string | URL): boolean {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}

export {};
