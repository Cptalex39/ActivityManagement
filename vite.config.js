import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Autenticazione
      '/LOGIN': 'http://localhost:3000',
      '/MODIFICA_PROFILO': 'http://localhost:3000',
      '/LOGOUT': 'http://localhost:3000',

      // Items
      '/INSERISCI_ITEM': 'http://localhost:3000', 
      '/VISUALIZZA_ITEMS': 'http://localhost:3000', 
      '/VISUALIZZA_ENTRATE_ITEMS': 'http://localhost:3000', 
      '/VISUALIZZA_USCITE_ITEMS': 'http://localhost:3000', 
      '/OTTIENI_TUTTI_GLI_ITEMS': 'http://localhost:3000', 
      '/ELIMINA_ITEMS': 'http://localhost:3000', 
      '/ELIMINA_ITEMS_RANGE_GIORNI': 'http://localhost:3000', 
      '/MODIFICA_ITEM': 'http://localhost:3000', 
      '/VISUALIZZA_CATALOGO': 'http://localhost:3000',
      '/INSERISCI_ORDINE': 'http://localhost:3000',
    }
  }
});









