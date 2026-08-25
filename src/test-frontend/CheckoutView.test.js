import React from 'react';                                                                                                                                   
                                                                                                                                                             
import { screen } from '@testing-library/react';                                                                                                             
                                                                                                                                                             
import { renderWithProviders } from '../test-utils';                                                                                                         
                                                                                                                                                             
import CheckoutView from '../react_redux/views/ordine_view/CheckoutView';                                                                                    
                                                                                                                                                             
                                                                                                                                                             
                                                                                                                                                             
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