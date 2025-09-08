// Polyfills for Node.js globals in browser environment
// This ensures compatibility with libraries like @stomp/stompjs

// Define global if it doesn't exist
if (typeof global === 'undefined') {
    (globalThis as any).global = globalThis;
}

// Define process if it doesn't exist
if (typeof process === 'undefined') {
    (globalThis as any).process = {
        env: {},
        nextTick: (callback: Function) => setTimeout(callback, 0),
        version: '',
        versions: {},
        argv: [],
        platform: 'browser',
    };
}

// Define Buffer if it doesn't exist (some WebSocket libraries might need it)
if (typeof Buffer === 'undefined') {
    (globalThis as any).Buffer = class Buffer {
        static from(data: any): Buffer {
            return new Buffer(data);
        }

        static alloc(size: number): Buffer {
            return new Buffer(new ArrayBuffer(size));
        }

        constructor(data: any) {
            // Simple Buffer implementation for browser compatibility
        }
    };
}

export { };
