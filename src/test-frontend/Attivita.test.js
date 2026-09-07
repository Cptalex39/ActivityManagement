import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Attivita from '../react_redux/views/attivita_view/Attivita';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const mockEntrateUscite = () => {
  const mesi = Array(12).fill(null).map((_, index) => ({
    totale: index % 2 === 0 ? 1000 + index * 100 : 500 + index * 50,
    items: index % 2 === 0 
      ? [{ nome: 'Servizio A', totale: 600 }, { nome: 'Servizio B', totale: 400 }]
      : [{ nome: 'Prodotto X', totale: 300 }, { nome: 'Prodotto Y', totale: 200 }]
  }));

  const uscite = Array(12).fill(null).map((_, index) => ({
    totale: 300 + index * 20,
    spese: [{ nome: 'Spesa Fix', totale: 200 }, { nome: 'Spesa Var', totale: 100 }]
  }));

  return { entrate_anno: mesi, uscite_anno: uscite };
};

const preloadedState = {
  stile: {
    value: { tema: 'light' }
  },
  attivita: {
    value: { nome: 'Test Activity' }
  }
};

describe('Attivita - Test Funzionali', () => {
  beforeEach(() => {
    // Endpoint corretto: /ESEGUI_ANALISI
    server.use(
      http.post('/ESEGUI_ANALISI', async () => {
        return HttpResponse.json({ 
          isOK: true, 
          ...mockEntrateUscite() 
        });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  test('TC_ATTIVITA_001: Rendering iniziale del form analisi', () => {
    renderWithProviders(<Attivita />, { preloadedState });

    expect(screen.getByText('Form analisi')).toBeInTheDocument();

    const inputAnno = screen.getByPlaceholderText('Anno');
    expect(inputAnno).toBeInTheDocument();
    // Il valore è un numero, confrontiamo con Number
    expect(Number(inputAnno.value)).toBe(new Date().getFullYear());

    const btnAnalisi = screen.getByRole('button', { name: 'Esegui analisi' });
    expect(btnAnalisi).toBeInTheDocument();
  });

  test('TC_ATTIVITA_002: Modifica del campo Anno', () => {
    renderWithProviders(<Attivita />, { preloadedState });

    const inputAnno = screen.getByPlaceholderText('Anno');
    fireEvent.change(inputAnno, { target: { value: '2025' } });
    expect(Number(inputAnno.value)).toBe(2025);
  });

  test('TC_ATTIVITA_003: Esecuzione analisi con dati validi (Happy Path)', async () => {
    renderWithProviders(<Attivita />, { preloadedState });

    const inputAnno = screen.getByPlaceholderText('Anno');
    fireEvent.change(inputAnno, { target: { value: '2023' } });

    const btnAnalisi = screen.getByRole('button', { name: 'Esegui analisi' });
    fireEvent.click(btnAnalisi);

    await waitFor(() => {
      expect(screen.getByText('ANALISI PER L\'ANNO 2023')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('GENNAIO 2023')).toBeInTheDocument();
    });

    expect(screen.getByText('RESOCONTO ANNUALE')).toBeInTheDocument();

    // Usiamo getAllByText per gestire le molteplici occorrenze
    const entrateElements = screen.getAllByText(/Entrate:/i);
    expect(entrateElements.length).toBeGreaterThan(0);
  });

  test('TC_ATTIVITA_004: Esecuzione analisi con dati vuoti (Sad Path)', async () => {
    server.use(
      http.post('/ESEGUI_ANALISI', async () => {
        return HttpResponse.json({ 
          isOK: true,
          entrate_anno: Array(12).fill(null).map(() => ({ totale: 0, items: [] })),
          uscite_anno: Array(12).fill(null).map(() => ({ totale: 0, spese: [] }))
        });
      })
    );

    renderWithProviders(<Attivita />, { preloadedState });

    const inputAnno = screen.getByPlaceholderText('Anno');
    fireEvent.change(inputAnno, { target: { value: '2024' } });

    const btnAnalisi = screen.getByRole('button', { name: 'Esegui analisi' });
    fireEvent.click(btnAnalisi);

    await waitFor(() => {
      expect(screen.getByText('ANALISI PER L\'ANNO 2024')).toBeInTheDocument();
    });

    const entrateZero = screen.getAllByText(/\+ € 0/);
    expect(entrateZero.length).toBeGreaterThan(0);
    const usciteZero = screen.getAllByText(/\- € 0/);
    expect(usciteZero.length).toBeGreaterThan(0);
  });

  test('TC_ATTIVITA_005: Gestione errore API (isOK = false)', async () => {
    server.use(
      http.post('/ESEGUI_ANALISI', async () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<Attivita />, { preloadedState });

    const inputAnno = screen.getByPlaceholderText('Anno');
    fireEvent.change(inputAnno, { target: { value: '2022' } });

    const btnAnalisi = screen.getByRole('button', { name: 'Esegui analisi' });
    fireEvent.click(btnAnalisi);

    await waitFor(() => {
      const title = screen.queryByText('ANALISI PER L\'ANNO 2022');
      expect(title).not.toBeInTheDocument();
    });
  });
});