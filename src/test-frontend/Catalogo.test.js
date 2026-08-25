import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import CatalogoServiziView from '../react_redux/views/ordine_view/CatalogoServiziView';

describe('Test Preliminare: CatalogoServiziView', () => {
  test('Rendering base e debug della vista catalogo', () => {
    const preloadedState = {
      servizio: {
        value: {
          servizi: [
            { 
              id: 1, 
              nome: "Servizio Test", 
              descrizione: "Descrizione di prova", 
              prezzo: 10.00, 
              tipo: "Servizio", 
              note: "Nota test" 
            }
          ]
        }
      },
      autenticazione: {
        value: { id_utente: 1 }
      },
      stile: {
        value: { vistaForm: "form" }
      }
    };

    renderWithProviders(<CatalogoServiziView />, { preloadedState });
    
    screen.debug();
  });
});
