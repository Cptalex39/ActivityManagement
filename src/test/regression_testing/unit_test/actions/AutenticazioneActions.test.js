import { AutenticazioneActions } from "../../../../react_redux/actions/AutenticazioneActions";
import { autenticazioneSliceActions } from "../../../../react_redux/store/reducers/AutenticazioneReducer";

// Mock del dispatch di Redux
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe("Vari test su 'logout'", () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
    jest.clearAllMocks();
  });

  /** RT_UT_AutA_Logout_01 **/
  test('logout: fa il dispatch di logout e naviga verso "/"', () => {
    const mockNavigate = jest.fn();

    autenticazioneActions.logout(mockNavigate);

    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.logout()
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});









