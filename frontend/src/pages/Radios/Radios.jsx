import { useState, useEffect } from "react";
import { icons } from "../../assets/icons/Icons";
import Modal from "../../components/Modal/Modal";
import FormRadio from "../../components/FormRadio/FormRadio";
import ContainerRadios from "../../components/ContainerRadios/ContainerRadios";
import RadioDetail from "../../components/RadioDetail/RadioDetail";
import FormRadioEvent from "../../components/FormRadioEvent/FormRadioEvent";

function Radios() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [radios, setRadios] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchRadios = async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/radios`);
    const data = await res.json();

    setRadios(data);

    setSelectedRadio((prev) => {
      if (!prev) return null;
      return data.find((r) => r._id === prev._id) || prev;
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchRadios();
  }, []);

  const handleOpenDetail = (radio) => {
    setSelectedRadio(radio);
    setModalType("detail");
    setOpen(true);
  };

  const handleOpenEdit = (radio) => {
    setSelectedRadio(radio);
    setModalType("edit");
    setOpen(true);
  };

  const handleUpdateRadio = (id, field, value) => {
    setRadios((prev) =>
      prev.map((r) => (r._id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleOpenEvent = (radio) => {
    setSelectedRadio(radio);
    setModalType("event");
    setOpen(true);
  };

  return (
    <main className="page">
      <button
        className="addBtn"
        id="addRadioBtn"
        onClick={() => {
          setSelectedRadio(null);
          setModalType("edit");
          setOpen(true);
        }}
      >
        {icons.add}
      </button>

      <ContainerRadios
        radios={radios}
        loading={loading}
        onOpenDetail={handleOpenDetail}
        onOpenEdit={handleOpenEdit}
        onAddEvent={handleOpenEvent}
      />

      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedRadio(null);
          setModalType(null);
        }}
      >
        {modalType === "edit" ? (
          <FormRadio
            radio={selectedRadio}
            onClose={() => {
              setOpen(false);
              setSelectedRadio(null);
              setModalType(null);
            }}
            onSuccess={fetchRadios}
          />
        ) : modalType === "event" && selectedRadio ? (
          <FormRadioEvent
            radio={selectedRadio}
            onSuccess={() => {
              fetchRadios();
              setModalType("detail");
            }}
          />
        ) : selectedRadio ? (
          <RadioDetail
            radio={selectedRadio}
            onClose={() => {
              setOpen(false);
              setSelectedRadio(null);
              setModalType(null);
            }}
            onSuccess={fetchRadios}
            onEdit={(radio) => {
              setSelectedRadio(radio);
              setModalType("edit");
            }}
            onUpdate={handleUpdateRadio}
            onAddEvent={handleOpenEvent}
          />
        ) : null}
      </Modal>
    </main>
  );
}

export default Radios;
