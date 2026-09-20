import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import stileSliceReducer from "../../../../store/slice/StileSlice.js";
import Login from "../../../../view/autenticazione_view/Login.jsx";

const mockStore = configureStore({
  reducer: { stileSliceReducer },
  preloadedState: {
    stileSliceReducer: { value: { vistaForm: "form" } },
  },
});

test("Verifica che il form Login venga renderizzato correttamente.", () => {
  render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Invia")).toBeInTheDocument();
});

test("Simula la compilazione e sottomissione del form", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  const inputUsername = screen.getByPlaceholderText("Inserisci il tuo nome utente");
  fireEvent.change(inputUsername, { target: { value: "Gianluca" } });

  const button = screen.getByText("Invia");
  fireEvent.click(button);
});
