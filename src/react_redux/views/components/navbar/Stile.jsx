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
import logo from "../../img/Logo.png";
import { 
  StyledNavLeft, StyledNavCenter, StyledNavRight, StyledNavDropdown, StyledNavDropdownItem, 
  StyledDropdownContainer, StyledSubMenuContainer, StyledNavLink, StyledNavLinkHome
} from './StyledNavbarApp';
// Actions
import { StileActions } from '../../../actions/StileActions';

const Stile = () => {
  const stileActions = new StileActions()
  const attivitaState = useSelector((state) => state.attivita.value);
  const [dropdownStile, setDropdownStile] = useState(false);
  const [dropdownSfondo, setDropdownSfondo] = useState(false);
  const [dropdownItem, setDropdownItem] = useState(false);
  const [dropdownForm, setDropdownForm] = useState(false);

  const handleContextMenu = (event) => {
    event.preventDefault(); // Impedisce il menu contestuale
  };

  return (
    <StyledNavDropdown title={"Stile"} show={dropdownStile}
      onMouseEnter={() => setDropdownStile(true)}
      onMouseLeave={() => setDropdownStile(false)}
      onContextMenu={handleContextMenu}
    >
      <StyledDropdownContainer>
        <StyledSubMenuContainer>
          <StyledNavDropdown title={"Sfondo"} show={dropdownSfondo}
            onMouseEnter={() => setDropdownSfondo(true)}
            onMouseLeave={() => setDropdownSfondo(false)}
          >
            {(dropdownSfondo === true) && (
              <>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", montagne)}
                >
                  Montagne
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", mongolfiera)}
                >
                  Mongolfiera
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", negozio)}
                >
                  Negozio
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", salone)}
                >
                  Salone
                </StyledNavDropdownItem>

                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", scrivania)}
                >
                  Scrivania
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("img", legno)}
                >
                  Legno
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("rgb", "#111111")}
                >
                  Sfondo scuro
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioSfondo("rgb", "#8F8F8F")}
                >
                  Sfondo chiaro
                </StyledNavDropdownItem>
              </>
            )}
          </StyledNavDropdown>
          <StyledNavDropdown title={"Elemento"} show={dropdownItem}
            onMouseEnter={() => setDropdownItem(true)}
            onMouseLeave={() => setDropdownItem(false)}
          >
            {(dropdownItem === true) && (
              <>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("item", "list")}
                >
                  Riga
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("item", "card")}
                >
                  Carta
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
                  onClick={() => stileActions.cambioVista("form", "form")}
                >
                  Form
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("form", "row")}
                >
                  Riga
                </StyledNavDropdownItem>
                <StyledNavDropdownItem as={NavLink} to="#" 
                  onClick={() => stileActions.cambioVista("form", "card")}
                >
                  Carta
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








