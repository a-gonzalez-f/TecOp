import "./LineaState.css";

function LineaState({ linea, estaciones, plcs, loading, openModal }) {
  const listaEstaciones = estaciones?.filter((e) => e.linea === linea) || [];

  return (
    <div className={`containerLinea ${linea}`}>
      <h3 className={`tituloLinea bgi-${linea}`}>{linea}</h3>

      <div className="lineaWrapper">
        <div className={`lineaHorizontal bgi-${linea}`}></div>

        {listaEstaciones.map((estacion, index) => {
          const plc = plcs[estacion._id];

          let statusClass = "offline";

          if (loading) {
            statusClass = "loading";
          } else if (plc?.online) {
            statusClass = "online";
          }

          return (
            <div key={plc?._id ?? estacion._id} className="estacion">
              <div
                className={`punto ${statusClass}`}
                onClick={() => openModal(plc)}
              />

              <div className="nombreEstacionContainer">
                <span className="nombreEstacion">{estacion.nombre}</span>
              </div>
              <div className="latency">
                {loading
                  ? "Cargando..."
                  : plc?.online
                    ? `${plc.latency}ms`
                    : "Sin conexión"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default LineaState;
