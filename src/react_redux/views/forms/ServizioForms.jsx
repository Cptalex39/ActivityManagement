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
        this.lingua === "italiano" ? "Tipologia*" : "Type*", 
        this.lingua === "italiano" ? "Prezzo*" : "Price*", 
        this.lingua === "italiano" ? "Note" : "Notes",
      ], 
      type: [null, null, "text", null], 
      step: [null, null, null, null], 
      min: [null, null, null, null], 
      name: ["nome", "tipologia_servizio", "prezzo", "note"], 
      id: ["nuovo_nome_servizio", "nuovo_tipologia_servizio", "nuovo_prezzo_servizio", "nuove_note_servizio"], 
      value: [item.nome, item.tipologia_servizio, item.prezzo, item.note], 
      placeholder: [
        this.lingua === "italiano" ? "Nome*" : "Name*", 
        this.lingua === "italiano" ? "Prodotto o Servizio" : "Product or Service", 
        this.lingua === "italiano" ? "Prezzo*" : "Price*", 
        this.lingua === "italiano" ? "Note" : "Notes",
      ], 
      errore: [item.errore_nome, item.errore_tipologia_servizio, item.errore_prezzo, item.errore_note], 
      options: [null, null, null, null],
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
        this.lingua === "italiano" ? "Tipologia" : "Type",
        this.lingua === "italiano" ? "Prezzo min" : "Min price", 
        this.lingua === "italiano" ? "Prezzo max" : "Max price", 
        this.lingua === "italiano" ? "Note" : "Notes", 
        this.lingua === "italiano" ? "In uso" : "In use", 
      ], 
      type: [null, null, "text", "text", null, "text"], 
      step: [null, null, null, null, null, null], 
      min: [null, null, null, null, null, null], 
      name: ["nome", "tipologia_servizio", "prezzo_min", "prezzo_max", "note", "in_uso"], 
      id: ["ricerca_nome_servizio", "ricerca_tipologia_servizio", "ricerca_prezzo_min_servizio", "ricerca_prezzo_max_servizio", "ricerca_note_servizio", "ricerca_in_uso_servizio"], 
      value: [item.nome, item.tipologia_servizio, item.prezzo_min, item.prezzo_max, item.note, item.in_uso], 
      placeholder: [
        this.lingua === "italiano" ? "Nome" : "Name", 
        this.lingua === "italiano" ? "Tipologia" : "Type",
        this.lingua === "italiano" ? "Prezzo min" : "Min price", 
        this.lingua === "italiano" ? "Prezzo max" : "Max price", 
        this.lingua === "italiano" ? "Note" : "Notes", 
        this.lingua === "italiano" ? "In uso" : "In use", 
      ], 
      options: [null, null, null, null, null, null],
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
      errore_tipologia_servizio: "", 
      errore_prezzo: "", 
      errore_note: "", 
      errore_in_uso: ""
    }); 
  
    useEffect(() => {
      controlloServizio(item, setErrori, lingua);
    }, [item, lingua]);
  
    return {
      header: lingua === "italiano" ? "Servizio" : "Service", 
      label: [null, null, null, null, null], 
      tipoSelezione: item.tipo_selezione,  
      type: [null, null, "text", null, "text"], 
      step: [null, null, null, null, null], 
      min: [null, null, null, null, null], 
      name: ["nome", "tipologia_servizio", "prezzo", "note", "in_uso"], 
      id: ["nome_servizio", "tipologia_servizio_esistente", "prezzo_servizio", "note_servizio", "in_uso_servizio"], 
      value: [
        item.nome, 
        item.tipologia_servizio, 
        item.prezzo ? parseFloat(item.prezzo).toFixed(2) + " €" : "0.00 €", 
        item.note, 
        item.in_uso
      ], 
      placeholder: [
        lingua === "italiano" ? "Nome" : "Name", 
        lingua === "italiano" ? "Tipologia" : "Type",
        lingua === "italiano" ? "Prezzo" : "Price", 
        lingua === "italiano" ? "Note" : "Notes", 
        lingua === "italiano" ? "In uso" : "In use", 
      ], 
      errore: [errori.errore_nome, errori.errore_tipologia_servizio, errori.errore_prezzo, errori.errore_note, errori.errore_in_uso], 
      valoreModificabile: [true, true, true, true, true], 
      options: [null, null, null, null, null], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  }
}