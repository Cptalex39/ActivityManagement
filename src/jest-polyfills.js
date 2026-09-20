const { TextEncoder, TextDecoder } = require('node:util');

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Utilizziamo le API native di Node.js (disponibili in Node 18+)
// senza dipendenze esterne.
if (typeof globalThis.fetch !== 'undefined') {
  globalThis.Request = globalThis.Request || globalThis.fetch.Request;
  globalThis.Response = globalThis.Response || globalThis.fetch.Response;
  globalThis.Headers = globalThis.Headers || globalThis.fetch.Headers;
}
