import { 
  getDettagliPrenotazione, getDettagliPrenotazionePDF, getDettagliSpedizione, getDettagliCorriere, getDettagliOrdine, 
  generaFilePDF, generaFileSpeseExcel, generaFileOrdiniExcel
} from "../../../../utils/File";
import { formatoDate } from "../../../../utils/Tempo";
import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';

jest.mock('pdf-lib');
jest.mock('file-saver');
jest.mock('../../../../utils/Tempo');
jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(),
    json_to_sheet: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe('Vari test su "getDettagliPrenotazione', () => {
  /** UT_Fil_GetDetPre_01 **/
  test('ora_prenotazione non inserita', () => {
    const data_prenotazione = "2022-8-4";
    const ora_prenotazione = "";

    const result = getDettagliPrenotazione(data_prenotazione, ora_prenotazione);
    
    expect(result).toEqual("04/08/2022");
  });

  /** UT_Fil_GetDetPre_02 **/
  test('ora_prenotazione inserita', () => {
    const data_prenotazione = "2022-8-4";
    const ora_prenotazione = "10:58";

    const result = getDettagliPrenotazione(data_prenotazione, ora_prenotazione);
    
    expect(result).toEqual("04/08/2022 10:58");
  });
});

describe('Vari test su "getDettagliPrenotazionePDF', () => {
  /** UT_Fil_GetDetPrePDF_01 **/
  test('ora_prenotazione non inserita', () => {
    const data_prenotazione = "2022-8-4";
    const ora_prenotazione = "";

    const result = getDettagliPrenotazionePDF(data_prenotazione, ora_prenotazione);
    
    expect(result).toEqual("- Data prenotazione: 04/08/2022");
  });

  /** UT_Fil_GetDetPrePDF_02 **/
  test('ora_prenotazione inserita', () => {
    const data_prenotazione = "2022-8-4";
    const ora_prenotazione = "10:58";

    const result = getDettagliPrenotazionePDF(data_prenotazione, ora_prenotazione);
    
    expect(result).toEqual("- Data prenotazione: 04/08/2022 10:58");
  });
});

describe('Vari test su "getDettagliSpedizione', () => {
  /** UT_Fil_GetDetSpe_01 **/
  test('Ottenimento dettagli spedizione', () => {
    const indirizzo = "Via Roma, 10";
    const numero_carta = "1234";

    const result = getDettagliSpedizione(indirizzo, numero_carta);
    
    expect(result).toEqual("- Indirizzo: Via Roma, 10.\n- Numero carta: **** **** **** 1234");
  });
});

describe('Vari test su "getDettagliCorriere', () => {
  /** UT_Fil_GetDetCor_01 **/
  test('Ottenimento dettagli spedizione', () => {
    const indirizzo = "Via Roma, 10";

    const result = getDettagliCorriere(indirizzo);
    
    expect(result).toEqual("- Indirizzo: Via Roma, 10.");
  });
});

describe('Vari test su "getDettagliOrdine', () => {
  /** UT_Fil_GetDetOrd_01 **/
  test('items = []', () => {
    const items = [];

    const result = getDettagliOrdine(items);

    expect(result).toEqual("");
  });

  /** UT_Fil_GetDetOrd_02 **/
  test('items != []', () => {
    const items = [
      {
        nome: "Nome servizio", 
        tipo: "Servizio", 
        prezzo: 12.2468, 
        quantita: 5, 
        descrizione: "Descrizione servizio", 
        note: "Note servizio", 
      }, 
      {
        nome: "Nome prodotto", 
        tipo: "Prodotto", 
        prezzo: 34.7531, 
        quantita: 10, 
        descrizione: "Descrizione prodotto", 
        note: "Note prodotto", 
      }
    ];

    const outputExpected = "" 
      + "- Nome servizio (Servizio): 12.25 (x5) --> totale: 61.23\n" 
      + "  - Descrizione: Descrizione servizio\n" 
      + "  - Note: Note servizio\n\n" 
      + "- Nome prodotto (Prodotto): 34.75 (x10) --> totale: 347.53\n" 
      + "  - Descrizione: Descrizione prodotto\n" 
      + "  - Note: Note prodotto\n\n";

    const result = getDettagliOrdine(items);

    expect(result).toEqual(outputExpected);
  });
});

describe('Vari test su "generaFilePDF', () => {
  let mockPage;
  let mockFont;
  let mockPdfDoc;

  const baseOrdine = {
    data_creazione: '2026-01-15T10:30:00',
    cognome_cliente: 'Rossi',
    nome_cliente: 'Mario',
    totale: 99.9,
    metodo_pagamento: 'Corriere',
    is_pagato: true,
    indirizzo: 'Via Roma 1',
    items: JSON.stringify([
      { nome: 'Prodotto', tipo: 'Prodotto', prezzo: 10, quantita: 2, descrizione: 'D', note: 'N' },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockFont = {
      widthOfTextAtSize: jest.fn((text) => text.length * 5),
    };

    mockPage = {
      getSize: jest.fn(() => ({ width: 600, height: 800 })),
      drawText: jest.fn(),
    };

    mockPdfDoc = {
      embedFont: jest.fn().mockResolvedValue(mockFont),
      addPage: jest.fn(() => mockPage),
      save: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    };

    PDFDocument.create = jest.fn().mockResolvedValue(mockPdfDoc);
    formatoDate.mockImplementation((data) => data);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_Fil_GenFilPDF_01 **/
  test('type = "Spese", crea il documento PDF e salva con il nome corretto', async () => {
    const items = [
      { nome: 'Cena', giorno: '2026-01-10', descrizione: 'Ristorante', totale: 45.5, note: 'Nessuna' },
    ];

    await generaFilePDF(items, 'Spese');

    expect(PDFDocument.create).toHaveBeenCalledTimes(1);
    expect(mockPdfDoc.embedFont).toHaveBeenCalledWith(StandardFonts.Helvetica);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Spese.pdf');
  });

  /** UT_Fil_GenFilPDF_02 **/
  test('type = "Spese", non chiama saveAs con il nome "Ordini.pdf" quando type è "Spese"', async () => {
    const items = [{ nome: 'X', giorno: '2026-01-01', descrizione: 'Y', totale: 1, note: 'Z' }];

    await generaFilePDF(items, 'Spese');

    expect(saveAs).not.toHaveBeenCalledWith(expect.any(Blob), 'Ordini.pdf');
  });

  /** UT_Fil_GenFilPDF_03 **/
  test('type = "Spese", scrive il testo nella pagina tramite drawText', async () => {
    const items = [{ nome: 'Cena', giorno: '2026-01-10', descrizione: 'Ristorante', totale: 45.5, note: 'Nessuna' }];

    await generaFilePDF(items, 'Spese');

    expect(mockPage.drawText).toHaveBeenCalled();
    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]);
    expect(testiScritti.some((t) => t.includes('Cena'))).toBe(true);
  });

  /** UT_Fil_GenFilPDF_04 **/
  test('type = "Spese", gestisce correttamente un array vuoto senza errori', async () => {
    await expect(generaFilePDF([], 'Spese')).resolves.not.toThrow();
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Spese.pdf');
    expect(mockPage.drawText).not.toHaveBeenCalled();
  });

  /** UT_Fil_GenFilPDF_05 **/
  test('type = "Spese", formatta correttamente il totale con 2 decimali', async () => {
    const items = [{ nome: 'Spesa', giorno: '2026-01-01', descrizione: 'Desc', totale: 10, note: 'N' }];

    await generaFilePDF(items, 'Spese');

    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]);
    expect(testiScritti.some((t) => t.includes('10.00'))).toBe(true);
  });

  /** UT_Fil_GenFilPDF_06 **/
  test('type = "Spese", numera correttamente più spese in sequenza', async () => {
    const items = [
      { nome: 'Spesa1', giorno: '2026-01-01', descrizione: 'D1', totale: 1, note: 'N1' },
      { nome: 'Spesa2', giorno: '2026-01-02', descrizione: 'D2', totale: 2, note: 'N2' },
    ];

    await generaFilePDF(items, 'Spese');

    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]);
    expect(testiScritti.some((t) => t.includes('Spesa numero 1'))).toBe(true);
    expect(testiScritti.some((t) => t.includes('Spesa numero 2'))).toBe(true);
  });

  /** UT_Fil_GenFilPDF_07 **/
  test('type = "Ordini", salva il file con il nome "Ordini.pdf"', async () => {
    await generaFilePDF([baseOrdine], 'Ordini');
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Ordini.pdf');
  });

  /** UT_Fil_GenFilPDF_08 **/
  test('type = "Ordini", include il nome e cognome del cliente nel testo', async () => {
    await generaFilePDF([baseOrdine], 'Ordini');
    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]);
    expect(testiScritti.some((t) => t.includes('Rossi'))).toBe(true);
  });

  /** UT_Fil_GenFilPDF_09 **/
  test('type = "Ordini", mostra "Si" quando is_pagato è true e "No" quando false', async () => {
    const ordineNonPagato = { ...baseOrdine, is_pagato: false };
    await generaFilePDF([ordineNonPagato], 'Ordini');
    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]).join(' ');
    expect(testiScritti).toContain('No');
  });

  /** UT_Fil_GenFilPDF_10 **/
  test('type = "Ordini", include i dettagli di spedizione quando metodo_pagamento è "Spedizione"', async () => {
    const ordineSpedizione = { ...baseOrdine, metodo_pagamento: 'Spedizione', numero_carta: '1234' };
    await generaFilePDF([ordineSpedizione], 'Ordini');
    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]).join(' ');
    expect(testiScritti).toContain('1234');
  });

  /** UT_Fil_GenFilPDF_11 **/
  test('type = "Ordini", include i dettagli di prenotazione quando metodo_pagamento è "Struttura"', async () => {
    const ordineStruttura = { ...baseOrdine, metodo_pagamento: 'Struttura', data_prenotazione: '2026-02-01', ora_prenotazione: '20:00' };
    await generaFilePDF([ordineStruttura], 'Ordini');
    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]).join(' ');
    expect(testiScritti).toContain('20:00');
  });

  /** UT_Fil_GenFilPDF_12 **/
  test('type = "Ordini", gestisce correttamente un array vuoto senza errori', async () => {
    await expect(generaFilePDF([], 'Ordini')).resolves.not.toThrow();
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Ordini.pdf');
  });

  /** UT_Fil_GenFilPDF_13 **/
  test('type = "Ordini", numera correttamente più ordini in sequenza', async () => {
    const ordine2 = { ...baseOrdine, cognome_cliente: 'Bianchi' };
    await generaFilePDF([baseOrdine, ordine2], 'Ordini');
    const testiScritti = mockPage.drawText.mock.calls.map((call) => call[0]);
    expect(testiScritti.some((t) => t.includes('Ordine numero 1'))).toBe(true);
    expect(testiScritti.some((t) => t.includes('Ordine numero 2'))).toBe(true);
  });

  /** UT_Fil_GenFilPDF_14 **/
  test('gestione paginazione, crea una nuova pagina quando il contenuto supera lo spazio disponibile', async () => {
    const items = Array.from({ length: 60 }, (_, i) => ({
      nome: `Spesa ${i}`,
      giorno: '2026-01-01',
      descrizione: 'Descrizione lunga per occupare spazio',
      totale: 10,
      note: 'Nota',
    }));

    await generaFilePDF(items, 'Spese');

    expect(mockPdfDoc.addPage.mock.calls.length).toBeGreaterThan(1);
  });

  /** UT_Fil_GenFilPDF_15 **/
  test('type non valido, non scrive nulla e non chiama saveAs se type non è "Spese" né "Ordini"', async () => {
    await generaFilePDF([{ nome: 'X' }], 'AltroTipo');
    expect(mockPage.drawText).not.toHaveBeenCalled();
    expect(saveAs).not.toHaveBeenCalled();
  });
});

describe('Vari test su "generaFileSpeseExcel', () => {
  let mockWorkbook;
  let mockSheet;

  const spese = [
    { nome: 'Cena', giorno: '2026-01-10', descrizione: 'Ristorante', totale: 45.5, note: 'Nessuna' },
    { nome: 'Benzina', giorno: '2026-01-11', descrizione: 'Rifornimento', totale: 30, note: 'Auto' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockWorkbook = { Sheets: {}, SheetNames: [] };
    mockSheet = {};

    XLSX.utils.book_new.mockReturnValue(mockWorkbook);
    XLSX.utils.json_to_sheet.mockReturnValue(mockSheet);

    formatoDate.mockImplementation((data) => `formattata:${data}`);

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  /** UT_Fil_GenFilSpeExc_01 **/
  test('spese != [], crea un nuovo workbook', async () => {
    await generaFileSpeseExcel(spese);
    expect(XLSX.utils.book_new).toHaveBeenCalledTimes(1);
  });

  /** UT_Fil_GenFilSpeExc_02 **/
  test('spese != [], mappa correttamente ogni spesa nelle colonne attese', async () => {
    await generaFileSpeseExcel(spese);

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
      {
        'Nome': 'Cena',
        'Giorno': 'formattata:2026-01-10',
        'Descrizione': 'Ristorante',
        'Totale': '45.5 €',
        'Note': 'Nessuna',
      },
      {
        'Nome': 'Benzina',
        'Giorno': 'formattata:2026-01-11',
        'Descrizione': 'Rifornimento',
        'Totale': '30 €',
        'Note': 'Auto',
      },
    ]);
  });

  /** UT_Fil_GenFilSpeExc_03 **/
  test('spese != [], chiama formatoDate con il formato "GG-MM-AAAA" per ogni spesa', async () => {
    await generaFileSpeseExcel(spese);

    expect(formatoDate).toHaveBeenCalledWith('2026-01-10', 'GG-MM-AAAA');
    expect(formatoDate).toHaveBeenCalledWith('2026-01-11', 'GG-MM-AAAA');
    expect(formatoDate).toHaveBeenCalledTimes(2);
  });

  /** UT_Fil_GenFilSpeExc_04 **/
  test('spese != [], imposta la larghezza delle colonne su "!cols"', async () => {
    await generaFileSpeseExcel(spese);

    expect(mockSheet['!cols']).toEqual([
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 10 },
      { wch: 30 },
      ]);
  });

  /** UT_Fil_GenFilSpeExc_05 **/
  test('spese != [], appende il foglio al workbook con il nome "Spese"', async () => {
    await generaFileSpeseExcel(spese);

    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(mockWorkbook, mockSheet, 'Spese');
  });

  /** UT_Fil_GenFilSpeExc_06 **/
  test('spese != [], scrive il file con il nome "Spese.xlsx"', async () => {
    await generaFileSpeseExcel(spese);

    expect(XLSX.writeFile).toHaveBeenCalledWith(mockWorkbook, 'Spese.xlsx');
  });

  /** UT_Fil_GenFilSpeExc_07 **/
  test('spese != [], stampa il messaggio di successo in console', async () => {
    await generaFileSpeseExcel(spese);

    expect(console.log).toHaveBeenCalledWith('File Excel generato con successo.');
  });

  /** UT_Fil_GenFilSpeExc_08 **/
  test('spese = [], usa il messaggio di fallback invece di mappare le spese', async () => {
    await generaFileSpeseExcel([]);

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
      { 'Messaggio': 'Nessuna spesa trovata.' },
    ]);
  });

  /** UT_Fil_GenFilSpeExc_09 **/
  test('spese = [], non chiama formatoDate se non ci sono spese', async () => {
    await generaFileSpeseExcel([]);

    expect(formatoDate).not.toHaveBeenCalled();
  });

  /** UT_Fil_GenFilSpeExc_10 **/
  test('spese = [], non imposta "!cols" quando l\'array è vuoto', async () => {
    await generaFileSpeseExcel([]);

    expect(mockSheet['!cols']).toBeUndefined();
  });

  /** UT_Fil_GenFilSpeExc_11 **/
  test('spese = [], scrive comunque il file con il nome corretto', async () => {
    await generaFileSpeseExcel([]);

    expect(XLSX.writeFile).toHaveBeenCalledWith(mockWorkbook, 'Spese.xlsx');
  });

  /** UT_Fil_GenFilSpeExc_12 **/
  test('Edge case sui valori delle spese, gestisce correttamente un totale pari a 0', async () => {
    const spese = [{ nome: 'Spesa gratuita', giorno: '2026-01-01', descrizione: 'D', totale: 0, note: 'N' }];

    await generaFileSpeseExcel(spese);

    const datiPassati = XLSX.utils.json_to_sheet.mock.calls[0][0];
    expect(datiPassati[0]['Totale']).toBe('0 €');
  });

  /** UT_Fil_GenFilSpeExc_13 **/
  test('Edge case sui valori delle spese, gestisce correttamente campi opzionali mancanti (note vuote)', async () => {
    const spese = [{ nome: 'X', giorno: '2026-01-01', descrizione: 'D', totale: 5, note: '' }];

    await generaFileSpeseExcel(spese);

    const datiPassati = XLSX.utils.json_to_sheet.mock.calls[0][0];
    expect(datiPassati[0]['Note']).toBe('');
  });
});

describe('Vari test su "generaFileOrdiniExcel', () => {
  let mockWorkbook;
  let mockSheet;

  const baseOrdine = {
    data_creazione: '2026-03-15T09:05:07',
    cognome_cliente: 'Rossi',
    nome_cliente: 'Mario',
    totale: 150.5,
    metodo_pagamento: 'Corriere',
    is_pagato: true,
    indirizzo: 'Via Roma 1',
    items: JSON.stringify([
      { nome: 'Prodotto', tipo: 'Prodotto', prezzo: 10, quantita: 2, descrizione: 'D', note: 'N' },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockWorkbook = { Sheets: {}, SheetNames: [] };
    mockSheet = {};

    XLSX.utils.book_new.mockReturnValue(mockWorkbook);
    XLSX.utils.json_to_sheet.mockReturnValue(mockSheet);

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  /** UT_Fil_GenFilOrdExc_01 **/
  test('Mappa correttamente cliente, totale e data formattata', async () => {
    await generaFileOrdiniExcel([baseOrdine]);

    const datiPassati = XLSX.utils.json_to_sheet.mock.calls[0][0];
    expect(datiPassati[0]['Cliente']).toBe('Rossi Mario');
    expect(datiPassati[0]['Totale']).toBe(150.5);
    expect(datiPassati[0]['Data creazione']).toBe('15/03/2026 09:05:07');
  });

  /** UT_Fil_GenFilOrdExc_02 **/
  test('Metodo "Struttura": produce il testo reale di getDettagliPrenotazione', async () => {
    const ordine = {
      ...baseOrdine,
      metodo_pagamento: 'Struttura',
      data_prenotazione: '2026-04-01T12:00:00', // mezzogiorno: evita bordi di mezzanotte
      ora_prenotazione: '20:00',
    };

    await generaFileOrdiniExcel([ordine]);

    const datiPassati = XLSX.utils.json_to_sheet.mock.calls[0][0];
    // Dobbiamo conoscere il formato REALE prodotto da getDettagliPrenotazione:
    // "GG/MM/AAAA ora_prenotazione"
    expect(datiPassati[0]['Dettagli di prenotazione']).toBe('01/04/2026 20:00');
    expect(datiPassati[0]['Dettagli di spedizione']).toBe('Dettagli non presenti.');
    expect(datiPassati[0]['Dettagli corriere']).toBe('Dettagli non presenti.');
  });

  /** UT_Fil_GenFilOrdExc_03 **/
  test('Metodo "Spedizione": produce il testo reale di getDettagliSpedizione', async () => {
    const ordine = { ...baseOrdine, metodo_pagamento: 'Spedizione', numero_carta: '9999' };

    await generaFileOrdiniExcel([ordine]);

    const datiPassati = XLSX.utils.json_to_sheet.mock.calls[0][0];
    expect(datiPassati[0]['Dettagli di spedizione']).toBe(
      '- Indirizzo: Via Roma 1.\n- Numero carta: **** **** **** 9999'
    );
  });

  /** UT_Fil_GenFilOrdExc_04 **/
  test('Metodo "Corriere": produce il testo reale di getDettagliCorriere', async () => {
    await generaFileOrdiniExcel([baseOrdine]);

    const datiPassati = XLSX.utils.json_to_sheet.mock.calls[0][0];
    expect(datiPassati[0]['Dettagli corriere']).toBe('- Indirizzo: Via Roma 1.');
  });

  /** UT_Fil_GenFilOrdExc_05 **/
  test('Produce il testo reale di getDettagliOrdine con calcoli corretti', async () => {
    await generaFileOrdiniExcel([baseOrdine]);

    const datiPassati = XLSX.utils.json_to_sheet.mock.calls[0][0];
    expect(datiPassati[0]['Dettagli ordine']).toBe(
      '- Prodotto (Prodotto): 10.00 (x2) --> totale: 20.00\n' +
      '  - Descrizione: D\n' +
      '  - Note: N\n' +
      '\n'
    );
  });

  /** UT_Fil_GenFilOrdExc_06 **/
  test('Lancia un errore se ordine.items non è JSON valido (si propaga da JSON.parse)', async () => {
    const ordineConItemsInvalidi = { ...baseOrdine, items: 'non-e-json-valido' };
    await expect(generaFileOrdiniExcel([ordineConItemsInvalidi])).rejects.toThrow();
  });
});









