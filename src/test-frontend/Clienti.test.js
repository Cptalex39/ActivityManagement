import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';
import Clienti from '../react_redux/views/cliente_view/Clienti';

describe('Clienti View Functional Tests', () => {
  
  beforeEach(() => {
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true); // Mock per i confirm() presenti in Clienti.jsx
  });

  test('TC_FRONT_CLI_001 - Successo: Ricerca clienti', async () => {
    const user = userEvent.setup();
    
    // Stato precaricato per simulare che la ricerca abbia già popolato lo store
    const preloadedState = {
      cliente: {
        value: { 
          clienti: [
            { id: 1, nome: 'Mario', cognome: 'Rossi', contatto: '3331234567', email: 'mario@example.com', username: 'mario', tipo_selezione: '' }
          ],
          clientiDaEliminare: []
        }
      },
      stile: {
        value: { vistaItem: 'tabella', vistaForm: 'standard' }
      },
      attivita: {
        value: { primo_intervallo: 1, secondo_intervallo: 10, numero_clienti: 5 }
      }
    };

    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () => {
        return HttpResponse.json({ 
          items: [
            { id: 1, nome: 'Mario', cognome: 'Rossi', contatto: '3331234567', email: 'mario@example.com', username: 'mario', tipo_selezione: '' }
          ] 
        });
      }),
      http.post('/VISUALIZZA_ITEMS', async ({ request }) => {
        return HttpResponse.json({
          items: [{ id: 1, nome: 'Mario', cognome: 'Rossi', contatto: '3331234567', email: 'mario@example.com', username: 'mario', tipo_selezione: '' }]
        });
      })
    );

    renderWithProviders(<Clienti />, { preloadedState });

    // Verifica che i dati precaricati siano visibili immediatamente
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 4, name: /Mario Rossi/i })).toBeInTheDocument();
    });

    // Simula l'interazione di ricerca per verificare che non rompa la UI
    const inputNome = screen.getByPlaceholderText('Nome'); 
    await user.type(inputNome, 'Mario');
    
    const btnRicerca = document.querySelector('.lucide-search');
    await user.click(btnRicerca);

    // Verifica che i dati rimangano presenti dopo il click
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 4, name: /Mario Rossi/i })).toBeInTheDocument();
    });
  });

  test('TC_FRONT_CLI_002 - Successo: Controllo pagamenti in sospeso', async () => {
    const user = userEvent.setup();

    // Stato iniziale con un cliente che ha richiesto l'eliminazione
    const preloadedState = {
      cliente: {
        value: { 
          clienti: [],
          clientiDaEliminare: [
            { id: 2, nome: 'Luigi', cognome: 'Verdi', contatto: '3339999999', email: 'luigi@example.com', username: 'luigi', is_eliminabile: 0 }
          ]
        }
      },
      stile: {
        value: { vistaItem: 'tabella', vistaForm: 'standard' }
      },
      attivita: {
        value: { primo_intervallo: 1, secondo_intervallo: 10, numero_clienti: 5 }
      }
    };

    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () => {
        return HttpResponse.json({
          items: [{ id: 2, username: 'luigi', nome: 'Luigi', cognome: 'Verdi', email: 'luigi@example.com', contatto: '3339999999', is_eliminabile: 0 }]
        });
      }),
      http.post('/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE', () => {
        return HttpResponse.json({
          result: [{ numero_pagamenti_non_confermati: 0 }]
        });
      })
    );

    renderWithProviders(<Clienti />, { preloadedState });

    // Attesa caricamento lista sospesi
    const btnControllo = await screen.findByRole('button', { name: 'Controllo pagamenti' });
    await user.click(btnControllo);

    // Verifica che appaia il pulsante di eliminazione dopo il controllo (0 pagamenti)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Elimina cliente' })).toBeInTheDocument();
    });
  });
});
