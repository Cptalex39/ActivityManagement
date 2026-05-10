// React e Redux
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import ReactDOMServer from 'react-dom/server';
// Utils
import { formatoDate } from './Tempo';

const getData = (data_creazione, isOrarioIncluso) => {
  const date = new Date(data_creazione);
  return "giorno: "+("00"+date.getDate()).slice(-2)+"/"+("00"+(date.getMonth()+1)).slice(-2)+"/"+(date.getFullYear()) + (
    isOrarioIncluso ? " alle ore "+("00"+date.getHours()).slice(-2)+":"+("00"+date.getMinutes()).slice(-2)+":"+("00"+date.getSeconds()).slice(-2) : ""
  );
}

const jsxToPlainText = (jsx) => {
  const html = ReactDOMServer.renderToStaticMarkup(jsx);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  const text = doc.body.innerHTML
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<p><strong>/gi, '\n')
    .replace(/<\/strong><\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n\n') 
    .replace(/<[^>]+>/g, '')
    .replace(/\n+/g, '\n'); 

  return text;
};

const getDettagliPrenotazione = (data_prenotazione, ora_prenotazione) => {
  const data = new Date(data_prenotazione);
  return ("00"+data.getDate()).slice(-2)+"/"+("00"+(data.getMonth()+1)).slice(-2)+"/"+data.getFullYear()+" "+ora_prenotazione; 
};

const getDettagliPrenotazionePDF = (data_prenotazione, ora_prenotazione) => {
  const data = new Date(data_prenotazione);
  return `- Data prenotazione: ${("00"+data.getDate()).slice(-2)+"/"+("00"+(data.getMonth()+1)).slice(-2)+"/"+data.getFullYear()+" "+ora_prenotazione}`; 
};

const getDettagliSpedizione = (indirizzo, numero_carta) => {
  return "- Indirizzo: " + indirizzo + ".\n- Numero carta: **** **** **** " + numero_carta;
};

const getDettagliCorriere = (indirizzo) => {
  return "- Indirizzo: " + indirizzo + ".";
};

const getDettagliOrdine = (items) => {
  let dettagliOrdine = ``;

  for (let i = 0; i < items.length; i++) {
    dettagliOrdine += `- ${items[i].nome} (${items[i].tipo}): ${(items[i].prezzo).toFixed(2)} (x${items[i].quantita}) --> totale: ${(items[i].prezzo*items[i].quantita).toFixed(2)}\n`;
    dettagliOrdine += `  - Descrizione: ${items[i].descrizione}\n`;
    dettagliOrdine += `  - Note: ${items[i].note}\n`;
    dettagliOrdine += `\n`
  }
  return dettagliOrdine;
};

export const generaFileSpesePDFOLD = async (spese) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  let y = 750;
  const startX = 50;

  // Funzione per avvolgere il testo
  const wrapText = (text, maxWidth) => {
    const words = text.split(' ');
    let lines = [];
    let line = '';

    words.forEach((word) => {
      const potentialLine = line.length === 0 ? word : line + ' ' + word;
      if (potentialLine.length <= maxWidth) {
        line = potentialLine;
      } else {
        lines.push(line);
        line = word;
      }
    });
    if (line) {
      lines.push(line);
    }
    return lines;
  };

  // Colore per intestazioni
  const headerColor = rgb(0.8, 0.8, 1); // Celeste

  // Disegna sfondo per intestazioni
  page.drawRectangle({
    x: startX,
    y: y - 20,
    width: 500,
    height: 20,
    color: headerColor,
  });

  // Intestazione della tabella
  const headers = ['Nome', 'Giorno', 'Descrizione', 'Totale (€)', 'Note'];
  headers.forEach((header, index) => {
    page.drawText(header, {
      x: startX + index * 100,
      y: y - 15,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0), // Testo nero
    });
  });
  y -= 40;

  // Colori alternati per le righe
  const rowColor1 = rgb(1, 1, 1); // Bianco
  const rowColor2 = rgb(0.9, 0.9, 0.9); // Grigio chiaro

  // Contenuto della tabella
  if (spese.length > 0) {
    spese.forEach((spesa, rowIndex) => {
      const rowColor = rowIndex % 2 === 0 ? rowColor1 : rowColor2;

      // Disegna sfondo della riga
      page.drawRectangle({
        x: startX,
        y: y - 20,
        width: 500,
        height: 20,
        color: rowColor,
      });

      // Testo della riga con avvolgimento
      const values = [
        spesa.nome,
        spesa.giorno,
        spesa.descrizione,
        spesa.totale,
        spesa.note,
      ];
      values.forEach((value, index) => {
        const lines = wrapText(String(value), 15); // Limite di caratteri per colonna
        lines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: startX + index * 100,
            y: y - 15 - (lineIndex * 12), // Spazio tra righe avvolte
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0), // Testo nero
          });
        });
      });
      y -= 20 + (wrapText(values.join(''), 15).length * 12); // Adatta altezza
    });
  } else {
    page.drawText('Nessuna spesa trovata.', { x: startX, y, size: 12, font: timesRomanFont });
  }

  const pdfBytes = await pdfDoc.save();

  // Creazione del blob e download del file
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'spese.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generaFileSpesePDF = async (ordini) => {
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
      } else {
        line = testLine;
      }
    }
    addLine(line);
  };

  // Aggiunta delle spese
  ordini.forEach((spesa) => {
    const blocco = `Spesa numero ${ordini.indexOf(spesa) + 1}:\n` +
                   `Nome: ${spesa.nome}\n` +
                   `Giorno: ${formatoDate(spesa.giorno, "GG-MM-AAAA")}\n` +
                   `Descrizione: ${spesa.descrizione}\n` +
                   `Totale: € ${spesa.totale.toFixed(2)}\n` +
                   `Note: ${spesa.note}\n\n`;
    blocco.split('\n').forEach((linea) => {
      addText(linea);
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'Spese.pdf');
};

export const generaFileOrdiniPDF = async (ordini) => {
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
      } else {
        line = testLine;
      }
    }
    addLine(line);
  };

  // Aggiunta degli ordini
  ordini.forEach((ordine) => {
    const data = new Date(ordine.data_creazione);
    const blocco = `Ordine numero ${ordini.indexOf(ordine) + 1}:\n` +
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

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'Ordini.pdf');
};   

export const generaFileSpeseExcel = async (spese) => {
  const workbook = new ExcelJS.Workbook();
  const speseSheet = workbook.addWorksheet('Spese');

  // Aggiunge i dati al foglio speseSheet
  if (spese.length > 0) {
    speseSheet.columns = [
      { header: "Nome", key: 'nome', width: 20 },  
      { header: "Giorno", key: 'giorno', width: 20 }, 
      { header: "Descrizione", key: 'descrizione', width: 30 }, 
      { header: "Totale", key: 'totale', width: 10 }, 
      { header: "Note", key: 'note', width: 30 }
    ];
    spese.forEach(spesa => {
      speseSheet.addRow({
        nome: spesa.nome, 
        giorno: formatoDate(spesa.giorno, "GG-MM-AAAA"), 
        descrizione: spesa.descrizione, 
        totale: spesa.totale + " €", 
        note: spesa.note 
      });
    });
  } 
  else {
    speseSheet.addRow(['Nessuna spesa trovata.']);
  }

  // Genera il file Excel come blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Salva il file usando FileSaver.js
  saveAs(blob, 'Spese.xlsx');
  console.log('File Excel generato con successo.');
};

export const generaFileOrdiniExcel = async (ordini) => {
  const workbook = new ExcelJS.Workbook();
  const ordiniSheet = workbook.addWorksheet('Ordini');

  // Aggiunge i dati al foglio ordiniSheet
  if (ordini.length > 0) {
    ordiniSheet.columns = [
      { header: "Cliente", key: 'cliente', width: 30 },  
      { header: "Data creazione", key: 'data_creazione', width: 30 }, 
      { header: "Totale", key: 'totale', width: 10 }, 
      { header: "Metodo di pagamento", key: 'metodo_pagamento', width: 30 }, 
      { header: "Pagamento confermato", key: 'pagamento_confermato', width: 30 }, 
      { header: "Dettagli di prenotazione", key: 'dettagli_prenotazione', width: 50 },
      { header: "Dettagli di spedizione", key: 'dettagli_spedizione', width: 50 },
      { header: "Dettagli corriere", key: 'dettagli_corriere', width: 50 }, 
      { header: "Dettagli ordine", key: 'dettagli_ordine', width: 50 }
    ];
    ordini.forEach(ordine => {
      const data = new Date(ordine.data_creazione);
      ordiniSheet.addRow({
        cliente: ordine.cognome_cliente + " " + ordine.nome_cliente,
        data_creazione: ("00"+data.getDate()).slice(-2)+"/"+("00"+(data.getMonth()+1)).slice(-2)+"/"+(data.getFullYear()+" "+("00"+data.getHours()).slice(-2)+":"+("00"+data.getMinutes()).slice(-2)+":"+("00"+data.getSeconds()).slice(-2)), 
        totale: ordine.totale, 
        metodo_pagamento: ordine.metodo_pagamento,
        pagamento_confermato: ordine.is_pagato ? "Si" : "No", 
        dettagli_prenotazione: ordine.metodo_pagamento === "Struttura" ? getDettagliPrenotazione(ordine.data_prenotazione, ordine.ora_prenotazione) : "Dettagli non presenti.", 
        dettagli_spedizione: ordine.metodo_pagamento === "Spedizione" ? getDettagliSpedizione(ordine.indirizzo, ordine.numero_carta) : "Dettagli non presenti.", 
        dettagli_corriere: ordine.metodo_pagamento === "Corriere" ? getDettagliCorriere(ordine.indirizzo) : "Dettagli non presenti.", 
        dettagli_ordine: getDettagliOrdine(JSON.parse(ordine.items))
      });
    });
  } 
  else {
    ordiniSheet.addRow(['Nessun ordine trovato.']);
  }

  // Genera il file Excel come blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Salva il file usando FileSaver.js
  saveAs(blob, 'Ordini.xlsx');
  console.log('File Excel generato con successo.');
};








