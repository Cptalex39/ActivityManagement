import Stile from './Stile';
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
import logo from "../../img/Logo.png";
import { 
  StyledNavLeft, StyledNavCenter, StyledNavRight, StyledNavDropdown, StyledNavDropdownItem, 
  StyledDropdownContainer, StyledSubMenuContainer, StyledNavLink, StyledNavLinkHome
} from './StyledNavbarApp';
// Actions
import { AutenticazioneActions } from "../../../actions/AutenticazioneActions"
import { StileActions } from '../../../actions/StileActions';
import { AttivitaActions } from '../../../actions/AttivitaActions';

export const NavbarGuest = () => {
  const autenticazioneActions = new AutenticazioneActions();
  const attivitaActions = new AttivitaActions();
  const stileActions = new StileActions()
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const stileState = useSelector((state) => state.stile.value);
  const [dropdownClienti, setDropdownClienti] = useState(false);
  const [dropdownProfessionisti, setDropdownProfessionisti] = useState(false);
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
      alert("Errore.");
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

        </StyledNavLeft>  

        <StyledNavCenter>
          <StyledNavLinkHome as={NavLink} to="/" onContextMenu={handleContextMenu}>
            <img src={logo} alt="Logo" style={{width:"70px"}}  />
          </StyledNavLinkHome>
        </StyledNavCenter>

        <StyledNavRight>
          <>
            <Stile />
               
            <StyledNavLink 
              as={NavLink} 
              to="/login" 
              onContextMenu={handleContextMenu}
            >
              Login
            </StyledNavLink>

            <StyledNavLink 
              as={NavLink} 
              to="/registrazione" 
              onContextMenu={handleContextMenu}
            >
              Registrazione
            </StyledNavLink>
          </>
        </StyledNavRight>  
      </Navbar>
    </>
  );
}