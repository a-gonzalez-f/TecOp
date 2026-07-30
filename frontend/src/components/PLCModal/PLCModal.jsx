import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { icons } from "../../assets/icons/Icons";
import { formatFechaHMS } from "../../utils/formatFechas";
import { getTipoEvento } from "../../utils/formatEvento";
import "./PLCModal.css";

function PLCModal({ plc }) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState(null);

  const [selectedEvento, setSelectedEvento] = useState(null);
  const [seguirUltimo, setSeguirUltimo] = useState(true);

  useEffect(() => {
    if (!editMode) {
      fetchHistorial();
    }
  }, [plc.updatedAt, editMode]);

  const fetchHistorial = async () => {
    if (historial.length === 0) {
      setLoadingHistorial(true);
    }

    setErrorHistorial(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/plc-history/${plc._id}`,
      );

      if (!res.ok) {
        if (res.status === 404) {
          setErrorHistorial("No se encontró el historial.");
        } else if (res.status === 500) {
          setErrorHistorial("Error interno del servidor.");
        } else if (res.status === 403) {
          setErrorHistorial("No tenés permisos para acceder al historial.");
        } else {
          setErrorHistorial("Ocurrió un error al cargar el historial.");
        }

        return;
      }

      const data = await res.json();

      setHistorial(data);

      if (data.length > 0) {
        if (seguirUltimo) {
          setSelectedEvento(data[0]);
        } else {
          const eventoActualizado = data.find(
            (e) => e._id === selectedEvento?._id,
          );

          if (eventoActualizado) {
            setSelectedEvento(eventoActualizado);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("No se pudo obtener el historial");
    } finally {
      setLoadingHistorial(false);
    }
  };

  const [plcData, setPlcData] = useState({
    nombre: plc.nombre || "",
    ip: plc.ip || "",
    puerto: plc.puerto || "",
    linea: plc.linea || "",
    ubicacion: plc.ubicacion || "",
    sector: plc.sector || "",
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setPlcData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCancel = () => {
    setPlcData({
      nombre: plc.nombre || "",
      ip: plc.ip || "",
      puerto: plc.puerto || "",
      linea: plc.linea || "",
      ubicacion: plc.ubicacion || "",
      sector: plc.sector || "",
    });
    setEditMode(false);
  };

  const handleSave = async () => {
    const puerto = Number(plcData.puerto);

    if (Number.isNaN(puerto)) {
      toast.error("Puerto inválido");
      return;
    }

    const cambios =
      plc.nombre !== plcData.nombre ||
      plc.ip !== plcData.ip ||
      plc.puerto !== puerto ||
      plc.linea !== plcData.linea ||
      plc.ubicacion !== plcData.ubicacion ||
      plc.sector !== plcData.sector;

    if (!cambios) {
      setEditMode(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/plc/${plc._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...plcData,
            puerto,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al actualizar PLC");
        return;
      }

      toast.success("PLC actualizado");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvento = (evento) => {
    setSelectedEvento(evento);

    if (evento._id !== historial[0]?._id) {
      setSeguirUltimo(false);
    }
  };

  const handleToggleSeguirUltimo = () => {
    const nuevoEstado = !seguirUltimo;
    setSeguirUltimo(nuevoEstado);

    if (nuevoEstado && historial.length > 0) {
      setSelectedEvento(historial[0]);
    }
  };

  return (
    <div id="modalPLC" className="modalContent">
      <div className="dataWrapper">
        <input
          type="text"
          className={`textInput ${editMode ? "editable" : "noEditable"}`}
          name="nombre"
          value={plcData.nombre}
          onChange={handleEditChange}
          readOnly={!editMode || loading}
          autoComplete="off"
          maxLength={20}
          placeholder="Nombre..."
        />
        <span className="separador"></span>
        <input
          type="text"
          className={`textInput ${editMode ? "editable" : "noEditable"}`}
          name="ip"
          value={plcData.ip}
          onChange={handleEditChange}
          readOnly={!editMode || loading}
          autoComplete="off"
          maxLength={15}
          placeholder="IP..."
        />
        <span className="separador"></span>
        <input
          type="text"
          className={`textInput ${editMode ? "editable" : "noEditable"}`}
          name="puerto"
          value={plcData.puerto}
          onChange={handleEditChange}
          readOnly={!editMode || loading}
          autoComplete="off"
          maxLength={5}
          placeholder="Puerto..."
        />
        <span className="separador"></span>
        <input
          type="text"
          className={`textInput ${editMode ? "editable" : "noEditable"}`}
          name="ubicacion"
          value={plcData.ubicacion}
          onChange={handleEditChange}
          readOnly={!editMode || loading}
          autoComplete="off"
          maxLength={20}
          placeholder="Ubicación..."
        />
        <span className="separador"></span>
        <input
          type="text"
          className={`textInput ${editMode ? "editable" : "noEditable"}`}
          name="sector"
          value={plcData.sector}
          onChange={handleEditChange}
          readOnly={!editMode || loading}
          autoComplete="off"
          maxLength={20}
          placeholder="Sector..."
        />
        <span className="separador"></span>
        <select
          className={`textInput ${editMode ? "editable" : "noEditable"} ${plcData.linea ? `bg-${plcData.linea}` : ""}`}
          name="linea"
          value={plcData.linea}
          onChange={handleEditChange}
          disabled={!editMode || loading}
        >
          <option className={`bgi-A`} value="A">
            A
          </option>
          <option className={`bgi-B`} value="B">
            B
          </option>
          <option className={`bgi-C`} value="C">
            C
          </option>
          <option className={`bgi-D`} value="D">
            D
          </option>
          <option className={`bgi-E`} value="E">
            E
          </option>
          <option className={`bgi-H`} value="H">
            H
          </option>
          <option className={`bgi-P`} value="P">
            P
          </option>
        </select>
        <div className={`actionButtons ${editMode ? "visible" : ""}`}>
          {editMode ? (
            <>
              <button
                type="button"
                className="actionButton"
                onClick={handleEditCancel}
                disabled={loading}
              >
                {icons.close}
              </button>
              <button
                type="button"
                className="actionButton"
                onClick={handleSave}
                disabled={loading}
              >
                {icons.check}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`editBtn actionButton`}
              onClick={() => setEditMode(!editMode)}
            >
              {icons.edit}
            </button>
          )}
        </div>
      </div>
      <div className="grid">
        <div
          className={`estadoContainer ${plc.online ? "onlineBorder" : "offlineBorder"}`}
        >
          <h1>Estado actual</h1>
          <p className={plc.online ? `fontOnline` : `fontOffline`}>
            {plc.online ? "Online" : "Offline"}
          </p>
          <p>
            <b>Latencia:</b> {plc.latency != null ? `${plc.latency} ms` : "-"}
          </p>
          {plc.lastError ? <p>Error: {plc.lastError}</p> : <p>Sin error</p>}
        </div>

        <div className="registersContainer">
          <h1>Holding Registers</h1>
          <div className="controlUltimo">
            {selectedEvento?._id === historial?.[0]?._id && (
              <p className={`ultimoEvento`}>Más reciente</p>
            )}
            <button
              className={`ultimoBtn ${seguirUltimo ? "fijo" : ""}`}
              onClick={handleToggleSeguirUltimo}
            >
              {seguirUltimo ? "Siguiendo último" : "Seguir último"}
            </button>
          </div>

          {selectedEvento ? (
            <h6 className="helper">
              Seleccioná otro evento para ver sus registros.
            </h6>
          ) : (
            <h6 className="helper">
              Seleccioná un evento para ver los registros.
            </h6>
          )}
          {selectedEvento ? (
            <>
              <div className="fsb">
                <b>Lectura:</b>
                <span>{formatFechaHMS(selectedEvento.createdAt, false)}</span>
              </div>

              <div className="registersTable">
                {(selectedEvento.holdingRegisters ?? []).map(
                  (registro, index) => (
                    <div key={index} className="fsb">
                      <span>Registro {index}:</span>
                      <span>{registro}</span>
                    </div>
                  ),
                )}
              </div>
            </>
          ) : (
            <p>Sin registros.</p>
          )}
        </div>
        <div className="ultimosContainer">
          <h1>Últimos</h1>
          <div>
            <h5>Lectura:</h5>
            <p>
              {plc.lastRead ? formatFechaHMS(plc.lastRead) : "Sin registro"}
            </p>
          </div>
          <div>
            <h5>Cambio de estado:</h5>
            <p>
              {plc.lastStatusChange
                ? formatFechaHMS(plc.lastStatusChange)
                : "Sin registro"}
            </p>
          </div>
          <div>
            <h5>Error:</h5>
            <p> {plc.lastError ? plc.lastError : "Sin Registro"}</p>
          </div>
        </div>

        <div className="historialContainer">
          <h1>Historial</h1>
          <div className="tablaScroll">
            {loadingHistorial ? (
              <div className="loadingScreen">
                <div className="loading">{icons.loading}</div>
              </div>
            ) : errorHistorial ? (
              <div className="errorDiv">Error: {errorHistorial}</div>
            ) : (
              <table id="resumenHistorial">
                <colgroup>
                  <col className="colFecha" />
                  <col className="colEvento" />
                  <col className="colEstado" />
                  <col className="colLatencia" />
                  <col className="colError" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Evento</th>
                    <th>Estado</th>
                    <th>Latencia</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No hay eventos para mostrar.</td>
                    </tr>
                  ) : (
                    historial.map((evento) => (
                      <tr
                        key={evento._id}
                        onClick={() => handleSelectEvento(evento)}
                        className={
                          selectedEvento?._id === evento._id ? "selected" : ""
                        }
                      >
                        <td className="tdDate">
                          {formatFechaHMS(evento.createdAt)}
                        </td>
                        <td>{getTipoEvento(evento.tipo)}</td>
                        <td>{evento.online ? "Online" : "Offline"}</td>
                        <td>{evento.latency ? `${evento.latency} ms` : "-"}</td>
                        <td>{evento.lastError ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="actionButtons">
            <button type="button" className="moreBtn actionButton">
              {icons.add}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PLCModal;
