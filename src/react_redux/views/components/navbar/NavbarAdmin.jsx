import Stile from "./Stile";
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// React e Redux
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
// Views
import logo from "../../img/Logo.png";
import { StyledNavLeft, StyledNavCenter, StyledNavRight, StyledNavLink, StyledNavLinkHome } from './StyledNavbarApp';
// Actions
import { AutenticazioneActions } from "../../../actions/AutenticazioneActions"

export const NavbarAdmin = () => {
  const autenticazioneActions = new AutenticazioneActions();
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const stileState = useSelector((state) => state.stile.value);
  const navigate = useNavigate();

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
          {(autenticazioneState.isLogged === true) ? (
            <>
              <StyledNavLink as={NavLink} to="/clienti" onContextMenu={handleContextMenu}>Clienti</StyledNavLink>
              <StyledNavLink as={NavLink} to="/servizi" onContextMenu={handleContextMenu}>Servizi</StyledNavLink>
              <StyledNavLink as={NavLink} to="/ordini" onContextMenu={handleContextMenu}>Ordini</StyledNavLink>
              <StyledNavLink as={NavLink} to="/spese" onContextMenu={handleContextMenu}>Spese</StyledNavLink>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;
            </>
          ) : (
            <>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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

            <Stile />
               
            {(autenticazioneState.isLogged === false) && (
              <>
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
            )}
            {(autenticazioneState.isLogged === true) && (
              <>
                <StyledNavLink as={NavLink} to="/analisi" onContextMenu={handleContextMenu}>Analisi</StyledNavLink>
                <StyledNavLink as={NavLink} to="/profilo" onContextMenu={handleContextMenu}>Profilo</StyledNavLink>
                <StyledNavLink as={NavLink} to="/" onClick={(e) => autenticazioneActions.logout(e, navigate)} onContextMenu={handleContextMenu}>Logout</StyledNavLink>
              </>
            )}
          </>
        </StyledNavRight>  
      </Navbar>
    </>
  );
}