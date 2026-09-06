import { handleInsert, handleSearch, handleEdit } from '../react_redux/views/operazioni/ServizioOperazioni';

describe('ServizioOperazioni - Unit Tests ad Alta Copertura', () => {
  let mockEvent;
  let mockActions;

  beforeEach(() => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    mockEvent = { preventDefault: jest.fn() };
    
    mockActions = {
      inserisciServizio: jest.fn(),
      ricercaServizi: jest.fn(),
      modificaServizi: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handleInsert - Caso di Successo', async () => {
    mockActions.inserisciServizio.mockResolvedValue({ isOK: true });
    await handleInsert(mockEvent, mockActions, { nome: 'Taglio', prezzo: '20', note: '' }, jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("andato a buon fine"));
  });

  test('handleInsert - Annullato da operatore', async () => {
    window.confirm.mockReturnValue(false);
    await handleInsert(mockEvent, mockActions, {}, jest.fn());
    expect(window.alert).toHaveBeenCalledWith("Salvataggio annullato.");
  });

  test('handleInsert - Fallimento 400 servizio esistente', async () => {
    mockActions.inserisciServizio.mockResolvedValue({ isOK: false, responseStatus: 400 });
    await handleInsert(mockEvent, mockActions, { nome: 'Taglio', prezzo: '20', note: '' }, jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("servizio gia' presente"));
  });

  test('handleInsert - Fallimento generico', async () => {
    mockActions.inserisciServizio.mockResolvedValue({ isOK: false, responseStatus: 500 });
    await handleInsert(mockEvent, mockActions, { nome: 'Taglio', prezzo: '20', note: '' }, jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("riprova più tardi"));
  });

  test('handleSearch - Caso di Successo', async () => {
    mockActions.ricercaServizi.mockResolvedValue({ isOK: true });
    await handleSearch(mockEvent, mockActions, {});
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('handleSearch - Caso di Fallimento', async () => {
    mockActions.ricercaServizi.mockResolvedValue({ isOK: false });
    await handleSearch(mockEvent, mockActions, {});
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Errore durante la ricerca"));
  });

  test('handleEdit - Successo e gestione esiti del ciclo for', async () => {
    mockActions.modificaServizi.mockResolvedValue({
      esitiModifiche: [[true, 200], [false, 400], [false, 500]]
    });
    await handleEdit(mockEvent, mockActions, [], [], jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("modifica avvenuta con successo"));
  });

  test('handleEdit - Annullato da confirm', async () => {
    window.confirm.mockReturnValue(false);
    await handleEdit(mockEvent, mockActions, [], [], jest.fn());
    expect(window.alert).toHaveBeenCalledWith("Salvataggio annullato.");
  });
});
