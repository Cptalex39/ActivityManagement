// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { pagamentoSliceActions } from '../store/reducers/PagamentoReducer';
// Actions
import { Actions } from "./Actions";

export class PagamentoActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  async inserimentoPagamento(nuovoPagamento, setNuovoPagamento) {
    const response = await super.getResponse("/INSERISCI_ITEM", nuovoPagamento);

    if(response.ok) {
      const result = await response.json();

      let nuovoPagamentoAggiornato = {
        ...nuovoPagamento, 
        id: result.id, 
      };
      
      setNuovoPagamento(nuovoPagamentoAggiornato);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

  async ricercaPagamenti(datiRicerca) {
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      this.dispatch(pagamentoSliceActions.aggiornaPagamenti({
        pagamenti: result.items, 
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async eliminazionePagamenti(selectedIdsEliminazione, setSelectedIdsEliminazione, pagamenti) {
    const dati = {
      tipo_item: "pagamento", 
      ids: selectedIdsEliminazione
    }
    
    const itemsRestanti = (pagamenti && pagamenti !== -1) ? pagamenti.filter(pagamento => !dati.ids.includes(pagamento.id)) : -1;
    const response = await super.getResponse("/ELIMINA_ITEMS", dati);

    if(response.ok) {
      this.dispatch(pagamentoSliceActions.aggiornaPagamenti({
        pagamenti: itemsRestanti, 
      }));
      setSelectedIdsEliminazione([]);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async modificaPagamenti(pagamenti, selectedIdsModifica, setSelectedIdsModifica) {
    let pagamentiDaModificare = pagamenti.filter(pagamento => selectedIdsModifica.includes(pagamento.id)); 
    let idPagamentiNonModificati = [];
    let idPagamentiModificati = [];
    let esitiModifiche = [];
        
    for(let i = 0; i < pagamentiDaModificare.length; i++) {
      const dati = {
        tipo_item: "pagamento", 
        item: pagamentiDaModificare[i] 
      }

      const response = await super.getResponse("/MODIFICA_ITEM", dati);

      if(response.ok) {
        esitiModifiche[i] = [true, response.status];
        idPagamentiModificati.push(pagamentiDaModificare[i].id);
      }
      else {
        esitiModifiche[i] = [false, response.status];
        idPagamentiNonModificati.push(pagamentiDaModificare[i].id);
      }
    }
    
    let pagamentiAggiornati = [];

    for (let i = 0; i < pagamenti.length; i++) {
      let pagamentoAggiornato = { ...pagamenti[i] };
      if(pagamentoAggiornato.tipo_selezione === 1) {
        pagamentoAggiornato.tipo_selezione = 0;
      }
      pagamentiAggiornati.push(pagamentoAggiornato);
    }
    
    this.dispatch(pagamentoSliceActions.aggiornaPagamenti({
      pagamenti: pagamentiAggiornati, 
    }))

    for(let id of idPagamentiNonModificati) {
      this.dispatch(pagamentoSliceActions.getPagamentoPrimaDellaModifica({
        id_pagamento: id
      }))
    }

    for(let id of idPagamentiModificati) {
      this.dispatch(pagamentoSliceActions.getPagamentoDopoLaModifica({
        id_pagamento: id
      }))
    }
    
    setSelectedIdsModifica([]);

    return {
      esitiModifiche: esitiModifiche, 
    };
  }

  async handleSearchPagamenti(setPagamenti, datiRicerca) {
    const dati = {
      tipo_item: "pagamento", 
      primo_anno: datiRicerca.primo_anno, 
      ultimo_anno: datiRicerca.ultimo_anno
    };
    
    const response = await super.getResponse("/VISUALIZZA_PAGAMENTI", dati);

    if(response.ok) {
      const result = await response.json();
      setPagamenti(result.items);
    }
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

  async ricercaPagamentiInsospeso() {
    let datiRicerca = {
      tipo_item: "pagamento", 
      stato: "IN_SOSPESO",
    };

    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      this.dispatch(pagamentoSliceActions.aggiornaPagamenti({
        pagamenti: result.items, 
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async confermaPagamentoInSospeso(idPagamento) {
    const dati = {
      id: idPagamento
    }

    const response = await super.getResponse("/CONFERMA_PAGAMENTO", dati);

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
}









