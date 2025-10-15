// Global type declarations for polyfilled Node.js globals

declare global {
    var Buffer: typeof import('buffer').Buffer;
    var global: typeof globalThis;
    var process: {
        env: Record<string, string | undefined>;
        nextTick: (callback: Function) => void;
        version: string;
        versions: Record<string, string>;
        argv: string[];
        platform: string;
    };
}

export { };