import { useState } from "react";
import toast from "react-hot-toast";
import "./FormInterno.css";

function FormInterno({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    LINEA: "",
    REF1: "",
    REF2: "",
    INTERNO: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.INTERNO.trim()) {
      toast.error("El interno es obligatorio");
      return;
    }

    const internoNumber = Number(formData.INTERNO);

    if (isNaN(internoNumber)) {
      toast.error("El interno debe ser numérico");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/internos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            INTERNO: internoNumber,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      onCreated(data);

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error.message);
    }
  };

  return (
    <form id="formInterno" onSubmit={handleSave}>
      <h1>Agregar Interno</h1>

      <label htmlFor="LINEA">
        Línea:
        <input
          id="LINEA"
          placeholder="LINEA X"
          value={formData.LINEA}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>

      <label htmlFor="REF1">
        Referencia 1:
        <input
          id="REF1"
          value={formData.REF1}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>

      <label htmlFor="REF2">
        Referencia 2:
        <input
          id="REF2"
          value={formData.REF2}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>

      <label htmlFor="INTERNO">
        Interno:
        <input
          id="INTERNO"
          value={formData.INTERNO}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>

      <button
        type="submit"
        className="submitButton"
        disabled={!formData.INTERNO.trim()}
      >
        Guardar
      </button>
    </form>
  );
}

export default FormInterno;
