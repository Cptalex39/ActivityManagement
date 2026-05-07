import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { controlloServizio } from "../../../utils/Controlli";
// servizio form
export class ServizioForms {
  attivitaState = useSelector((state) => state.attivita.value);
  lingua = this.attivitaState.lingua;

  getCampiNuovoServizio(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: this.lingua === "italiano" ? "Nuovo servizio" : "New service",
      label: [
        this.lingua === "italiano" ? "Nome*" : "Name*",
        this.lingua === "italiano" ? "Tipo*" : "Type*",
        this.lingua === "italiano" ? "Prezzo*" : "Price*",
        this.lingua === "italiano" ? "Descrizione" : "Description",
        this.lingua === "italiano" ? "Note" : "Notes",
      ],
      type: [null, null, "text", null, null],
      step: [null, null, null, null, null],
      min: [null, null, null, null, null],
      name: ["nome", "tipo", "prezzo", "descrizione", "note"],
      id: ["nuovo_nome_servizio", "nuovo_tipo", "nuovo_prezzo_servizio", "nuova_descrizione_servizio", "nuove_note_servizio"],
      value: [item.nome, item.tipo, item.prezzo, item.descrizione, item.note],
      placeholder: [
        this.lingua === "italiano" ? "Nome*" : "Name*",
        this.lingua === "italiano" ? "Prodotto o Servizio" : "Product or Service",
        this.lingua === "italiano" ? "Prezzo*" : "Price*",
        this.lingua === "italiano" ? "Descrizione" : "Description",
        this.lingua === "italiano" ? "Note" : "Notes",
      ],
      errore: [item.errore_nome, item.errore_tipo, item.errore_prezzo, item.errore_descrizione, item.errore_note],
      options: [null, null, null, null, null],
      onChange: handleOnChange,
      onClick: handleOnClick,
      onBlur: handleOnBlur
    };
  }

  getCampiRicercaServizi(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: this.lingua === "italiano" ? "Ricerca servizi" : "Services research", 
      label: [
        this.lingua === "italiano" ? "Nome" : "Name", 
        this.lingua === "italiano" ? "Tipo" : "Type",
        this.lingua === "italiano" ? "Prezzo min" : "Min price", 
        this.lingua === "italiano" ? "Prezzo max" : "Max price", 
        this.lingua === "italiano" ? "In uso" : "In use", 
      ], 
      type: [null, null, "text", "text", "text"], 
      step: [null, null, null, null, null], 
      min: [null, null, null, null, null], 
      name: ["nome", "tipo", "prezzo_min", "prezzo_max", "in_uso"], 
      id: ["ricerca_nome_servizio", "ricerca_tipo_servizio", "ricerca_prezzo_min_servizio", "ricerca_prezzo_max_servizio", "ricerca_in_uso_servizio"], 
      value: [item.nome, item.tipo, item.prezzo_min, item.prezzo_max, item.in_uso], 
      placeholder: [
        this.lingua === "italiano" ? "Nome" : "Name", 
        this.lingua === "italiano" ? "Tipo" : "Type",
        this.lingua === "italiano" ? "Prezzo min" : "Min price", 
        this.lingua === "italiano" ? "Prezzo max" : "Max price", 
        this.lingua === "italiano" ? "In uso" : "In use", 
      ], 
      options: [null, null, null, null, null],
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  }

  getCampiServizioEsistente(item, handleOnChange, handleOnClick, handleOnBlur) {
    const attivitaState = useSelector((state) => state.attivita.value);
    const lingua = attivitaState.lingua;
    const [errori, setErrori] = useState({
      errore_nome: "", 
      errore_tipo: "", 
      errore_prezzo: "", 
      errore_note: "", 
      errore_in_uso: ""
    }); 
  
    useEffect(() => {
      controlloServizio(item, setErrori, lingua);
    }, [item, lingua]);
  
    return {
      header: lingua === "italiano" ? "Servizio" : "Service", 
      label: [null, null, null, null, null, null], 
      tipoSelezione: item.tipo_selezione,  
      type: [null, null, "text", null, null, "text"], 
      step: [null, null, null, null, null, null], 
      min: [null, null, null, null, null, null], 
      name: ["nome", "tipo", "prezzo", "descrizione", "note", "in_uso"], 
      id: ["nome_servizio", "tipo_esistente", "prezzo_servizio", "descrizione_servizio", "note_servizio", "in_uso_servizio"], 
      value: [
        item.nome, 
        item.tipo, 
        item.prezzo ? parseFloat(item.prezzo).toFixed(2) + " €" : "0.00 €", 
        item.descrizione, 
        item.note, 
        item.in_uso
      ], 
      placeholder: [
        lingua === "italiano" ? "Nome" : "Name", 
        lingua === "italiano" ? "Tipo" : "Type",
        lingua === "italiano" ? "Prezzo" : "Price", 
        lingua === "italiano" ? "Descrizione" : "Description", 
        lingua === "italiano" ? "Note" : "Notes", 
        lingua === "italiano" ? "In uso" : "In use", 
      ], 
      errore: [errori.errore_nome, errori.errore_tipo, errori.errore_prezzo, errori.errore_descrizione, errori.errore_note, errori.errore_in_uso], 
      valoreModificabile: [true, true, true, true, true, true], 
      options: [null, null, null, null, null, null], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  }
}