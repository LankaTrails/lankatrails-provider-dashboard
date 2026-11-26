// Global type declarations for the Node.js globals provided by utils/polyfills.ts

declare global {
  // `var` is the only way to declare a property on globalThis
  /* eslint-disable no-var */
  var Buffer: typeof import("buffer").Buffer;
  var global: typeof globalThis;
  var process: {
    env: Record<string, string | undefined>;
    nextTick: (callback: () => void) => void;
    version: string;
    versions: Record<string, string>;
    argv: string[];
    platform: string;
  };
  /* eslint-enable no-var */
}

export {};
