// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// React e Redux
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
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
import { AttivitaActions } from '../../../actions/AttivitaActions';

/*** Styled Components aggiuntivi per il carrello badge ***/

const CarrelloBadgeContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const BadgeNumero = styled.span`
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: #FF4444;
  color: #FFFFFF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavbarCliente = () => {
  const attivitaActions = new AttivitaActions();
  const stileActions = new StileActions();
  const attivitaState = useSelector((state) => state.attivita.value);
  const stileState = useSelector((state) => state.stile.value);
  const carrelloState = useSelector((state) => state.carrello.value);
  const [dropdownStile, setDropdownStile] = useState(false);
  const [dropdownSfondo, setDropdownSfondo] = useState(false);
  const navigate = useNavigate();

  // CR: Conta items nel carrello
  const getNumeroItemsCarrello = () => {
    let count = 0;
    for (const item of carrelloState.items) {
      count += item.quantita;
    }
    return count;
  };

  const applicaStileBody = () => {
    if (stileState.pathImg !== null) {
      document.body.style.backgroundImage = `url(${stileState.pathImg})`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
      document.body.style.height = '100vh';
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100%';
      document.documentElement.style.maxHeight = '100%';
    } 
    else if (stileState.coloreRGB !== null) {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = stileState.coloreRGB;
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100%';
      document.documentElement.style.maxHeight = '100%';
    }
  }

  const handleContextMenu = (event) => {
    event.preventDefault();
  };
  
  useEffect(() => {
    applicaStileBody();
  }, [stileState]);

  const numItems = getNumeroItemsCarrello();

  return (
    <>
      <Navbar expand="lg">
        {/* Sinistra: link area cliente */}
        <StyledNavLeft>
          <StyledNavLink as={NavLink} to="/catalogo" onContextMenu={handleContextMenu}>
            {attivitaState.lingua === "italiano" ? "Catalogo" : "Catalog"}
          </StyledNavLink>
          <StyledNavLink as={NavLink} to="/carrello" onContextMenu={handleContextMenu}>
            <CarrelloBadgeContainer>
              {attivitaState.lingua === "italiano" ? "Carrello" : "Cart"}
              {numItems > 0 && <BadgeNumero>{numItems}</BadgeNumero>}
            </CarrelloBadgeContainer>
          </StyledNavLink>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;
        </StyledNavLeft>  

        {/* Centro: logo (torna alla home) */}
        <StyledNavCenter>
          <StyledNavLinkHome as={NavLink} to="/" onContextMenu={handleContextMenu}>
            <img src={logo} alt="Logo" style={{width:"70px"}} />
          </StyledNavLinkHome>
        </StyledNavCenter>

        {/* Destra: stile, lingua, link admin */}
        <StyledNavRight>
          {/* Dropdown Stile (solo sfondo, semplificato per il cliente) */}
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
              </StyledSubMenuContainer>
            </StyledDropdownContainer>
          </StyledNavDropdown>

          {/* Link al login admin */}
          <StyledNavLink as={NavLink} to="/login" onContextMenu={handleContextMenu}>
            {attivitaState.lingua === "italiano" ? "Area Admin" : "Admin Area"}
          </StyledNavLink>

          {/* Cambio lingua */}
          <StyledNavLink as={NavLink} to="#" onClick={(e) => attivitaActions.modificaLingua(e)} onContextMenu={handleContextMenu}>
            {(attivitaState.lingua === "italiano") ? (
              <img src={italiano} style={{width:"50px", height:"auto"}} alt="Italiano" />
            ) : (
              <img src={inglese} style={{width:"50px", height:"auto"}} alt="English" />
            )}
          </StyledNavLink>
        </StyledNavRight>  
      </Navbar>
    </>
  );
}
