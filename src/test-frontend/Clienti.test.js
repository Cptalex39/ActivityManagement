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
    
    // Mock per l'inizializzazione (ottieniClientiDaEliminare)
    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () => {
        return HttpResponse.json({ items: [] });
      }),
      // Mock per la ricerca clienti
      http.post('/VISUALIZZA_ITEMS', async ({ request }) => {
        const body = await request.json();
        if (body.tipo_item === 'cliente') {
          return HttpResponse.json({
            items: [
              { 
                id: 1, 
                nome: 'Mario', 
                cognome: 'Rossi', 
                email: 'mario@example.com', 
                contatto: '123456789' 
              }
            ]
          });
        }
        return HttpResponse.json({ items: [] });
      })
    );

    renderWithProviders(<Clienti />);

    // Assumendo che il campo di ricerca abbia un placeholder specifico o sia identificabile per ruolo
    // Nota: i campi sono generati da clienteForms.getCampiRicercaClienti
    const inputNome = screen.getByPlaceholderText('Nome'); 
    await user.type(inputNome, 'Mario');
    
    const btnRicerca = document.querySelector('.lucide-search');
    await user.click(btnRicerca);

    await waitFor(() => {
      // Utilizziamo una regex per trovare il testo indipendentemente da come è concatenato
      expect(screen.getByText(/Mario/i)).toBeInTheDocument();
      expect(screen.getByText(/Rossi/i)).toBeInTheDocument();
    });
  });

  test('TC_FRONT_CLI_002 - Successo: Controllo pagamenti in sospeso', async () => {
    const user = userEvent.setup();

    // Stato iniziale con un cliente che ha richiesto l'eliminazione
    const preloadedState = {
      cliente: {
        value: { clienti: [] }
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
          items: [{ id: 10, username: 'mario_r', nome: 'Mario', cognome: 'Rossi', email: 'mario@example.com', contatto: '123456789', is_eliminabile: 0 }]
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
