import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Profilo from '../react_redux/views/autenticazione_view/Profilo';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { encryptPassword, PEPPER_HEX } from '../utils/Sicurezza';

// ============================================================
// STRATEGIA C - azioni REALI + MSW, hash REALE (vedi Login.test.js).
// FormProfilo/CardProfilo/RowProfilo (libreria esterna) mockati con
// un form che replica il contratto reale: un input per campo
// (name = campi.id[index], come la libreria), submit che invoca
// eseguiModificaProfilo. Flusso verificato su
// AutenticazioneActions.modificaProfilo.
// ============================================================

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@gianlucascisciolo/riutilizzoreact', () => {
  const actual = jest.requireActual('@gianlucascisciolo/riutilizzoreact');

  const FormProfiloMock = ({ campi, eseguiModificaProfilo, extra }) => (
    <>
      {extra && <div data-testid={extra}>vista</div>}
      <form data-testid="form-profilo-mock" onSubmit={(e) => { e.preventDefault(); eseguiModificaProfilo(); }}>
        {campi.label.map((label, index) => (
            <input
              key={index}
              data-testid={`campo-${campi.id[index]}`}
              placeholder={label}
              onChange={(e) => campi.onChange && campi.onChange({
                preventDefault: () => {},
                target: {
                  // Il contratto reale: l'id DOM ha il suffisso _profilo, la chiave di stato no
                  name: (campi.name && campi.name[index]) || campi.id[index].replace(/_profilo$/, ''),
                  id: campi.id[index],
                  value: e.target.value,
                },
              })}
            />
          ))}
        <button type="submit">Modifica profilo</button>
      </form>
    </>
  );

  return {
    ...actual,
    FormProfilo: FormProfiloMock,
    CardProfilo: (props) => <FormProfiloMock {...props} extra="vista-card-profilo" />,
    RowProfilo: (props) => <FormProfiloMock {...props} extra="vista-row-profilo" />,
  };
});

const SALT = 'aabbccddeeff00112233445566778899';
const PASSWORD_ATTUALE = 'Password123!';
const HASH_ATTUALE = encryptPassword(PASSWORD_ATTUALE, SALT, PEPPER_HEX);

// Intervalli e numero_clienti VALIDI: controlloModificaProfiloUtente li valida
// (X-Y, 0-23, non sovrapposti, numero_clienti >= 1) prima della password
const preloadedState = {
  autenticazione: { value: {
    isLogged: true, username: 'admin', ruolo: 'Amministratore',
    primo_intervallo: '1-5', secondo_intervallo: '7-10', numero_clienti: 5,
  } },
  stile: { value: { vistaForm: 'form' } },
  attivita: { value: {} },
};

describe('Profilo - Test Funzionali (MSW, azioni reali)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });

  const inviaConPassword = async (password) => {
  renderWithProviders(<Profilo />, { preloadedState });
  if (password) {
    await user.type(screen.getByTestId('campo-password_attuale_profilo'), password);
  }
  await user.click(screen.getByRole('button', { name: /modifica profilo/i }));
  };

  test('TC_PROFILO_001 - Modifica profilo con password corretta: alert di successo e navigazione', async () => {
    server.use(
      http.post('/OTTIENI_PASSWORD_UTENTE', () =>
        HttpResponse.json({ result: [{ password: HASH_ATTUALE, salt_hex: SALT }] })),
      http.post('/MODIFICA_PROFILO_UTENTE', () =>
        HttpResponse.json({}, { status: 200 })),
    );

    await inviaConPassword(PASSWORD_ATTUALE);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Profilo modificato con successo.');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('TC_PROFILO_002 - Password attuale errata: nessuna modifica, nessuna navigazione', async () => {
    const ALTRO_SALT = 'ffffffffeeeeeeee0011223344556677';
    const modificaHandler = jest.fn();
    const ottieniHandler = jest.fn();

    server.use(
      http.post('/OTTIENI_PASSWORD_UTENTE', () => {
        ottieniHandler();
        // hash di UN'ALTRA password: passwordIsCorrect fallisce
        return HttpResponse.json({ result: [{ password: encryptPassword('AltraPassword1!', ALTRO_SALT, PEPPER_HEX), salt_hex: ALTRO_SALT }] });
      }),
      http.post('/MODIFICA_PROFILO_UTENTE', () => {
        modificaHandler();
        return HttpResponse.json({}, { status: 200 });
      }),
    );

    await inviaConPassword('PasswordSbagliata1!');

    // la verifica password è avvenuta...
    await waitFor(() => expect(ottieniHandler).toHaveBeenCalledTimes(1));
    // ...ma la modifica NON parte
    expect(modificaHandler).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalledWith('Profilo modificato con successo.');
  });

  test('TC_PROFILO_003 - Errore server (500) in modifica: alert di fallimento, nessuna navigazione', async () => {
    server.use(
      http.post('/OTTIENI_PASSWORD_UTENTE', () =>
        HttpResponse.json({ result: [{ password: HASH_ATTUALE, salt_hex: SALT }] })),
      http.post('/MODIFICA_PROFILO_UTENTE', () =>
        new HttpResponse(null, { status: 500 })),
    );

    await inviaConPassword(PASSWORD_ATTUALE);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Modifica profilo fallita.');
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('TC_PROFILO_004 - Validazione: password attuale vuota, nessuna richiesta HTTP', async () => {
    const ottieniHandler = jest.fn();
    server.use(
      http.post('/OTTIENI_PASSWORD_UTENTE', () => {
        ottieniHandler();
        return HttpResponse.json({ result: [{ password: HASH_ATTUALE, salt_hex: SALT }] });
      }),
    );

    await inviaConPassword('');

    expect(ottieniHandler).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  test('TC_PROFILO_005 - Vista card: CardProfilo renderizzato', () => {
    renderWithProviders(<Profilo />, {
      preloadedState: { ...preloadedState, stile: { value: { vistaForm: 'card' } } },
    });
    expect(screen.getByTestId('vista-card-profilo')).toBeInTheDocument();
    expect(screen.queryByTestId('vista-row-profilo')).not.toBeInTheDocument();
    expect(screen.getByTestId('form-profilo-mock')).toBeInTheDocument();
  });

  test('TC_PROFILO_006 - Vista row: RowProfilo renderizzato', () => {
    renderWithProviders(<Profilo />, {
      preloadedState: { ...preloadedState, stile: { value: { vistaForm: 'row' } } },
    });
    expect(screen.getByTestId('vista-row-profilo')).toBeInTheDocument();
    expect(screen.queryByTestId('vista-card-profilo')).not.toBeInTheDocument();
    expect(screen.getByTestId('form-profilo-mock')).toBeInTheDocument();
  });
});