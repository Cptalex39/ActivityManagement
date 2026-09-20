import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// Utils
import { formatoDate } from './Tempo';

export const getDettagliPrenotazione = (data_prenotazione, ora_prenotazione) => {
  const data = new Date(data_prenotazione);
  return ("00"+data.getDate()).slice(-2)+"/"+("00"+(data.getMonth()+1)).slice(-2)+"/"+data.getFullYear()+(ora_prenotazione ? " " + ora_prenotazione : ""); 
};

export const getDettagliPrenotazionePDF = (data_prenotazione, ora_prenotazione) => {
  const dettagliPrenotazione = getDettagliPrenotazione(data_prenotazione, ora_prenotazione);
  return `- Data prenotazione: ${dettagliPrenotazione}`; 
};

export const getDettagliSpedizione = (indirizzo, numero_carta) => {
  return "- Indirizzo: " + indirizzo + ".\n- Numero carta: **** **** **** " + numero_carta;
};

export const getDettagliCorriere = (indirizzo) => {
  return "- Indirizzo: " + indirizzo + ".";
};

export const getDettagliOrdine = (items) => {
  let dettagliOrdine = ``;

  for (let i = 0; i < items.length; i++) {
    dettagliOrdine += `- ${items[i].nome} (${items[i].tipo}): ${(items[i].prezzo).toFixed(2)} (x${items[i].quantita}) --> totale: ${(items[i].prezzo*items[i].quantita).toFixed(2)}\n`;
    dettagliOrdine += `  - Descrizione: ${items[i].descrizione}\n`;
    dettagliOrdine += `  - Note: ${items[i].note}\n`;
    dettagliOrdine += `\n`
  }
  return dettagliOrdine;
};

export const generaFilePDF = async (items, type) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let page = pdfDoc.addPage();
  const { height } = page.getSize();
  const margin = 50;
  const maxWidth = 450;
  const lineHeight = 15;
  let yPosition = height - 60;

  // Funzione per aggiungere righe con gestione paginazione
  const addLine = (line) => {
    if (yPosition < margin) {
      page = pdfDoc.addPage();
      yPosition = height - 60;
    }
    page.drawText(line, { x: margin, y: yPosition, size: 12, font, color: rgb(0, 0, 0) });
    yPosition -= lineHeight;
  };

  // Funzione per suddividere testo lungo
  const addText = (text) => {
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, 12);
      if (testWidth > maxWidth && line.length > 0) {
        addLine(line);
        line = word + ' ';
      } 
      else {
        line = testLine;
      }
    }
    addLine(line);
  };

  if(type === "Spese") {
    // Aggiunta delle spese
    items.forEach((spesa) => {
      const blocco = `Spesa numero ${items.indexOf(spesa) + 1}:\n` +
                    `Nome: ${spesa.nome}\n` +
                    `Giorno: ${formatoDate(spesa.giorno, "GG-MM-AAAA")}\n` +
                    `Descrizione: ${spesa.descrizione}\n` +
                    `Totale: € ${spesa.totale.toFixed(2)}\n` +
                    `Note: ${spesa.note}\n\n`;
      blocco.split('\n').forEach((linea) => {
        addText(linea);
      });
    });
  }
  
  if(type === "Ordini") {
    // Aggiunta degli ordini
    items.forEach((ordine) => {
      const data = new Date(ordine.data_creazione);
      const blocco = `Ordine numero ${items.indexOf(ordine) + 1}:\n` +
        `Cliente: ${ordine.cognome_cliente} ${ordine.nome_cliente}\n` +
        `Data creazione: ${("00" + data.getDate()).slice(-2)}/${("00" + (data.getMonth() + 1)).slice(-2)}/${data.getFullYear()} ${("00" + data.getHours()).slice(-2)}:${("00" + data.getMinutes()).slice(-2)}:${("00" + data.getSeconds()).slice(-2)}\n` +
        `Totale: € ${ordine.totale.toFixed(2)}\n` +
        `Metodo di pagamento: ${ordine.metodo_pagamento}\n` +
        `Pagamento confermato: ${ordine.is_pagato ? "Si" : "No"}\n` +
        (ordine.metodo_pagamento === "Struttura" ? `Dettagli prenotazione:\n${getDettagliPrenotazionePDF(ordine.data_prenotazione, ordine.ora_prenotazione)}\n` : "") +
        (ordine.metodo_pagamento === "Spedizione" ? `Dettagli spedizione:\n${getDettagliSpedizione(ordine.indirizzo, ordine.numero_carta)}\n` : "") +
        (ordine.metodo_pagamento === "Corriere" ? `Dettagli corriere:\n${getDettagliCorriere(ordine.indirizzo)}\n` : "") +
        `Dettagli ordine:\n${getDettagliOrdine(JSON.parse(ordine.items))}\n\n`;

      blocco.split('\n').forEach((linea) => {
        addText(linea);
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  if(type === "Spese") {
    saveAs(blob, "Spese.pdf");
  }

  if(type === "Ordini") {
    saveAs(blob, "Ordini.pdf");
  }
}

export const generaFileSpeseExcel = async (spese) => {
  // Creiamo un nuovo foglio di lavoro (Workbook)
  const workbook = XLSX.utils.book_new();
  let dataToExport = [];

  if (spese.length > 0) {
    // Mappiamo i dati nel formato corretto (incluso l'header come chiavi dell'oggetto)
    dataToExport = spese.map(spesa => ({
      'Nome': spesa.nome,
      'Giorno': formatoDate(spesa.giorno, "GG-MM-AAAA"),
      'Descrizione': spesa.descrizione,
      'Totale': spesa.totale + " €",
      'Note': spesa.note
    }));
  } else {
    // Caso in cui non ci siano spese
    dataToExport = [{ 'Messaggio': 'Nessuna spesa trovata.' }];
  }

  // Trasformiamo l'array di oggetti in un foglio di calcolo (Worksheet)
  const speseSheet = XLSX.utils.json_to_sheet(dataToExport);

  // Impostiamo la larghezza delle colonne
  if (spese.length > 0) {
    speseSheet['!cols'] = [
      { wch: 20 }, // Nome
      { wch: 20 }, // Giorno
      { wch: 30 }, // Descrizione
      { wch: 10 }, // Totale
      { wch: 30 }  // Note
    ];
  }

  // Appendiamo il foglio al workbook con il nome 'Spese'
  XLSX.utils.book_append_sheet(workbook, speseSheet, 'Spese');

  // Generiamo il file e avviamo il download direttamente
  XLSX.writeFile(workbook, 'Spese.xlsx');
  
  console.log('File Excel generato con successo.');
};

export const generaFileOrdiniExcel = async (ordini) => {
  const workbook = XLSX.utils.book_new();
  let dataToExport = [];

  // Aggiungiamo i dati al foglio ordiniSheet
  if (ordini.length > 0) {
    dataToExport = ordini.map(ordine => {
      const data = new Date(ordine.data_creazione);
      
      // Manteniamo la tua formattazione manuale della data
      const dataFormattata = ("00" + data.getDate()).slice(-2) + "/" + 
                             ("00" + (data.getMonth() + 1)).slice(-2) + "/" + 
                             (data.getFullYear() + " " + 
                             ("00" + data.getHours()).slice(-2) + ":" + 
                             ("00" + data.getMinutes()).slice(-2) + ":" + 
                             ("00" + data.getSeconds()).slice(-2));

      return {
        "Cliente": ordine.cognome_cliente + " " + ordine.nome_cliente,
        "Data creazione": dataFormattata,
        "Totale": ordine.totale,
        "Metodo di pagamento": ordine.metodo_pagamento,
        "Pagamento confermato": ordine.is_pagato ? "Si" : "No",
        "Dettagli di prenotazione": ordine.metodo_pagamento === "Struttura" ? getDettagliPrenotazione(ordine.data_prenotazione, ordine.ora_prenotazione) : "Dettagli non presenti.",
        "Dettagli di spedizione": ordine.metodo_pagamento === "Spedizione" ? getDettagliSpedizione(ordine.indirizzo, ordine.numero_carta) : "Dettagli non presenti.",
        "Dettagli corriere": ordine.metodo_pagamento === "Corriere" ? getDettagliCorriere(ordine.indirizzo) : "Dettagli non presenti.",
        "Dettagli ordine": getDettagliOrdine(JSON.parse(ordine.items))
      };
    });
  } 
  else {
    // Caso in cui non ci siano ordini
    dataToExport = [{ "Messaggio": 'Nessun ordine trovato.' }];
  }

  // Trasformiamo l'array di oggetti nel foglio di calcolo
  const ordiniSheet = XLSX.utils.json_to_sheet(dataToExport);

  // Impostiamo le larghezze delle colonne
  if (ordini.length > 0) {
    ordiniSheet['!cols'] = [
      { wch: 30 }, // Cliente
      { wch: 30 }, // Data creazione
      { wch: 10 }, // Totale
      { wch: 30 }, // Metodo di pagamento
      { wch: 30 }, // Pagamento confermato
      { wch: 50 }, // Dettagli di prenotazione
      { wch: 50 }, // Dettagli di spedizione
      { wch: 50 }, // Dettagli corriere
      { wch: 50 }  // Dettagli ordine
    ];
  }

  // Appendiamo il foglio al workbook
  XLSX.utils.book_append_sheet(workbook, ordiniSheet, 'Ordini');

  // Scriviamo il file e avviamo il download
  XLSX.writeFile(workbook, 'Ordini.xlsx');
  
  console.log('File Excel generato con successo.');
};








