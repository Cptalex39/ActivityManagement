import React from 'react';                                                                                                                                   
                                                                                                                                                             
import { screen } from '@testing-library/react';                                                                                                             
                                                                                                                                                             
import { renderWithProviders } from '../test-utils';                                                                                                         
                                                                                                                                                             
import CheckoutView from '../react_redux/views/ordine_view/CheckoutView';                                                                                    
                                                                                                                                                             
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

beforeEach(() => {
  server.use(
    // Intercettazione per l'ottenimento delle carte del cliente
    http.post('/OTTENIMENTO_CARTE_CLIENTE', async () => {
      return HttpResponse.json({
        items: [], 
        isOK: true
      });
    }),
    // Intercettazione per i dati dell'attività (intervalli orari e numero clienti)
    http.post('/OTTIENI_DATI_ATTIVITA', async () => {
      const mockDati = {
        primo_intervallo: "08:00-12:00",
        secondo_intervallo: "14:00-18:00",
        numero_clienti: 5
      };
      // Risposta come array poiché il codice accede a result[0]
      return HttpResponse.json([mockDati]);
    })
  );
});

describe('Debug Preliminare: CheckoutView', () => {                                                                                                          
                                                                                                                                                             
  test('Rendering base e analisi HTML della vista checkout', () => {                                                                                         
                                                                                                                                                             
    const preloadedState = {                                                                                                                                 
                                                                                                                                                             
      autenticazione: {                                                                                                                                      
                                                                                                                                                             
        value: {                                                                                                                                             
                                                                                                                                                             
          id_utente: 1,                                                                                                                                      
                                                                                                                                                             
          isLogged: true,                                                                                                                                    
                                                                                                                                                             
          indirizzo: "Via Roma 10, Milano"                                                                                                                   
                                                                                                                                                             
        },                                                                                                                                                   
                                                                                                                                                             
      },                                                                                                                                                     
                                                                                                                                                             
      stile: {                                                                                                                                               
                                                                                                                                                             
        value: { vistaForm: 'form' },                                                                                                                        
                                                                                                                                                             
      },                                                                                                                                                     
                                                                                                                                                             
      carrello: {                                                                                                                                            
                                                                                                                                                             
        value: {                                                                                                                                             
                                                                                                                                                             
          items: [                                                                                                                                           
                                                                                                                                                             
            {                                                                                                                                                
                                                                                                                                                             
              id: 101,                                                                                                                                       
                                                                                                                                                             
              nome: "Servizio Test Checkout",                                                                                                                
                                                                                                                                                             
              prezzo: 25.00,                                                                                                                                 
                                                                                                                                                             
              quantita: 2,                                                                                                                                   
                                                                                                                                                             
              tipo: "Servizio"                                                                                                                               
                                                                                                                                                             
            }                                                                                                                                                
                                                                                                                                                             
          ]                                                                                                                                                  
                                                                                                                                                             
        },                                                                                                                                                   
                                                                                                                                                             
      },                                                                                                                                                     
                                                                                                                                                             
      carta: {                                                                                                                                               
                                                                                                                                                             
        value: { carte: [] },                                                                                                                                
                                                                                                                                                             
      },                                                                                                                                                     
                                                                                                                                                             
      servizio: {                                                                                                                                            
                                                                                                                                                             
        value: { servizi: [] },                                                                                                                              
                                                                                                                                                             
      },                                                                                                                                                     
                                                                                                                                                             
    };                                                                                                                                                       
                                                                                                                                                             
    renderWithProviders(<CheckoutView />, { preloadedState });                                                                                               
                                                                                                                                                             
    screen.debug();                                                                                                                                          
                                                                                                                                                             
  });                                                                                                                                                        
                                                                                                                                                             
});
