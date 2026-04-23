// React e Redux
import React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
// Views
import OptionsTipoServizio, { OptionsTipoServizioRicerca } from '../options/OptionsTipoServizio';
// Utils
import { controlloServizio } from "../../../utils/Controlli";

export class ServizioForms {
  attivitaState = useSelector((state) => state.attivita.value);
  lingua = this.attivitaState.lingua;

  constructor() {

  }

  getCampiNuovoServizio(item, handleOnChange, handleOnClick, handleOnBlur, setItem) {
    // CR: Elemento React per il select del tipo
    const optionsTipo = React.createElement(OptionsTipoServizio, { 
      item, setItem, name: "tipo", id: "nuovo_tipo_servizio", readOnly: false, tipoSelezione: 0 
    });

    return {
      header: this.lingua === "italiano" ? "Nuovo servizio / prodotto" : "New service / product", 
      label: [
        this.lingua === "italiano" ? "Nome*" : "Name*", 
        this.lingua === "italiano" ? "Prezzo*" : "Price*", 
        this.lingua === "italiano" ? "Tipo*" : "Type*",
        this.lingua === "italiano" ? "Note" : "Notes",
      ], 
      type: [null, "text", null, null], 
      step: [null, null, null, null], 
      min: [null, null, null, null], 
      name: ["nome", "prezzo", "tipo", "note"], 
      id: ["nuovo_nome_servizio", "nuovo_prezzo_servizio", "nuovo_tipo_servizio", "nuove_note_servizio"], 
      value: [item.nome, item.prezzo, item.tipo, item.note], 
      placeholder: [
        this.lingua === "italiano" ? "Nome*" : "Name*", 
        this.lingua === "italiano" ? "Prezzo*" : "Price*", 
        this.lingua === "italiano" ? "Tipo*" : "Type*",
        this.lingua === "italiano" ? "Note" : "Notes",
      ], 
      errore: [item.errore_nome, item.errore_prezzo, item.errore_tipo || "", item.errore_note], 
      options: [null, null, optionsTipo, null],
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };

  getCampiRicercaServizi(item, handleOnChange, handleOnClick, handleOnBlur, setItem) {
    // CR: Elemento React per il select del tipo nella ricerca (con opzione "Tutti")
    const optionsTipoRicerca = React.createElement(OptionsTipoServizioRicerca, { 
      item, setItem, name: "tipo", id: "ricerca_tipo_servizio" 
    });

    return {
      header: this.lingua === "italiano" ? "Ricerca servizi / prodotti" : "Services / products research", 
      label: [
        this.lingua === "italiano" ? "Nome" : "Name", 
        this.lingua === "italiano" ? "Prezzo minimo" : "Minimum price", 
        this.lingua === "italiano" ? "Prezzo massimo" : "Maximum price", 
        this.lingua === "italiano" ? "Tipo" : "Type",
        this.lingua === "italiano" ? "Note" : "Notes", 
        this.lingua === "italiano" ? "In uso" : "In use", 
      ], 
      type: [null, "text", "text", null, null, "text"], 
      step: [null, null, null, null, null, null], 
      min: [null, null, null, null, null, null], 
      name: ["nome", "prezzo_min", "prezzo_max", "tipo", "note", "in_uso"], 
      id: ["ricerca_nome_servizio", "ricerca_prezzo_min_servizio", "ricerca_prezzo_max_servizio", "ricerca_tipo_servizio", "ricerca_note_servizio", "ricerca_in_uso_servizio"], 
      value: [item.nome, item.prezzo_min, item.prezzo_max, item.tipo, item.note, item.in_uso], 
      placeholder: [
        this.lingua === "italiano" ? "Nome" : "Name", 
        this.lingua === "italiano" ? "Prezzo minimo" : "Minimum price", 
        this.lingua === "italiano" ? "Prezzo massimo" : "Maximum price", 
        this.lingua === "italiano" ? "Tipo" : "Type",
        this.lingua === "italiano" ? "Note" : "Notes", 
        this.lingua === "italiano" ? "In uso" : "In use", 
      ], 
      options: [null, null, null, optionsTipoRicerca, null, null],
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };

  getCampiServizioEsistente(item, handleOnChange, handleOnClick, handleOnBlur) {
    const attivitaState = useSelector((state) => state.attivita.value);
    const lingua = attivitaState.lingua;

    // CR: Elemento React per il select del tipo nell'item esistente
    const optionsTipo = React.createElement(OptionsTipoServizio, { 
      item, setItem: null, name: "tipo", id: "tipo_servizio_" + item.id, 
      readOnly: item.tipo_selezione !== 1, tipoSelezione: item.tipo_selezione 
    });

    const [errori, setErrori] = useState({
      errore_nome: "", 
      errore_prezzo: "", 
      errore_tipo: "",
      errore_note: "", 
      errore_in_uso: ""
    }); 
  
    useEffect(() => {
      controlloServizio(item, setErrori, lingua);
    }, [item]);
  
    return {
      header: lingua === "italiano" ? "Servizio / Prodotto" : "Service / Product", 
      label: [null, null, null, null, null], 
      tipoSelezione: item.tipo_selezione,  
      type: [null, "text", null, null, "text"], 
      step: [null, null, null, null, null], 
      min: [null, null, null, null, null], 
      name: ["nome", "prezzo", "tipo", "note", "in_uso"], 
      id: ["nome_servizio", "prezzo_servizio", "tipo_servizio", "note_servizio", "in_uso_servizio"], 
      value: [item.nome, parseFloat(item.prezzo).toFixed(2) + " €", item.tipo || "servizio", item.note, item.in_uso], 
      placeholder: [
        lingua === "italiano" ? "Nome" : "Name", 
        lingua === "italiano" ? "Prezzo" : "Price", 
        lingua === "italiano" ? "Tipo" : "Type",
        lingua === "italiano" ? "Note" : "Notes",
        lingua === "italiano" ? "In uso" : "In use", 
      ], 
      errore: [errori.errore_nome, errori.errore_prezzo, errori.errore_tipo || "", errori.errore_note, errori.errore_in_uso], 
      valoreModificabile: [true, true, true, true, true], 
      options: [null, null, optionsTipo, null, null], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };
}