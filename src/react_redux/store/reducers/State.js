import { loadFromLocalStorage } from "./LocalStorage";

export const getInitialStateWithStorage = (value, nameItem) => {
  return loadFromLocalStorage(nameItem) || {
    value: value
  };
};

export const getInitialStateWithoutStorage = (value, nameItem) => {
  return {
    value: value
  };
};









