// React e Redux
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Actions
import { AttivitaActions } from '../../actions/AttivitaActions';
// Riutilizzabile
import { CardWidget, CardEntrateItems, CardUsciteItems, CardRicavi } from '@gianlucascisciolo/riutilizzoreact';

const DragAndDrop = ({ initialPositions, onClickWidget }) => {
  const [dragging, setDragging] = useState(false);
  const [positions, setPositions] = useState(initialPositions);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState(null);
  const gridSize = 310; 
  const gridHeight = 410; 
  const attivitaState = useSelector((state) => state.attivita.value);

  const handleDragStart = (e, id) => {
    setDragging(true);
    const rect = e.target.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.dataTransfer.setData('text/plain', id);
    e.target.classList.add('dragging');
    setDraggedElement(e.target);
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    // Rimuove la classe "dragging" dall'elemento trascinato
    if (draggedElement) {
      draggedElement.classList.remove('dragging');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (dragging && draggedElement) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      draggedElement.style.left = `${e.clientX - offset.x - containerRect.left}px`;
      draggedElement.style.top = `${e.clientY - offset.y - containerRect.top}px`;
    }
  };
  
  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDrop={null}
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative'
        }}
      >
        {positions.map((pos, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, pos.id)}
            onDragEnd={handleDragEnd}
            style={{
              width: '310px', // Larghezza fissa delle celle
              height: '410px', // Altezza fissa delle celle
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              cursor: 'pointer'
            }}
          >
            {(pos.tipo === "CardWidget") && (
              (pos.id >= 0) && (
                <CardWidget nome={pos.nome} img={pos.img} backgroundColor={pos.backgroundColor} id={pos.id} onClickWidget={onClickWidget} />
              )
            )}
            {(pos.tipo === "CardEntrateItems") && (
              <CardEntrateItems entrateItems={pos.entrateLavori} lingua={attivitaState.lingua} etichettaIta="Entrate lavori" etichettaEng="Revenue jobs" />
            )}
            {(pos.tipo === "CardUsciteSpese") && (
              <CardUsciteItems usciteItems={pos.usciteSpese} lingua={attivitaState.lingua} etichettaIta="Uscite spese" etichettaEng="Exit expenses" />
            )}
            {(pos.tipo === "CardRicavi") && (
              <CardRicavi entrate={pos.entrateLavori} uscite={pos.usciteSpese} lingua={attivitaState.lingua} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DragAndDrop;

const onClickWidget = (e, widget, navigate) => {
  const attivitaActions = new AttivitaActions();
  e.preventDefault();
  e.stopPropagation();
  if(widget.tipoVisualizzazione !== 2) {
    attivitaActions.modificaWidget(
      widget.nome, 
      (widget.tipoVisualizzazione === 0 || widget.tipoVisualizzazione === 2) ? 1 : 0
    );
  }
  else {
    const widgetNames = [
      "clienti", "clients", 
      "servizi", "services", 
      "lavori", "jobs", 
      "spese", "expenses", 
      "analisi", "analyses", 
      "profilo", "profile"
    ]
    if(widgetNames.includes(widget.nome)) {
      navigate("/" + widget.nome);
    }
  }
}

const WidgetTag = ({ widget, handleDragStart, handleDragEnd }) => {
  const navigate = useNavigate();

  return (
    <div 
      draggable
      onDragStart={(e) => handleDragStart(e, widget.id)}
      onDragEnd={handleDragEnd}
      style={{
        width: '310px',
        height: '410px',
        position: 'absolute',
        left: widget.x,
        top: widget.y,
        cursor: 'grab',
      }}
    >
      <CardWidget 
        nome={widget.nome === "analisi" ? "Analisi" :  widget.nome.charAt(0).toUpperCase() + widget.nome.slice(1)} 
        img={widget.img} 
        backgroundColor={widget.backgroundColor} 
        id={widget.id} 
        onClickWidget={(e) => onClickWidget(e, widget, navigate)} 
      /> 
    </div>
  );
};

export const DragAndDropWidgetHomePage = ({plusCliccato}) => {
  const attivitaState = useSelector((state) => state.attivita.value);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState(null);

  const handleDragStart = (e, id) => {
    setDragging(true);
    const rect = e.target.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.dataTransfer.setData('text/plain', id);
    e.target.classList.add('dragging');
    setDraggedElement(e.target);
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    if (draggedElement) {
      draggedElement.classList.remove('dragging');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (dragging && draggedElement) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      draggedElement.style.left = `${e.clientX - offset.x - containerRect.left}px`;
      draggedElement.style.top = `${e.clientY - offset.y - containerRect.top}px`;
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative'
      }}
    >
      {(plusCliccato === true) ? (<>
        { /** Cliente **/}
        <WidgetTag widget={attivitaState.clienti} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
        { /** Servizio **/}
        <WidgetTag widget={attivitaState.servizi} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
        { /** Lavoro **/}
        <WidgetTag widget={attivitaState.lavori} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
        { /** Spesa **/}
        <WidgetTag widget={attivitaState.spese} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
        { /** analisi **/}
        <WidgetTag widget={attivitaState.analisi} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
        { /** Profilo **/}
        <WidgetTag widget={attivitaState.profilo} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
      </>) : (<>
        { /** Cliente **/}
        {(attivitaState.clienti.tipoVisualizzazione !== 0) && (<WidgetTag widget={attivitaState.clienti} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />)}
        { /** Servizio **/}
        {(attivitaState.servizi.tipoVisualizzazione !== 0) && (<WidgetTag widget={attivitaState.servizi} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />)}
        { /** Lavoro **/}
        {(attivitaState.lavori.tipoVisualizzazione !== 0) && (<WidgetTag widget={attivitaState.lavori} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />)}
        { /** Spesa **/}
        {(attivitaState.spese.tipoVisualizzazione !== 0) && (<WidgetTag widget={attivitaState.spese} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />)}
        { /** Analisi **/}
        {(attivitaState.analisi.tipoVisualizzazione !== 0) && (<WidgetTag widget={attivitaState.analisi} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />)}
        { /** Profilo **/}
        {(attivitaState.profilo.tipoVisualizzazione !== 0) && (<WidgetTag widget={attivitaState.profilo} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />)}
      </>)}
    </div>
  );
};








