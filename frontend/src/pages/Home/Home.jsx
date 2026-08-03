import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";
import { icons } from "../../assets/icons/Icons";

function Home() {
  const { user } = useAuth();
  const username = user?.email?.split("@")[0] || "Usuario";

  return (
    <main className="home page">
      <header className="homeHeader">
        <h1>
          <b>Bienvenido,</b> {username}
        </h1>
        <p>Seleccioná un módulo para comenzar a trabajar.</p>
      </header>

      <div className="linkCardContainer">
        <Link to="/Activo1" className="linkCard card-activo1">
          <div className="cardHeader">
            <span className="cardSector">Tecnología Operativa</span>
            <h3>Activo1</h3>
          </div>
          <div className="cardBody">
            <span className="cardIcon">{icons.rtu}</span>
          </div>
          <div className="cardSideDetail">
            <span className="cardMainValue">12</span>
            <span className="cardSubtext">Unidades activas</span>
          </div>
          <div className="cardFooter">Ver detalles →</div>
        </Link>

        <Link to="/activo2" className="linkCard card-activo2">
          <div className="cardHeader">
            <span className="cardSector">Vías</span>
            <h3>Equipo</h3>
          </div>
          <div className="cardBody">
            <span className="cardIcon">{icons.equipo}</span>
          </div>
          <div className="cardFooter">Monitoreo</div>
        </Link>

        <Link to="/activo3" className="linkCard card-activo3">
          <div className="cardHeader">
            <span className="cardSector">Tecnología Operativa</span>
            <h3>Activo3</h3>
          </div>
          <div className="cardBody">
            <span className="cardIcon">{icons.radio}</span>
          </div>
          <div className="cardFooter">Frecuencias</div>
        </Link>

        <Link to="/activo4" className="linkCard card-activo4">
          <div className="cardHeader">
            <h3>Activo4</h3>
          </div>
          <div className="cardBody">
            <span className="cardSubtext">
              Contactos del personal, estaciones, sectores
            </span>
          </div>
          <div className="cardFooter">Abrir agenda →</div>
        </Link>
      </div>
    </main>
  );
}

export default Home;
