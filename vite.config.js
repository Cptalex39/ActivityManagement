import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Autenticazione
      '/LOGIN': 'http://localhost:3000',
      '/MODIFICA_PROFILO_UTENTE': 'http://localhost:3000',
      '/LOGOUT': 'http://localhost:3000',

      // Items
      '/INSERISCI_ITEM': 'http://localhost:3000', 
      '/VISUALIZZA_ITEMS': 'http://localhost:3000', 
      '/OTTIENI_TUTTI_GLI_ITEMS': 'http://localhost:3000', 
      '/ELIMINA_ITEM': 'http://localhost:3000', 
      '/ELIMINA_ITEMS': 'http://localhost:3000', 
      '/ELIMINA_ITEMS_RANGE_GIORNI': 'http://localhost:3000', 
      '/MODIFICA_ITEM': 'http://localhost:3000', 
      '/VISUALIZZA_CATALOGO': 'http://localhost:3000',
      '/INSERISCI_ORDINE': 'http://localhost:3000',

      // Vario
      '/RICHIESTA_ELIMINAZIONE': 'http://localhost:3000',
      '/OTTIENI_CLIENTI_DA_ELIMINARE': 'http://localhost:3000',
      '/COLLEGAMENTO_CARTA_CLIENTE': 'http://localhost:3000',
      '/OTTENIMENTO_CARTE_CLIENTE': 'http://localhost:3000',
      '/ELIMINA_CARTA': 'http://localhost:3000', 
      '/OTTIENI_PAGAMENTI_DA_CONFERMARE': 'http://localhost:3000', 
      '/OTTIENI_ORDINI_ULTIME_48_ORE': 'http://localhost:3000', 
      '/ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE': 'http://localhost:3000', 
      '/CONFERMA_PAGAMENTO': 'http://localhost:3000', 
      '/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE': 'http://localhost:3000', 
      '/MODIFICA_PROFILO_CLIENTE': 'http://localhost:3000', 
      '/OTTIENI_PASSWORD': 'http://localhost:3000', 
      '/OTTIENI_PASSWORD_UTENTE': 'http://localhost:3000', 
      '/ESEGUI_ANALISI': 'http://localhost:3000', 
      '/OTTIENI_ENTRATE_ORDINI': 'http://localhost:3000', 
      '/RIATTIVA_CLIENTE': 'http://localhost:3000', 
      '/OTTIENI_NUMERO_ORDINI_DATA_PER_ORARIO': 'http://localhost:3000', 
      '/OTTIENI_DATI_ATTIVITA': 'http://localhost:3000', 
    }
  }
});









