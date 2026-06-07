// React e Redux
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
// Utils
import { controlloSpesa } from "../../../utils/Controlli";

export class SpesaForms {
  attivitaState = useSelector((state) => state.attivita.value);
  
  constructor() {

  }

  getCampiNuovaSpesa(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: "Nuova spesa",  
      label: ["Nome*", "Descrizione", "Totale*", "Giorno*", "Note"],  
      type: [null, null, "number", "date", null], 
      step: [null, null, null, null, null], 
      min: [null, null, null, null, null], 
      name: ["nome", "descrizione", "totale", "giorno", "note"], 
      id: ["nuovo_nome_spesa", "nuova_descrizione_spesa", "nuovo_totale_spesa", "nuovo_giorno_spesa", "nuove_note_spesa"], 
      value: [item.nome, item.descrizione, item.totale, item.giorno, item.note], 
      placeholder: ["Nome*", "Descrizione", "Totale*", "Giorno*", "Note"], 
      errore: [item.errore_nome, item.errore_descrizione, item.errore_totale, item.errore_giorno, item.errore_note], 
      options: [null, null, null, null, null],
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };

  getCampiRicercaSpese(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: "Ricerca spese", 
      label: ["Nome", "Descrizione", "Totale minimo", "Totale massimo", "Primo giorno", "Ultimo giorno", "Note"], 
      type: [null, null, "number", "number", "date", "date", null], 
      step: [null, null, null, null, null, null, null], 
      min: [null, null, null, null, null, null, null], 
      name: ["nome", "descrizione", "totale_min", "totale_max", "primo_giorno", "ultimo_giorno", "note"], 
      id: ["ricerca_nome_spesa", "ricerca_descrizione_spesa", "ricerca_totale_min_spesa", "ricerca_totale_max_spesa", "ricerca_primo_giorno_spesa", "ricerca_ultimo_giorno_spesa", "ricerca_note_spesa"], 
      value: [item.nome, item.descrizione, item.totale_min, item.totale_max, item.primo_giorno, item.ultimo_giorno, item.note], 
      placeholder: ["Nome", "Descrizione", "Totale minimo", "Totale massimo", "Primo giorno", "Ultimo giorno", "Note"], 
      errore: [item.errore_nome, item.errore_descrizione, null, item.errore_totali, null, item.errore_giorni, item.errore_note], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };

  getCampiSpesaEsistente(item, handleOnChange, handleOnClick, handleOnBlur) {
    const attivitaState = useSelector((state) => state.attivita.value);
    
    const [errori, setErrori] = useState({
      errore_nome: "", 
      errore_descrizione: "", 
      errore_totale: "", 
      errore_giorno: "", 
      errore_note: ""
    }); 
    
    useEffect(() => {
      const risultatoControllo = controlloSpesa(item);
      setErrori(prevState => ({
        ...prevState, 
        errore_nome: risultatoControllo.errore_nome, 
        errore_descrizione: risultatoControllo.errore_descrizione, 
        errore_totale: risultatoControllo.errore_totale, 
        errore_giorno: risultatoControllo.errore_giorno, 
        errore_note: risultatoControllo.errore_note
      }))
    }, [item]);
  
    return {
      header: "Spesa", 
      label: [null, null, null, null, null], 
      tipoSelezione: item.tipo_selezione,  
      type: [null, null, "number", "date", null], 
      step: [null, null, "0.50", null, null], 
      min: [null, null, "0.50", null, null], 
      name: ["nome", "descrizione", "totale", "giorno", "note"], 
      id: ["nome_spesa", "descrizione_spesa", "totale_spesa", "giorno_spesa", "note_spesa"], 
      value: [item.nome, item.descrizione, parseFloat(item.totale).toFixed(2), item.giorno, item.note], 
      placeholder: ["Nome*", "Descrizione", "Totale*", "Giorno*", "Note"], 
      errore: [errori.errore_nome, errori.errore_descrizione, errori.errore_totale, errori.errore_giorno, errori.errore_note], 
      valoreModificabile: [false, true, true, true, true], 
      options: [null, null, null, null, null], 
      onChange: handleOnChange,  
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };

  getCampiFile(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: "File spese", 
      label: ["Primo giorno", "Ultimo giorno"], 
      type: ["date", "date"], 
      step: [null, null], 
      min: [null, null], 
      name: ["primo_giorno", "ultimo_giorno"], 
      id: ["file_primo_giorno_spesa", "file_ultimo_giorno_spesa"], 
      value: [item.primo_giorno, item.ultimo_giorno], 
      placeholder: ["Primo giorno", "Ultimo giorno"], 
      errore: [null, item.errore_giorni], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };
}









