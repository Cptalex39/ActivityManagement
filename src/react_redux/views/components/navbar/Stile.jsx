// React e Redux
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
// Views
import negozio from "../../img/sfondi/negozio.jpg";
import scrivania from "../../img/sfondi/scrivania.jpg";
import legno from "../../img/sfondi/legno.jpg";
import mongolfiera from "../../img/sfondi/mongolfiera.jpg";
import montagne from "../../img/sfondi/montagne.jpg";
import salone from "../../img/sfondi/salone_barbiere.jpg";
import italiano from "../../img/img_icons/italiano.png";
import inglese from "../../img/img_icons/inglese.png";
import logo from "../../img/Logo.png";
import { 
  StyledNavLeft, StyledNavCenter, StyledNavRight, StyledNavDropdown, StyledNavDropdownItem, 
  StyledDropdownContainer, StyledSubMenuContainer, StyledNavLink, StyledNavLinkHome
} from './StyledNavbarApp';
// Actions
import { StileActions } from '../../../actions/StileActions';

const Stile = () => {
  //const autenticazioneActions = new AutenticazioneActions();
  //const attivitaActions = new AttivitaActions();
  const stileActions = new StileActions()
  //const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  //const stileState = useSelector((state) => state.stile.value);
  //const [dropdownClienti, setDropdownClienti] = useState(false);
  //const [dropdownProfessionisti, setDropdownProfessionisti] = useState(false);
  //const [dropdownLavori, setDropdownLavori] = useState(false);
  //const [dropdownSpese, setDropdownSpese] = useState(false);
  const [dropdownStile, setDropdownStile] = useState(false);
  const [dropdownSfondo, setDropdownSfondo] = useState(false);
  const [dropdownItem, setDropdownItem] = useState(false);
  const [dropdownForm, setDropdownForm] = useState(false);
  //const navigate = useNavigate();

  const handleContextMenu = (event) => {
    event.preventDefault(); // Impedisce il menu contestuale
  };

  return (
    <StyledNavDropdown title={attivitaState.lingua === "italiano" ? "Stile" : "Style"} show={dropdownStile}
      onMouseEnter={() => setDropdownStile(true)}
      onMouseLeave={() => setDropdownStile(false)}
      onContextMenu={handleContextMenu}
    >
      <StyledDropdownContainer>
        <StyledSubMenuContainer>
          <StyledNavDropdown title={attivitaState.lingua === "italiano" ? "Sfondo" : "Background"} show={dropdownSfondo}
            onMouseEnter={() => setDropdownSfondo(true)}
            onMouseLeave={() => setDropdownSfondo(false)}
          >
            {(dropdownSfondo === true) && (
              <>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", montagne, attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Montagne" : "Mountains"}
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", mongolfiera, attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Mongolfiera" : "Hot Air Balloon"}
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", negozio, attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Negozio" : "Store"}
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", salone, attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Salone" : "Salon"}
                </StyledNavDropdownItem>

                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", scrivania, attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Scrivania" : "Desk"}
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", legno, attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Legno" : "Wood"}
                </StyledNavDropdownItem>


                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("rgb", "#111111", attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Sfondo scuro" : "Dark background"}
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("rgb", "#8F8F8F", attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Sfondo chiaro" : "Light background"}
                </StyledNavDropdownItem>
              </>
            )}
          </StyledNavDropdown>
          <StyledNavDropdown title={attivitaState.lingua === "italiano" ? "Elemento" : "Item"} show={dropdownItem}
            onMouseEnter={() => setDropdownItem(true)}
            onMouseLeave={() => setDropdownItem(false)}
          >
            {(dropdownItem === true) && (
              <>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("item", "list", attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Riga" : "Row"}
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("item", "card", attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Carta" : "Card"}
                </StyledNavDropdownItem>
              </>
            )}
          </StyledNavDropdown>
          <StyledNavDropdown title="Form" show={dropdownForm}
            onMouseEnter={() => setDropdownForm(true)}
            onMouseLeave={() => setDropdownForm(false)}
          >
            {(dropdownForm === true) && (
              <>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("form", "form", attivitaState.lingua)}
                >
                  Form
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("form", "row", attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Riga" : "Row"}
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("form", "card", attivitaState.lingua)}
                >
                  {attivitaState.lingua === "italiano" ? "Carta" : "Card"}
                </StyledNavDropdownItem>
              </>
            )}
          </StyledNavDropdown>
        </StyledSubMenuContainer>
      </StyledDropdownContainer>
    </StyledNavDropdown>
  );
}

export default Stile;








