// importa bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// React e Redux
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

// React-Bootstrap
import Navbar from 'react-bootstrap/Navbar';

// icone
import { ShoppingCart } from "lucide-react";

// immagini
import logo from "../img/Logo.png";
import italiano from "../img/img_icons/italiano.png";
import inglese from "../img/img_icons/inglese.png";

// Styled Components
import {
  StyledNavLeft,
  StyledNavCenter,
  StyledNavRight,
  StyledNavLink,
  StyledNavLinkHome
} from '../components/navbar/StyledNavbarApp';

// actions redux
import { AttivitaActions } from '../../actions/AttivitaActions';

export const CustomerNavbar = ({ setClienteLogged, setPagina, carrello }) => {

  const navigate = useNavigate();
  const attivitaState = useSelector((state) => state.attivita.value);
  const attivitaActions = new AttivitaActions();

  // logout cliente
  const handleLogoutCliente = () => {
    setClienteLogged(false);
    navigate('/');
  };

  // blocco menu tasto destro
  const handleContextMenu = (e) => e.preventDefault();

  // quantità totale prodotti carrello
  const totaleCarrello = carrello.reduce((sum, item) => sum + item.quantita, 0);

  return (
    <Navbar
      expand="lg"
      style={{
        position: "relative", // serve per centrare il logo
        padding: "10px 5%",
        backgroundColor: "#000000"
      }}
    >

      {/* SINISTRA */}
      <StyledNavLeft>
        {/* Puoi aggiungere link o pulsanti qui */}
      </StyledNavLeft>

      {/* LOGO CENTRALE */}
      <StyledNavCenter>
        <StyledNavLinkHome as={NavLink} to="/">
          <img src={logo} alt="Logo" style={{ width: "70px" }} />
        </StyledNavLinkHome>
      </StyledNavCenter>

      {/* DESTRA */}
      <StyledNavRight>

        {/* Catalogo */}
        <StyledNavLink
          as={NavLink}
          to="#"
          onClick={() => setPagina("catalogo")}
        >
          Catalogo
        </StyledNavLink>

        {/* Carrello */}
        <div
          style={{
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            marginRight: "15px"
          }}
          onClick={() => setPagina("carrello")}
        >
          <ShoppingCart size={28} color="white" />

          {totaleCarrello > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 7px",
                fontSize: "12px"
              }}
            >
              {totaleCarrello}
            </span>
          )}
        </div>

        {/* Profilo */}
        <StyledNavLink
          as={NavLink}
          to="#"
          onClick={() => setPagina("profilo")}
        >
          Profilo
        </StyledNavLink>

        {/* Logout */}
        <StyledNavLink
          as={NavLink}
          to="/"
          onClick={handleLogoutCliente}
        >
          Logout
        </StyledNavLink>

        {/* Lingua */}
        <StyledNavLink
          as={NavLink}
          to="#"
          onClick={(e) => attivitaActions.modificaLingua(e)}
          onContextMenu={handleContextMenu}
        >
          {attivitaState.lingua === "italiano"
            ? <img src={italiano} style={{ width: "50px" }} alt="Italiano" />
            : <img src={inglese} style={{ width: "50px" }} alt="English" />
          }
        </StyledNavLink>

      </StyledNavRight>
    </Navbar>
  );
};