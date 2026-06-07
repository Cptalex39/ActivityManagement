import Stile from './Stile';
import { ShoppingCart } from "lucide-react";
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
import logo from "../../img/Logo.png";
import { 
  StyledNavLeft, StyledNavCenter, StyledNavRight, StyledNavDropdown, StyledNavDropdownItem, 
  StyledDropdownContainer, StyledSubMenuContainer, StyledNavLink, StyledNavLinkHome
} from './StyledNavbarApp';
// Actions
import { StileActions } from '../../../actions/StileActions';
import { AttivitaActions } from '../../../actions/AttivitaActions';
import { AutenticazioneActions } from '../../../actions/AutenticazioneActions';

/** Styled Components aggiuntivi per il carrello badge **/

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
  const autenticazioneActions = new AutenticazioneActions();
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

  const totaleCarrello = 5;

  return (
    <>
      <Navbar expand="lg">
        <StyledNavLeft>
          <StyledNavLink as={NavLink} to="/nuovo-ordine" onContextMenu={handleContextMenu}>Nuovo ordine</StyledNavLink>
          <StyledNavLink as={NavLink} to="/ordini" onContextMenu={handleContextMenu}>Ordini</StyledNavLink>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;
        </StyledNavLeft>  

        <StyledNavCenter>
          <StyledNavLinkHome as={NavLink} to="/" onContextMenu={handleContextMenu}>
            <img src={logo} alt="Logo" style={{width:"70px"}} />
          </StyledNavLinkHome>
        </StyledNavCenter>

        <StyledNavRight>
          <StyledNavLink as={NavLink} to="/carrello" onContextMenu={handleContextMenu}
            style={{
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              marginRight: "15px", 
            }}
          >
            {getNumeroItemsCarrello() > 0 && (
              <>
                <ShoppingCart size={28} color="white" />
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    color: "#00D100",
                    padding: "0px 5px",
                    fontSize: "30px", 
                    fontWeight: "bold", 
                  }}
                >
                  {getNumeroItemsCarrello()}
                </span>
              </>
            )}
          </StyledNavLink>

          <Stile />
          
          <StyledNavLink as={NavLink} to="/carte" onContextMenu={handleContextMenu}>Carte</StyledNavLink>
          <StyledNavLink as={NavLink} to="/profilo-cliente" onContextMenu={handleContextMenu}>Profilo</StyledNavLink>
          <StyledNavLink as={NavLink} to="/" onClick={(e) => autenticazioneActions.logout(e, navigate)} onContextMenu={handleContextMenu}>Logout</StyledNavLink>
        </StyledNavRight>  
      </Navbar>
    </>
  );
}
