export const handleSearchEntrateLavori = async (actions, setEntrateLavori, datiRicerca, lingua) => {
  const result = await actions.handleSearchEntrateLavori(setEntrateLavori, datiRicerca, lingua);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante la ricerca delle entrate dei lavori, riprova più tardi." : "Error while searching job entries, please try again later.");
  }
};

export const handleSearchUsciteSpese = async (actions, setUsciteSpese, datiRicerca) => {
  const result = await actions.handleSearchUsciteSpese(setUsciteSpese, datiRicerca);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante la ricerca delle uscite delle spese, riprova più tardi." : "Error while searching for expenses outputs, try again later.");
  }
}

export const handleSearchEntrateServizi = async (actions, setEntrateServizi, datiRicerca, lingua) => {
  const result = await actions.handleSearchEntrateServizi(setEntrateServizi, datiRicerca);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante la ricerca delle entrate dei servizi, riprova più tardi." : "Error while searching for service entries, please try again later.");
  }
}









