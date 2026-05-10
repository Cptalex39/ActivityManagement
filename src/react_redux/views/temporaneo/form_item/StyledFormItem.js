// node_modules
import styled from 'styled-components';
// React e Redux
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { 
  Trash2, Pencil, Save, Search, ChevronUp, ChevronDown, LogIn, Download, X, 
  Eye, EyeClosed, Euro 
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const grandezzaIcona = 50;

export const StyledForm = styled(Card)`
  background-color: #111111;
  overflow: hidden;
  border: 5px solid #000000;
  border-radius: 40px;
  margin-left: 30%;
  margin-right: 30%;

  color: white;
  text-align: center;
`;

export const StyledHeader = styled(Card.Header)`
  color: #ffffff;
  background-color: #000000;
  border: 5px solid #000000;
  min-height: 70px;
`;

export const StyledListGroupItem = styled(ListGroup.Item)`
  color: #ffffff;
  background-color: transparent;
  border: 5px solid #000000;
  min-height: 70px;
`;

export const SlideContainer = styled.div`
  overflow: hidden;
  transition: max-height 1.5s ease-out;
`;


export const StyledRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
  padding-left: 3%;
  padding-right: 3%;
`;

export const StyledCol = styled(Col)`
  position: relative; 
  color: #FFFFFF;
  border-radius: 40px;
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: auto;
  min-height: 50px;
  min-width: 300px;
`;

export const StyledLabel = styled.label`
  width: 100%;
  color: #ffffff;
  background-color: transparent;
  border-radius: 40px;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  min-height: 70px;
  margin-top: 2%;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  color: #ffffff;
  background-color: transparent;
  border: 5px solid #000000;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  min-height: 70px;
  margin-bottom: 20px;
`;

export const StyledTextAreaBlock = styled(StyledTextArea)`
  background-color: #000000;
`;

export const StyledTextAreaModifica = styled(StyledTextArea)`
  background-color: #0050EF;
`;

export const StyledTextAreaElimina = styled(StyledTextArea)`
  background-color: #500000;
`;

export const StyledInput = styled.input`
  width: 100%;
  color: #ffffff;
  background-color: transparent;
  border: 5px solid #000000;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  min-height: 70px;
  margin-bottom: 20px;
`;

export const StyledInputBlock = styled(StyledInput)`
  background-color: #000000;
`;

export const StyledInputModifica = styled(StyledInput)`
  background-color: #0050EF;
`;

export const StyledInputElimina = styled(StyledInput)`
  background-color: #500000;
`;

const styledIconNotSelected = `
  color: #FFFFFF;
  cursor: pointer;
  transition: 0.5s all ease-out;
`;

const styledIconNotSelectedBlue = `
  ${styledIconNotSelected}
  &:hover {
    color: #0050EF;
  }
`;

const styledIconNotSelectedRed = `
  ${styledIconNotSelected}
  &:hover {
    color: #500000;
  }
`;

export const StyledSaveNotSelected = styled(Save)`
  ${styledIconNotSelectedBlue}
`;

export const StyledSaveNotSelected2 = styled(Save)`
  ${styledIconNotSelected}
`;

export const StyledSaveSelected2 = styled(Save)`
  ${styledIconNotSelected}
  color: #0050EF;
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
  ${styledIconNotSelectedBlue}
`;

export const StyledSearchNotSelected2 = styled(Search)`
  ${styledIconNotSelected}
`;

export const StyledSearchSelected2 = styled(Search)`
  ${styledIconNotSelected}
  color: #0050EF;
`;

export const StyledEuroNotSelected = styled(Euro)`
  color: #FFFFFF;
  transition: 0.5s all ease-out;
`;

export const StyledArrowTopNotSelected = styled(ChevronUp)`
  ${styledIconNotSelectedBlue}
`;

export const StyledArrowBottomNotSelected = styled(ChevronDown)`
  ${styledIconNotSelectedBlue}
`;

export const StyledLoginNotSelected = styled(LogIn)`
  ${styledIconNotSelectedBlue}
`;

export const StyledFileIconNotSelected = styled(FontAwesomeIcon)`
  color: #FFFFFF;
`;

export const StyledFileIconNotSelected2 = styled(FontAwesomeIcon)`
  ${styledIconNotSelected}
`;

export const StyledFileIconSelected2 = styled(FontAwesomeIcon)`
  ${styledIconNotSelected}
  color: #0050EF;
`;

export const StyledDownloadNotSelected = styled(Download)`
  ${styledIconNotSelectedBlue}
`;

export const StyledDeleteNotSelected = styled(X)`
  ${styledIconNotSelectedRed}
`;

export const StyledTrashNotSelected = styled(Trash2)`
  ${styledIconNotSelectedRed}
`;

export const StyledButton =  styled.button`
  border-radius: 40px;
  border: 5px solid #000000;
  background-color: #000000;
  color: #FFFFFF;
  text-align: center;  
  padding: 2% 15%;
  cursor: pointer;
`;

export const BottoneBluNonSelezionato =  styled(StyledButton)`
  transition: 0.5s all ease-out;
  &:hover {
    background-color: #0050EF;
    color: #FFFFFF;
  }
`;

export const BottoneRossoNonSelezionato =  styled(StyledButton)`
  transition: 0.5s all ease-out;
  &:hover {
    background-color: #500000;
    color: #FFFFFF;
  }
`;

export const BottoneBluSelezionato =  styled(StyledButton)`
  background-color: #0050EF;
  &:hover {
    background-color: #000000;
    color: #FFFFFF;
  }
`;

export const BottoneRossoSelezionato =  styled(StyledButton)`
  background-color: #500000;
  &:hover {
    background-color: #000000;
    color: #FFFFFF;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  min-height: 70px;
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
  padding: 10px;
`;

export const StyledPencilNotSelected = styled(Pencil)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

const StyledComponents = {
  StyledListGroupItem, StyledRow, StyledCol, StyledSaveNotSelected, grandezzaIcona, 
  StyledSearchNotSelected, StyledArrowTopNotSelected, StyledArrowBottomNotSelected, StyledLoginNotSelected, StyledPencilNotSelected, 
  StyledLabel, StyledInputBlock, StyledInputModifica, StyledInputElimina, StyledTextAreaBlock, 
  StyledTextAreaModifica, StyledTextAreaElimina, StyledForm, StyledHeader, SlideContainer, 
  StyledSpanErrore, StyledSelectBlock, StyledSelectModifica, StyledSelectElimina, StyledEyeClosedNotSelected, 
  StyledEyeOpenNotSelected, StyledEuroNotSelected, StyledFileIconNotSelected, StyledDownloadNotSelected, StyledTrashNotSelected, 
  StyledSearchNotSelected2, StyledSaveNotSelected2, StyledSearchSelected2, StyledSaveSelected2, StyledFileIconNotSelected2, 
  StyledFileIconSelected2
};

export default StyledComponents;









