// node_modules
import styled from 'styled-components';

// React Bootstrap
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

// ====================== NAV LEFT ======================
export const StyledNavLeft = styled(Nav)`
  background-color: transparent;
  margin-right: auto;
  display: flex;
  align-items: center;
`;

// ====================== NAV CENTER ======================
export const StyledNavCenter = styled(Nav)`
  background-color: transparent;
  position: absolute;      // logo centrato
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 1;
`;

// ====================== NAV RIGHT ======================
export const StyledNavRight = styled(Nav)`
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-end; // elementi allineati a destra
  flex: 1;                    // occupa tutto lo spazio a destra
  height: 100%;
  gap: 20px;                  // distanza uniforme tra link
`;

// ====================== NAV DROPDOWN ======================
export const StyledNavDropdown = styled(NavDropdown)`
  .dropdown-menu {
    background-color: #000000;
  }

  margin-right: 20px;

  .dropdown-toggle {
    color: #FFFFFF !important;
    font-weight: bold !important;

    &.show,
    &:hover,
    &:focus,
    &:active {
      background-color: #0050EF !important;
    }
  }
`;

export const StyledNavDropdownItem = styled(NavDropdown.Item)`
  color: #FFFFFF;
  font-weight: bold;
  text-decoration: none;
  display: block;
  text-align: center;

  &:hover {
    background-color: #0050EF;
    color: #FFFFFF;
  }
`;

// ====================== CONTAINERS ======================
export const StyledDropdownContainer = styled.div`
  display: flex;
  text-align: center;
`;

export const StyledSubMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
`;

// ====================== NAV LINKS ======================
export const StyledNavLink = styled(Nav.Link)`
  color: #FFFFFF;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 10px 20px;

  &:hover {
    background-color: #0050EF;
    color: white;
  }
`;

export const StyledNavLinkHome = styled(Nav.Link)`
  color: #FFFFFF;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: center;
  padding-bottom: 0;
  margin-left: 20px;
  transition: 0.5s all ease-out;

  &:hover {
    color: #0050EF;
  }
`;