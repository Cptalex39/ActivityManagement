// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// React e Redux
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
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
import { AutenticazioneActions } from "../../../actions/AutenticazioneActions"
import { StileActions } from '../../../actions/StileActions';
import { AttivitaActions } from '../../../actions/AttivitaActions';

export const NavbarApp = () => {
  const autenticazioneActions = new AutenticazioneActions();
  const attivitaActions = new AttivitaActions();
  const stileActions = new StileActions()
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const stileState = useSelector((state) => state.stile.value);
  const [dropdownClienti, setDropdownClienti] = useState(false);
  const [dropdownProfessionisti, setDropdownProfessionisti] = useState(false);
  const [dropdownLavori, setDropdownLavori] = useState(false);
  const [dropdownSpese, setDropdownSpese] = useState(false);
  const [dropdownStile, setDropdownStile] = useState(false);
  const [dropdownSfondo, setDropdownSfondo] = useState(false);
  const [dropdownItem, setDropdownItem] = useState(false);
  const [dropdownForm, setDropdownForm] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = (setDropdown) => {
    setDropdown(true);
  };
  
  const handleMouseLeave = (setDropdown) => {
    setDropdown(false);
  };  
  
  const applicaStileBody = () => {
    if (stileState.pathImg !== null) {
      document.body.style.backgroundImage = `url(${stileState.pathImg})`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
      document.body.style.height = '100vh';
  
      // Nasconde solo lo scorrimento orizzontale
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100%';
      document.documentElement.style.maxHeight = '100%';
    } 
    else if (stileState.coloreRGB !== null) {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = stileState.coloreRGB;
  
      // Nasconde solo lo scorrimento orizzontale
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100%';
      document.documentElement.style.maxHeight = '100%';
    } 
    else {
      alert(attivitaState.lingua === "italiano" ? "Errore." : "Error.");
    }
  }

  const handleContextMenu = (event) => {
    event.preventDefault(); // Impedisce il menu contestuale
  };
  
  useEffect(() => {
    applicaStileBody();
  }, [stileState]);

  return (
    <>
      <Navbar expand="lg">
        <StyledNavLeft>
          {(autenticazioneState.isLogged === true) ? (
            <>
              <StyledNavLink as={NavLink} to="/clienti" onContextMenu={handleContextMenu}>{attivitaState.lingua === "italiano" ? "Clienti" : "Clients"}</StyledNavLink>
              <StyledNavLink as={NavLink} to="/servizi" onContextMenu={handleContextMenu}>{attivitaState.lingua === "italiano" ? "Servizi" : "Services"}</StyledNavLink>
              <StyledNavLink as={NavLink} to="/lavori" onContextMenu={handleContextMenu}>{attivitaState.lingua === "italiano" ? "Lavori" : "Jobs"}</StyledNavLink>
              <StyledNavLink as={NavLink} to="/spese" onContextMenu={handleContextMenu}>{attivitaState.lingua === "italiano" ? "Spese" : "Expenses"}</StyledNavLink>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;
            </>
          ) : (
            <>
              {/* CR: Link all'area cliente quando non loggato */}
              <StyledNavLink as={NavLink} to="/catalogo" onContextMenu={handleContextMenu}>
                {attivitaState.lingua === "italiano" ? "Area Cliente" : "Client Area"}
              </StyledNavLink>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </>
          )}
        </StyledNavLeft>  

        <StyledNavCenter>
          <StyledNavLinkHome as={NavLink} to="/" onContextMenu={handleContextMenu}>
            <img src={logo} alt="Logo" style={{width:"70px"}}  />
          </StyledNavLinkHome>
        </StyledNavCenter>

        <StyledNavRight>
          <>
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

               
            {(autenticazioneState.isLogged === false) && (
              <StyledNavLink as={NavLink} to="/login" onContextMenu={handleContextMenu}>Login</StyledNavLink>
            )}
            {(autenticazioneState.isLogged === true) && (
              <>
                <StyledNavLink as={NavLink} to="/analisi" onContextMenu={handleContextMenu}>{attivitaState.lingua === "italiano" ? "Analisi" : "Analyses"}</StyledNavLink>
                <StyledNavLink as={NavLink} to="/profilo" onContextMenu={handleContextMenu}>{attivitaState.lingua === "italiano" ? "Profilo" : "Profile"}</StyledNavLink>
                <StyledNavLink as={NavLink} to="/" onClick={(e) => autenticazioneActions.logout(e, navigate)} onContextMenu={handleContextMenu}>Logout</StyledNavLink>
              </>
            )}
            <StyledNavLink as={NavLink} to="#" onClick={(e) => attivitaActions.modificaLingua(e)} onContextMenu={handleContextMenu}>
              {(attivitaState.lingua === "italiano") ? (
                <img src={italiano} style={{width:"50px", height:"auto"}} alt="Italian" />
              ) : (
                <img src={inglese} style={{width:"50px", height:"auto"}} alt="Italian" />
              )}
            </StyledNavLink>
          </>
        </StyledNavRight>  
      </Navbar>
    </>
  );
}