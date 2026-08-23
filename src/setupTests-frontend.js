import { TextEncoder, TextDecoder } from 'node:util';

// Iniezione globale nativa prima di caricare MSW
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

const nativeFetch = globalThis.fetch;
if (nativeFetch) {
  globalThis.Request = globalThis.Request || Request;
  globalThis.Response = globalThis.Response || Response;
  globalThis.Headers = globalThis.Headers || Headers;
}

// Utilizziamo require invece di import per evitare l'hoisting.
// Questo assicura che le classi globali sopra definite siano presenti quando MSW viene caricato.
const { server } = require('./mocks/server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
