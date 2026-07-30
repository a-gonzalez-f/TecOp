import { Link } from "react-router-dom";
import { icons } from "../../assets/icons/Icons";
import "./LineaEngrasadoras.css";

function LineaEngrasadoras({
  linea,
  estaciones,
  engrasadoras,
  onEngrasadoraClick,
}) {
  const listaEstaciones = estaciones?.filter((e) => e.linea === linea) || [];
  const listaEngrasadoras =
    engrasadoras?.filter((eng) => eng.linea === linea) || [];

  return (
    <Link className="linkLinea" to={`/engrasadoras/${linea}`}>
      <div className={`containerLinea ${linea}`}>
        <h3 className={`tituloLinea bgi-${linea}`}>{linea}</h3>

        <div className="viasWrapper">
          <div className="estacionesFondo">
            {listaEstaciones.map((estacion, index) => (
              <div
                key={estacion.ip}
                className="estacionFondo"
                style={{
                  left:
                    listaEstaciones.length === 1
                      ? "50%"
                      : `${(index / (listaEstaciones.length - 1)) * 100}%`,
                }}
              >
                <div className={`ancla via1 color-${linea}`}>{icons.right}</div>
                <div className={`ancla via2 color-${linea}`}>{icons.left}</div>
                <span className="nombreEstacion">{estacion.nombre}</span>
              </div>
            ))}
          </div>

          <div className="viasCapa">
            <div className={`via via1 bgi-${linea}`}></div>
            <div className={`via via2 bgi-${linea}`}></div>
          </div>

          <div className="equiposCapa">
            {listaEngrasadoras.map((eng) => (
              <div
                key={eng._id}
                className={`engrasadora via${eng.via}`}
                style={{ left: `${eng.posicion * 100}%` }}
                data-tooltip={eng.nombre}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  onEngrasadoraClick?.(eng);
                }}
              >
                <div className={`punto ${eng.estado}Bg`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default LineaEngrasadoras;
