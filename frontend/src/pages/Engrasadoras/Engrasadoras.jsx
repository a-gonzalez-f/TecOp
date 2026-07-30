import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LineaEngrasadoras from "../../components/LineaEngrasadoras/LineaEngrasadoras";
import Modal from "../../components/Modal/Modal";
import "./Engrasadoras.css";
import ModalEngContent from "../../components/ModalEngContent/ModalEngContent";
import { icons } from "../../assets/icons/Icons";

function Engrasadoras() {
  const { linea } = useParams();

  const [estaciones, setEstaciones] = useState([]);
  const [engrasadoras, setEngrasadoras] = useState([]);
  const [loadingEngrasadoras, setLoadingEngrasadoras] = useState(false);
  const [errorEngrasadoras, setErrorEngrasadoras] = useState(null);

  const [engrasadoraSeleccionada, setEngrasadoraSeleccionada] = useState(null);

  useEffect(() => {
    const fetchEstaciones = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/estaciones`);
      const data = await res.json();
      setEstaciones(data);
    };

    fetchEstaciones();
  }, []);

  const engrasadorasPorLinea = (linea) =>
    engrasadoras.filter((e) => e.linea === linea);

  const renderOverview = () => (
    <div className="containerLineas">
      {["A", "B", "C", "D", "E", "H"].map((l) => (
        <LineaEngrasadoras
          key={l}
          linea={l}
          estaciones={estaciones}
          engrasadoras={engrasadorasPorLinea(l)}
        />
      ))}
    </div>
  );

  const renderLinea = () => (
    <div className="containerLineaUnica">
      <LineaEngrasadoras
        linea={linea}
        estaciones={estaciones}
        engrasadoras={engrasadoras}
        onEngrasadoraClick={setEngrasadoraSeleccionada}
      />
    </div>
  );

  useEffect(() => {
    const fetchEngrasadoras = async () => {
      try {
        setLoadingEngrasadoras(true);
        setErrorEngrasadoras(null);

        const url = linea
          ? `http://172.30.191.42:3000/api/engrasadoras/filtrado?linea=${linea}`
          : `http://172.30.191.42:3000/api/engrasadoras/filtrado`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Error al obtener las engrasadoras");
        }

        const data = await res.json();

        if (data.length === 0) {
          setErrorEngrasadoras("No se encontraron engrasadoras");
        }

        setEngrasadoras(data);
      } catch (err) {
        console.error(err);
        setErrorEngrasadoras("Ocurrió un error al cargar las engrasadoras");
      } finally {
        setLoadingEngrasadoras(false);
      }
    };

    fetchEngrasadoras();
  }, [linea]);

  // ENGRASADORAS HARDCODEADAS
  // useEffect(() => {
  //   setEngrasadoras([
  //     {
  //       _id: "1",
  //       id: 1,
  //       nombre: "ENG-01",
  //       linea: "A",
  //       via: 1,
  //       posicion: 0.22,
  //       estado: "desconectada",
  //       tiempo: 1,
  //       ejes: 128,
  //     },
  //     {
  //       _id: "2",
  //       id: 2,
  //       nombre: "ENG-02",
  //       linea: "A",
  //       via: 2,
  //       posicion: 0.35,
  //       estado: "funcionando",
  //       tiempo: 1,
  //       ejes: 128,
  //     },
  //     {
  //       _id: "3",
  //       id: 3,
  //       nombre: "ENG-03",
  //       linea: "B",
  //       via: 1,
  //       posicion: 0.7,
  //       estado: "alerta",
  //       tiempo: 1,
  //       ejes: 128,
  //     },
  //     {
  //       _id: "4",
  //       id: 4,
  //       nombre: "ENG-04",
  //       linea: "D",
  //       via: 2,
  //       posicion: 0.55,
  //       estado: "desconectada",
  //       tiempo: 1,
  //       ejes: 128,
  //     },
  //     {
  //       _id: "5",
  //       id: 5,
  //       nombre: "ENG-05",
  //       linea: "H",
  //       via: 2,
  //       posicion: 0.75,
  //       estado: "funcionando",
  //       tiempo: 1,
  //       ejes: 128,
  //     },
  //     {
  //       _id: "6",
  //       id: 6,
  //       nombre: "ENG-06",
  //       linea: "C",
  //       via: 1,
  //       posicion: 0.1,
  //       estado: "funcionando",
  //       tiempo: 1,
  //       ejes: 128,
  //     },
  //     {
  //       _id: "7",
  //       id: 7,
  //       nombre: "ENG-07",
  //       linea: "E",
  //       via: 1,
  //       posicion: 0.9,
  //       estado: "funcionando",
  //       tiempo: 1,
  //       ejes: 128,
  //     },
  //   ]);
  // }, []);

  return (
    <>
      <main className="engrasadorasPage">
        {loadingEngrasadoras && (
          <div className="loadingScreen">
            <div className="loading">{icons.loading}</div>
          </div>
        )}

        {errorEngrasadoras ? (
          <div className="errorDiv">No se encontraron engrasadoras</div>
        ) : (
          <>
            {linea
              ? renderLinea(linea, { estaciones, engrasadoras })
              : renderOverview({ estaciones, engrasadoras })}
          </>
        )}
      </main>
      {engrasadoraSeleccionada && (
        <Modal isOpen={true} onClose={() => setEngrasadoraSeleccionada(null)}>
          <ModalEngContent engrasadora={engrasadoraSeleccionada} />
        </Modal>
      )}
    </>
  );
}

export default Engrasadoras;
