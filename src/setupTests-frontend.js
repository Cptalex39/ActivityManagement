import { TextEncoder, TextDecoder } from 'node:util';
import { fetch, Headers, Request, Response } from 'undici';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

// Ora importa il server dopo che le API globali sono state configurate
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
