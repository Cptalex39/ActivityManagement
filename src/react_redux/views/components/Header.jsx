// View
import React from 'react';
import { useState } from "react";
import { NavbarAdmin } from "./navbar/NavbarAdmin";
import { useSelector } from "react-redux";
import { NavbarCliente } from "./navbar/NavbarCliente";
import { NavbarGuest } from "./navbar/NavbarGuest";

function Header() {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);

  return (
    <>
      <div className="header-fixed">
        {autenticazioneState.ruolo === "guest" && (
          <NavbarGuest />
        )}
        {autenticazioneState.ruolo === "Amministratore" && (
          <NavbarAdmin />
        )}
        {autenticazioneState.ruolo === "cliente" && (
          <NavbarCliente />
        )}
      </div>
    </>
  )
}

export default Header;









