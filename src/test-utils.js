import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

// Importazione di tutti i reducer rilevati nello store.js
import { autenticazioneReducer } from './react_redux/store/reducers/AutenticazioneReducer';
import { stileReducer } from './react_redux/store/reducers/StileReducer';
import { attivitaReducer } from './react_redux/store/reducers/AttivitaReducer';
import { clienteReducer } from './react_redux/store/reducers/ClienteReducer';
import { servizioReducer } from './react_redux/store/reducers/ServizioReducer';
import { spesaReducer } from './react_redux/store/reducers/SpesaReducer';
import { carrelloReducer } from './react_redux/store/reducers/CarrelloReducer';
import { cartaReducer } from './react_redux/store/reducers/CartaReducer';
import { ordineReducer } from './react_redux/store/reducers/OrdineReducer';

/**
 * Helper per renderizzare componenti che dipendono da Redux e React Router.
 * Permette di simulare stati specifici (es. ruoli utente) tramite preloadedState.
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    // Creiamo un'istanza dello store specifica per ogni test per evitare inquinamento tra i test
    const store = configureStore({
      reducer: {
        autenticazione: autenticazioneReducer,
        stile: stileReducer,
        attivita: attivitaReducer,
        cliente: clienteReducer,
        servizio: servizioReducer,
        spesa: spesaReducer,
        carrello: carrelloReducer,
        carta: cartaReducer,
        ordine: ordineReducer,
      },
      preloadedState,
    });

    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
