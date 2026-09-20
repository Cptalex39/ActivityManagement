import React from 'react';
import Stile from './Stile';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// React e Redux
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
// Views
import logo from "../../img/Logo.png";
import { StyledNavLeft, StyledNavCenter, StyledNavRight, StyledNavLink, StyledNavLinkHome } from './StyledNavbarApp';

export const NavbarGuest = () => {
  const stileState = useSelector((state) => state.stile.value);

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









