import { setupServer } from 'msw/node';

// Il server viene inizializzato senza handler iniziali, 
// che verranno definiti dinamicamente nei singoli test case.
export const server = setupServer();
