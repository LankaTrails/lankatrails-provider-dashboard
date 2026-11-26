// Node.js globals that @stomp/stompjs, sockjs-client and react-quill expect in the browser.
import { Buffer } from "buffer";

const g = globalThis as typeof globalThis & Record<string, unknown>;

if (typeof g.global === "undefined") {
  g.global = globalThis;
}

if (typeof g.process === "undefined") {
  g.process = {
    env: {},
    nextTick: (callback: () => void) => setTimeout(callback, 0),
    version: "",
    versions: {},
    argv: [],
    platform: "browser",
  };
}

if (typeof g.Buffer === "undefined") {
  g.Buffer = Buffer;
}

export {};
