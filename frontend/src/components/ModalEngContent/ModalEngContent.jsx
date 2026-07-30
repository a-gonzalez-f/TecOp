import { stateToIcon } from "../../utils/stateToIcon";
import { icons } from "../../assets/icons/Icons";
import "./ModalEngContent.css";
import { useState, useEffect } from "react";
import AccionamientosChart from "../Analytics/AccionamientosChart";
import EstadosChart from "../Analytics/EstadosChart";

function ModalEngContent({ engrasadora }) {
  useEffect(() => {
    if (!engrasadora) return;
    loadData();
    loadSettings();
  }, [engrasadora]);

  const [snapshots, setSnapshots] = useState([]);
  const [loadingSnapshots, setLoadingSnapshots] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState(null);

  const fetchSnapshots = async () => {
    if (!engrasadora) return;
    try {
      setLoadingSnapshots(true);

      const res = await fetch(
        `http://172.30.191.42:3000/api/engrasadoras/snapshots/${engrasadora.id}?servicio=true`,
      );

      if (!res.ok) {
        if (res.status === 404) {
          setErrorAnalytics("No se encontraron analytics.");
        } else if (res.status === 500) {
          setErrorAnalytics("Error interno del servidor.");
        } else if (res.status === 403) {
          setErrorAnalytics("No tenés permisos para acceder a analytics.");
        } else {
          setErrorAnalytics("Ocurrió un error al cargar analytics.");
        }

        return;
      }

      const data = await res.json();

      if (data.length === 0) {
        setErrorAnalytics("Sin analytics registrados");
      }

      setSnapshots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSnapshots(false);
    }
  };

  const fetchHistorial = async () => {
    if (!engrasadora) return;
    try {
      setLoadingHistorial(true);
      setErrorHistorial(null);

      const res = await fetch(
        `http://172.30.191.42:3000/api/engrasadoras/historialPaginado/${engrasadora.id}?offset=0&limit=25&tipo=todos&estado=todos&flujo=todos&power=todos&onoff=todos&repetidos=true`,
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

      setHistorial(data.historial);
    } catch (err) {
      console.error(err);
      setErrorHistorial(err.message);
    } finally {
      setLoadingHistorial(false);
    }
  };

  useEffect(() => {
    if (!engrasadora) return;
    fetchSnapshots();
    fetchHistorial();
  }, [engrasadora]);

  // data edit ---------------------------------------------------

  const [editDataMode, setEditDataMode] = useState(false);

  const [data, setData] = useState({
    id: "",
    estado: "",
    nombre: "",
    via: "",
    posicion: "",
  });

  const loadData = () => {
    setData({
      id: engrasadora.id ?? "",
      estado: engrasadora.estado ?? "",
      nombre: engrasadora.nombre ?? "",
      via: engrasadora.via ?? "",
      posicion: engrasadora.posicion ?? "",
    });
  };

  const handleDataChange = (e) => {
    const { name, value, type } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleDataCancel = () => {
    loadData();
    setEditDataMode(false);
  };

  const handleDataSave = () => {};

  // settings edit ----------------------------------------------

  const [editSettingsMode, setEditSettingsMode] = useState(false);

  const [settings, setSettings] = useState({
    tiempo: "",
    ejes: "",
    estado: "",
  });

  const loadSettings = () => {
    setSettings({
      tiempo: engrasadora.set_tiempodosif ?? "",
      ejes: engrasadora.set_ejes ?? "",
      estado: engrasadora.estado ?? "",
    });
  };

  const handleSettingChange = (e) => {
    const { name, value, type } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSettingCancel = () => {
    loadSettings();
    setEditSettingsMode(false);
  };

  const handleSettingSave = () => {};

  // submodales ----------------------------------------

  const [modal, setModal] = useState(null);

  const abrirHistorialCompleto = (id) => {
    setModal("historial");
  };

  const abrirComentarios = (id) => {
    setModal("comentarios");
  };

  const abrirAnalytics = (id) => {
    setModal("analytics");
  };

  return (
    <div className="modalContent">
      {loadingSnapshots && (
        <div className="loadingScreen">
          <div className="loading">{icons.loading}</div>
        </div>
      )}

      <div className="dataWrapper">
        <span className="spanTooltip" data-tooltip={engrasadora.estado}>
          {stateToIcon(data.estado)}
        </span>
        <span className="separador"></span>
        <span>ID: {data.id}</span>
        <span className="separador"></span>
        <input
          type="text"
          className={`textInput ${editDataMode ? "editable" : ""}`}
          name="nombre"
          value={data.nombre}
          onChange={handleDataChange}
          readOnly={!editDataMode}
          autoComplete="off"
          maxLength={20}
        />
        <span className="separador"></span>
        <label>
          Vía:
          <input
            type="text"
            className={`textInput ${editDataMode ? "editable" : ""}`}
            name="via"
            value={data.via}
            onChange={handleDataChange}
            readOnly={!editDataMode}
            maxLength={1}
          />
        </label>
        <span className="separador"></span>
        <label
          className="posicion spanTooltip"
          data-tooltip="Una cabecera es 0% y la otra es 100%"
        >
          Posición:
          <input
            type="text"
            className={`textInput ${editDataMode ? "editable" : ""}`}
            name="posicion"
            value={data.posicion}
            onChange={handleDataChange}
            readOnly={!editDataMode}
            maxLength={3}
          />
          %
        </label>
        <div className="actionButtons">
          {editDataMode ? (
            <>
              <button
                type="button"
                className="actionButton"
                onClick={handleDataCancel}
              >
                {icons.close}
              </button>
              <button
                type="button"
                className="actionButton"
                onClick={handleDataSave}
              >
                {icons.check}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`editBtn actionButton`}
              onClick={() => setEditDataMode(!editDataMode)}
            >
              {icons.edit}
            </button>
          )}
        </div>
      </div>
      <div className="grid">
        <div className="seteoContainer">
          <h1>Seteo</h1>
          <div className="seteosContent">
            <div className="seteoItem">
              <span>Tiempo Dosif. (s):</span>

              <input
                name="tiempo"
                type="number"
                min={0.1}
                max={2.2}
                step={0.1}
                disabled={!editSettingsMode}
                value={settings.tiempo}
                onChange={handleSettingChange}
              />
            </div>
            <div className="seteoItem">
              <span>Cant. Ejes: </span>
              <input
                name="ejes"
                type="number"
                min={1}
                max={128}
                step={1}
                disabled={!editSettingsMode}
                value={settings.ejes}
                onChange={handleSettingChange}
              />
            </div>
            <div className="seteoItem">
              <span>Estado: </span>
              <select
                name="estado"
                id="estado"
                disabled={!editSettingsMode}
                value={settings.estado}
                onChange={handleSettingChange}
              >
                <option value="funcionando" disabled>
                  Funcionando
                </option>
                <option value="alerta" disabled>
                  Alerta
                </option>
                <option value="desconectada" disabled>
                  Desconectada
                </option>
                <option value="fs">Fuera de Servicio</option>
                <option value="pm">Pausa Manual</option>
              </select>
            </div>
          </div>
          <div className="actionButtons">
            {editSettingsMode ? (
              <>
                <button
                  type="button"
                  className="actionButton"
                  onClick={handleSettingCancel}
                >
                  {icons.close}
                </button>
                <button
                  type="button"
                  className="actionButton"
                  onClick={handleSettingSave}
                >
                  {icons.check}
                </button>
              </>
            ) : (
              <button
                type="button"
                className={`editBtn actionButton`}
                onClick={() => setEditSettingsMode(!editSettingsMode)}
              >
                {icons.edit}
              </button>
            )}
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
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Flujo</th>
                    <th>Peso</th>
                    <th>Señal LoRa</th>
                    <th>Accionam.</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No hay eventos para mostrar.</td>
                    </tr>
                  ) : (
                    historial.map((evento) => (
                      <tr key={evento._id}>
                        <td>
                          {new Date(evento.fecha).toLocaleString("es-AR")}
                        </td>
                        <td>{evento.estado}</td>
                        <td>{evento.sens_flujo ? "Sí" : "No"}</td>
                        <td>{evento.sens_corriente}</td>
                        <td>{evento.lora_signal}</td>
                        <td>{evento.cont_accionam}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="actionButtons">
            <button
              type="button"
              className="moreBtn actionButton"
              onClick={() => abrirHistorialCompleto(engrasadora.id)}
            >
              {icons.add}
            </button>
          </div>
        </div>
        <div className="comentariosContainer">
          <h1>Comentarios</h1>
          <ul className="comentariosList">
            <li className="comentarioItem">
              <div className="comentarioHead">
                <h1>Usuario</h1>
                <div className="comentarioDate">12/12/12 12:12</div>
              </div>
              <div className="comentarioContenido">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Mollitia, fuga!
              </div>
            </li>
            <li className="comentarioItem">
              <div className="comentarioHead">
                <h1>Usuario</h1>
                <div className="comentarioDate">12/12/12 12:12</div>
              </div>
              <div className="comentarioContenido">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                inventore totam assumenda quae ducimus voluptatem voluptates
                velit nihil quam iure.
              </div>
            </li>
          </ul>
          <div className="actionButtons">
            <button
              type="button"
              className="moreBtn actionButton"
              onClick={() => abrirComentarios(engrasadora.id)}
            >
              {icons.add}
            </button>
          </div>
        </div>
        <div className="analyticsContainer">
          {errorAnalytics ? (
            <div className="errorDiv">{errorAnalytics}</div>
          ) : (
            <>
              <h1>Analytics</h1>
              <div className="analyticsContent">
                <div className="graficoAnalytics">
                  <AccionamientosChart
                    data={snapshots}
                    horarioEnServicio={true}
                  />
                </div>
                <div className="graficoAnalytics">
                  <EstadosChart data={snapshots} />
                </div>
              </div>
              <div className="actionButtons">
                <button
                  type="button"
                  className="moreBtn actionButton"
                  onClick={() => abrirAnalytics(engrasadora.id)}
                >
                  {icons.analytics}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalEngContent;
