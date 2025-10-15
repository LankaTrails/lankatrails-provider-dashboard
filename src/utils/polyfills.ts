// Polyfills for Node.js globals in browser environment
// This ensures compatibility with libraries like @stomp/stompjs and react-quill

import { Buffer } from 'buffer';

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

// Define Buffer globally for libraries that expect it (like react-quill)
if (typeof (globalThis as any).Buffer === 'undefined') {
    (globalThis as any).Buffer = Buffer;
} export { };
