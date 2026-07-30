import { useEffect, useState, useRef } from "react";
import LineaState from "../../components/LineaState/LineaState";
import Modal from "../../components/Modal/Modal";
import "./Rtu.css";
import PLCModal from "../../components/PLCModal/PLCModal";

function Rtu() {
  const [estaciones, setEstaciones] = useState([]);
  const [plcs, setPlcs] = useState({});
  const [selectedPLCId, setSelectedPLCId] = useState(null);

  const [loading, setLoading] = useState(true);

  const isFetching = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (plc) => {
    setSelectedPLCId(plc.estacion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPLCId(null);
    setIsModalOpen(false);
  };

  const selectedPLC = selectedPLCId ? plcs[selectedPLCId] : null;

  useEffect(() => {
    const fetchEstaciones = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/estaciones`);

      setEstaciones(await res.json());
    };

    fetchEstaciones();
  }, []);

  useEffect(() => {
    const fetchPLCs = async (firstLoad = false) => {
      if (isFetching.current) return;

      isFetching.current = true;

      if (firstLoad) setLoading(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/plc`);

        const data = await res.json();

        setPlcs(Object.fromEntries(data.map((plc) => [plc.estacion, plc])));
      } catch (err) {
        console.error(err);
      } finally {
        isFetching.current = false;

        if (firstLoad) {
          setLoading(false);
        }
      }
    };

    fetchPLCs(true);

    const interval = setInterval(fetchPLCs, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="rtuPage">
        <div className="containerLineas">
          {["A", "B", "C", "D", "E", "H"].map((linea) => (
            <LineaState
              key={linea}
              linea={linea}
              estaciones={estaciones}
              plcs={plcs}
              loading={loading}
              openModal={openModal}
            />
          ))}
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedPLC && <PLCModal plc={selectedPLC} />}
      </Modal>
    </>
  );
}

export default Rtu;
