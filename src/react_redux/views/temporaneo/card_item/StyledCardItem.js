// React
import styled from 'styled-components';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { 
  Trash2, Pencil, Save, Search, ChevronUp, ChevronDown, LogIn, Download, X, 
  EyeClosed, Eye, Euro, Plus
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const grandezzaIcona = 50;

export const StyledCard = styled(Card)`
  width: 18rem;
  background-color: transparent;
  overflow: hidden;
  border-radius: 40px;
  color: white;
  text-align: center;
  padding: 0;
  border: transparent;
`;

export const StyledRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
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

export const StyledCardHeader = styled(Card.Header)`
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
  transition: max-height 2s ease-out;
  background-color: #111111;
  border: 10px solid #000000;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  color: #ffffff;
  background-color: transparent;
  border: 5px solid #000000;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  min-height: 70px;
`;

export const StyledTextAreaBlock = styled(StyledTextArea)`
  background-color: #111111;
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
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  min-height: 70px;
`;

export const StyledInputBlock = styled(StyledInput)`
  background-color: #111111;
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
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-top:10px;
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

export const StyledArrowTopNotSelected = styled(ChevronUp)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledArrowBottomNotSelected = styled(ChevronDown)`
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

export const StyledPencilNotSelected2 = styled(Pencil)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #0050EF;
  }
`;

export const StyledTrashNotSelected2 = styled(Trash2)`
  ${styledIconNotSelected}
  transition: 0.5s all ease-out;
  &:hover {
    color: #500000;
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
  color: #FFFFFF;
  padding: 10px;
`;

const StyledComponents = {
  StyledPencilNotSelected, StyledPencilSelected, grandezzaIcona, StyledTrashNotSelected, StyledTrashSelected, 
  StyledListGroupItem, StyledRow, StyledCol, StyledSaveNotSelected, StyledEyeOpenNotSelected, 
  StyledEyeClosedNotSelected, StyledSearchNotSelected, StyledArrowTopNotSelected, StyledArrowBottomNotSelected, StyledFileIconNotSelected, 
  StyledDownloadNotSelected, StyledTrashNotSelected2, StyledLoginNotSelected, StyledPencilNotSelected2, StyledSelectBlock, 
  StyledSelectModifica, StyledSelectElimina, StyledInputBlock, StyledInputModifica, StyledInputElimina, 
  StyledTextAreaBlock, StyledTextAreaModifica, StyledTextAreaElimina, StyledCard, StyledCardHeader, 
  SlideContainer, StyledSpanErrore, StyledEuroNotSelected, StyledFileIconSelected2
};

export default StyledComponents;











