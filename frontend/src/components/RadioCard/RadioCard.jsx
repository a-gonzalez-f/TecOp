import "./RadioCard.css";
import { icons } from "../../assets/icons/Icons";

function RadioCard({ radio, onClick, onContextMenu }) {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`radioCard`}
    >
      <div className="card-head">
        <div className="radioState">
          {radio.operativo ? icons.ok : icons.error}
        </div>
        <div>
          <h6>ID</h6>
          <p>{radio.id}</p>
        </div>
        {radio.tipo === "tren" && (radio.formacion || radio.cabina) && (
          <div className="tren">
            {radio.formacion && (
              <div>
                <h6>FORM.</h6>
                <p>{radio.formacion.toUpperCase()}</p>
              </div>
            )}
            {radio.cabina && (
              <div>
                <h6>CAB.</h6>
                <p>{radio.cabina.toUpperCase()}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="card-body">
        {radio.alias && (
          <p>
            <b>Alias: </b>
            {radio.alias.toUpperCase()}
          </p>
        )}
        <p>{radio.modelo.toUpperCase()}</p>
        {radio.nserie && <p>{radio.nserie}</p>}
        <p>En {radio.ubicacion}</p>
        {radio.tipo === "tren" && radio.modeloTren && (
          <p>{radio.modeloTren.toUpperCase()}</p>
        )}

        {radio.tipo !== "tren" && (
          <>
            {radio.sector && (
              <p>
                <b>Sector:</b> {radio.sector.toUpperCase()}
              </p>
            )}
          </>
        )}
      </div>
      <div className="integridadCard">
        <div className={`stateIcon ${radio.fuente ? `stateOn` : `stateOff`}`}>
          {radio.fuente ? icons.fuenteOn : icons.fuenteOff}
        </div>
        <div
          className={`stateIcon ${radio.microfono ? `stateOn` : `stateOff`}`}
        >
          {radio.microfono ? icons.microfonoOn : icons.microfonoOff}
        </div>
        <div className={`stateIcon ${radio.antena ? `stateOn` : `stateOff`}`}>
          {radio.antena ? icons.antenaOn : icons.antenaOff}
        </div>
        <div className={`stateIcon ${radio.parlante ? `stateOn` : `stateOff`}`}>
          {radio.parlante ? icons.parlanteOn : icons.parlanteOff}
        </div>
      </div>
      <div className={`lineaRadio bg-${radio.linea}`}>
        {radio.linea !== "N/A" && radio.linea}
      </div>
    </div>
  );
}

export default RadioCard;
