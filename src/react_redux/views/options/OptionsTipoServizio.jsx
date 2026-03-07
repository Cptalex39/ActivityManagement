// React
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const StyledSelect = styled.select`
  cursor: pointer;
  width: 100%;
  border-radius: 40px;
  background-color: ${props => props.$bg || '#111111'};
  border: 5px solid #000000;
  color: #FFFFFF;
  text-align: center;
  min-height: 50px;
`;

const OptionsTipoServizio = ({ item, setItem, name, id, readOnly, tipoSelezione }) => {
  const attivitaState = useSelector((state) => state.attivita.value);
  const lingua = attivitaState.lingua;

  // Determina il colore di sfondo in base al tipo_selezione
  const getBg = () => {
    if (tipoSelezione === 2) return '#500000';  // eliminazione
    if (tipoSelezione === 1) return '#0050EF';  // modifica
    return '#111111';  // default
  };

  const handleChange = (e) => {
    if (setItem) {
      setItem(prevState => ({
        ...prevState,
        [name]: e.target.value
      }));
    }
  };

  return (
    <StyledSelect
      name={name}
      id={id}
      value={item[name] || 'servizio'}
      onChange={handleChange}
      disabled={readOnly}
      $bg={getBg()}
    >
      <option value="servizio">{lingua === "italiano" ? "Servizio" : "Service"}</option>
      <option value="prodotto">{lingua === "italiano" ? "Prodotto" : "Product"}</option>
    </StyledSelect>
  );
};

export default OptionsTipoServizio;

// Versione per la ricerca con opzione "Tutti"
export const OptionsTipoServizioRicerca = ({ item, setItem, name, id }) => {
  const attivitaState = useSelector((state) => state.attivita.value);
  const lingua = attivitaState.lingua;

  const handleChange = (e) => {
    if (setItem) {
      setItem(prevState => ({
        ...prevState,
        [name]: e.target.value
      }));
    }
  };

  return (
    <StyledSelect
      name={name}
      id={id}
      value={item[name] || ''}
      onChange={handleChange}
      $bg="#111111"
    >
      <option value="">{lingua === "italiano" ? "Tutti" : "All"}</option>
      <option value="servizio">{lingua === "italiano" ? "Servizio" : "Service"}</option>
      <option value="prodotto">{lingua === "italiano" ? "Prodotto" : "Product"}</option>
    </StyledSelect>
  );
};
