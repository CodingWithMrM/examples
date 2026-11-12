// one channel object per tab, shared by the sender and the listener
export const channel = typeof BroadcastChannel === "undefined" ? { postMessage() {}, addEventListener() {}, removeEventListener() {} } : new BroadcastChannel("query-sync");
