// node_modules
import styled from 'styled-components';
// React
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { 
  Trash2, Pencil, Save, Search, ChevronLeft, ChevronRight, LogIn, Download, X, 
  Eye, EyeClosed, Euro 
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const grandezzaIcona = 50;

export const StyledRow = styled(Row)`
  display: flex;
  align-items: stretch; 
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 3%;
  padding-right: 3%;
`;

export const StyledCol = styled(Col)`
  flex: 1;
  display: flex;
  flex-direction: column; /* Organizza il contenuto verticalmente */
  align-items: flex-start; /* Allinea gli elementi al bordo sinistro (se necessario) */
  justify-content: flex-start; /* Allinea gli elementi in alto */
  text-align: center;
  border-radius: 40px;
  padding: 10px; /* Aggiunge spazi interni */
  margin: 10px;
  min-height: 100px;
  color: #FFFFFF;
`;



export const StyledColAnimato = styled(StyledCol)`
  max-height: ${(props) => (props.isVisible ? '1000px' : '0')}; 
  overflow: hidden;
  transition: max-height 1s ease-out;
`;


export const StyledColBlack = styled(StyledCol)`
  border: 5px solid #000000;
  background-color: #000000;
`;

export const StyledColOperazioni = styled(StyledCol)`
  border: 5px solid #000000;
  background-color: #000000;
  min-width: 230px;
  max-width: 230px;
  min-height: 80px;
  max-height: 80px;
`;

export const StyledColBlue = styled(StyledCol)`
  border: 5px solid #000000;
  background-color: #0050EF;
`;

export const StyledColRed = styled(StyledCol)`
  border: 5px solid #000000;
  background-color: #500000;
`;

export const SlideContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;


const StyledTextAreaInputAndColButtons = `
  flex: 1;
  display: flex;
  align-items: center; /* Centro verticale */
  justify-content: center; /* Centro orizzontale */
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: inherit;
  padding: 0; 
  margin: 0;
  text-align: center; /* Centro orizzontale del testo */
  overflow: hidden; /* Nasconde l'overflow */
  resize: vertical;
  border-radius: 40px;
  min-height: 50px;
  border: 5px solid #000000; 
  color: #FFFFFF;
  padding: auto;
`

export const StyledTextArea = styled.textarea`
  ${StyledTextAreaInputAndColButtons}
`

export const StyledTextAreaBlock = styled(StyledTextArea)`
  background-color: #111111;
`

export const StyledTextAreaModifica = styled(StyledTextArea)`
  background-color: #0050EF;
`

export const StyledTextAreaElimina = styled(StyledTextArea)`
  background-color: #500000;
`

export const StyledInput = styled.input`
  ${StyledTextAreaInputAndColButtons}
`

export const StyledInputBlock = styled(StyledInput)`
  background-color: #111111;
`

export const StyledInputModifica = styled(StyledInput)`
  background-color: #0050EF;
`

export const StyledInputElimina = styled(StyledInput)`
  background-color: #500000;
`

export const StyledButton = styled.button`
  ${StyledTextAreaInputAndColButtons}
`

const StyledButtonsModificaAndElimina = `
  margin-left: 10%;
  margin-right: 10%;
  border: 5px solid #000000;
  background-color: #000000;
  cursor: pointer;  
  transition: 0.5s all ease-out;
`;

export const StyledButtonModifica = styled(StyledButton)`
  ${StyledButtonsModificaAndElimina}
  &:hover {
    background-color: #0050EF;
    color: #FFFFFF;
  }
`

export const StyledButtonElimina = styled(StyledButton)`
  ${StyledButtonsModificaAndElimina}
  &:hover {
    background-color: #500000;
    color: #FFFFFF;
  }
`

const styledIconNotSelected = `
  color: #FFFFFF;
  cursor: pointer;
`;

export const StyledSaveNotSelected = styled(Save)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledEyeClosedNotSelected = styled(EyeClosed)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
`;

export const StyledEyeOpenNotSelected = styled(Eye)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  color: #0050EF;
`;

export const StyledSearchNotSelected = styled(Search)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledEuroNotSelected = styled(Euro)`
  color: #FFFFFF;
  transition: 0.5s all ease-out;
`;

export const StyledArrowLeftNotSelected = styled(ChevronLeft)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledArrowRightNotSelected = styled(ChevronRight)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledLoginNotSelected = styled(LogIn)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledPencilNotSelected = styled(Pencil)`
  ${styledIconNotSelected}
`;

export const StyledPencilNotSelectedModificaProfilo = styled(Pencil)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledPencilSelected = styled(Pencil)`
  color: #0050EF;
  cursor: pointer;
`;

export const StyledTrashNotSelected = styled(Trash2)`
  ${styledIconNotSelected}
`;

export const StyledTrashSelected = styled(Trash2)`
  color: #500000;
  cursor: pointer;
`;

export const StyledFileIconNotSelected = styled(FontAwesomeIcon)`
  color: #FFFFFF;
`;

export const StyledFileIconSelected2 = styled(FontAwesomeIcon)`
  ${styledIconNotSelected}
  color: #0050EF;
`;

export const StyledDownloadNotSelected = styled(Download)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledDeleteNotSelected = styled(X)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #500000;
  }
`;

export const StyledTrashNotSelected2 = styled(Trash2)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #500000;
  }
`;

export const StyledSelect =  styled.select`
  cursor: pointer;
  width: 100%;
  border-radius: 40px;
  background-color: #0050EF;
  border: 5px solid #000000;
  color: #FFFFFF;
  text-align: center;
`;

export const StyledSelectBlock = styled(StyledSelect)`
  background-color: #111111;
`;

export const StyledSelectModifica = styled(StyledSelect)`
  background-color: #0050EF;
`;

export const StyledSelectElimina = styled(StyledSelect)`
  background-color: #500000;
`;

export const StyledOption =  styled.option`
  background-color: #0050EF;
  &:hover {
    background-color: #0050EF;
  }
`;

export const StyledSpanErrore =  styled.span`
  color: #FF0000;
  border-radius: 40px;
  padding: 10px;
`;

const StyledComponents = {
  StyledPencilNotSelected, StyledPencilSelected, grandezzaIcona, StyledTrashNotSelected, StyledTrashSelected, 
  StyledColOperazioni, StyledSaveNotSelected, StyledSearchNotSelected, StyledArrowLeftNotSelected, StyledArrowRightNotSelected, 
  StyledFileIconNotSelected, StyledDownloadNotSelected, StyledTrashNotSelected2, StyledLoginNotSelected, StyledPencilNotSelectedModificaProfilo, 
  StyledInputBlock, StyledInputModifica, StyledInputElimina, StyledTextAreaBlock, StyledTextAreaModifica, 
  StyledTextAreaElimina, StyledRow, StyledCol, StyledSpanErrore, StyledSelectBlock, 
  StyledSelectModifica, StyledSelectElimina, StyledEyeClosedNotSelected, StyledEyeOpenNotSelected, StyledEuroNotSelected, 
  StyledFileIconSelected2 
};

export default StyledComponents;






