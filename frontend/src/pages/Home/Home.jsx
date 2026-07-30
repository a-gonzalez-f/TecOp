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
        <p>Selecciona un módulo para comenzar a trabajar.</p>
      </header>

      <div className="linkCardContainer">
        <Link to="/rtu" className="linkCard card-rtu">
          <div className="cardHeader">
            <span className="cardSector">Tecnología Operativa</span>
            <h3>RTUs</h3>
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

        <Link to="/engrasadoras" className="linkCard card-engrasadoras">
          <div className="cardHeader">
            <span className="cardSector">Vías</span>
            <h3>Engrasadoras</h3>
          </div>
          <div className="cardBody">
            <span className="cardIcon">{icons.engrasadora}</span>
          </div>
          <div className="cardFooter">Monitoreo</div>
        </Link>

        <Link to="/radios" className="linkCard card-radios">
          <div className="cardHeader">
            <span className="cardSector">Tecnología Operativa</span>
            <h3>Radios</h3>
          </div>
          <div className="cardBody">
            <span className="cardIcon">{icons.radio}</span>
          </div>
          <div className="cardFooter">Frecuencias</div>
        </Link>

        <Link to="/internos" className="linkCard card-internos">
          <div className="cardHeader">
            <h3>Internos</h3>
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
