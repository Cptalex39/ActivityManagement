export const loadFromLocalStorage = (nameItem) => {
  try {
    const serializedState = localStorage.getItem(nameItem);
    return serializedState ? JSON.parse(serializedState) : undefined;
  } 
  catch (e) {
    console.warn("Errore nel caricamento dello stato dal local storage:", e);
    return undefined;
  }
};

export const saveToLocalStorage = (state, nameItem) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(nameItem, serializedState);
  } 
  catch (e) {
    console.warn("Errore nel salvataggio dello stato nel local storage:", e);
  }
};







