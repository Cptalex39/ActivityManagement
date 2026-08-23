import { TextEncoder, TextDecoder } from 'node:util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Se fetch/Request/Response non sono definiti in questo JSDOM, li mappiamo o li gestiamo in sicurezza
if (typeof global.fetch === 'undefined') {
  global.fetch = globalThis.fetch;
  global.Request = globalThis.Request;
  global.Response = globalThis.Response;
  global.Headers = globalThis.Headers;
}

// Utilizziamo require per evitare l'hoisting dell'import e assicurarci che i polyfill siano attivi
const { server } = require('./mocks/server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
