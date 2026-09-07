import { handleInsert, handleSearch, handleEdit, handleSearchRangeFile } from '../react_redux/views/operazioni/SpesaOperazioni';

describe('SpesaOperazioni - Unit Tests ad Alta Copertura', () => {
  let mockEvent;
  let mockActions;

  beforeEach(() => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    mockEvent = { preventDefault: jest.fn() };
    
    mockActions = {
      inserimentoSpesa: jest.fn(),
      ricercaSpese: jest.fn(),
      modificaSpese: jest.fn(),
      handleSearchSpeseRangeFile: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handleInsert - Caso di Successo', async () => {
    mockActions.inserimentoSpesa.mockResolvedValue({ isOK: true });
    await handleInsert(mockEvent, mockActions, {}, jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("andato a buon fine"));
  });

  test('handleInsert - Annullato da operatore', async () => {
    window.confirm.mockReturnValue(false);
    await handleInsert(mockEvent, mockActions, {}, jest.fn());
    expect(window.alert).toHaveBeenCalledWith("Salvataggio annullato.");
  });

  test('handleInsert - Fallimento 400 spesa esistente', async () => {
    mockActions.inserimentoSpesa.mockResolvedValue({ isOK: false, responseStatus: 400 });
    await handleInsert(mockEvent, mockActions, {}, jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("gia' presente"));
  });

  test('handleInsert - Fallimento generico del server', async () => {
    mockActions.inserimentoSpesa.mockResolvedValue({ isOK: false, responseStatus: 500 });
    await handleInsert(mockEvent, mockActions, {}, jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("riprova più tardi"));
  });

  test('handleSearch - Caso di Successo', async () => {
    mockActions.ricercaSpese.mockResolvedValue({ isOK: true });
    await handleSearch(mockEvent, mockActions, {});
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('handleSearch - Caso di Fallimento', async () => {
    mockActions.ricercaSpese.mockResolvedValue({ isOK: false });
    await handleSearch(mockEvent, mockActions, {});
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Errore durante la ricerca"));
  });

  test('handleEdit - Successo e gestione esiti ciclici del ciclo for', async () => {
    mockActions.modificaSpese.mockResolvedValue({
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

  test('handleSearchRangeFile - Successo', async () => {
    mockActions.handleSearchSpeseRangeFile.mockResolvedValue({ isOK: true });
    await handleSearchRangeFile(mockEvent, mockActions, 'pdf', jest.fn(), {}, [], jest.fn());
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('handleSearchRangeFile - Fallimento', async () => {
    mockActions.handleSearchSpeseRangeFile.mockResolvedValue({ isOK: false });
    await handleSearchRangeFile(mockEvent, mockActions, 'pdf', jest.fn(), {}, [], jest.fn());
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Errore durante il recupero"));
  });
});
