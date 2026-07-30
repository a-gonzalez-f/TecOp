import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "./FormRadioEvent.css";

const getLocalDateTime = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

const createInitialFormData = () => ({
  fecha: getLocalDateTime(),
  tipoEvento: "",
  descripcion: "",
  linea: "",
  modeloTren: "",
  formacion: "",
  cabina: "",
  cambioMic: false,
  cambioAntena: false,
  cambioFuente: false,
  cambioParlante: false,
});

function FormRadioEvent({ radio, onSuccess }) {
  if (!radio) return null;

  const [formData, setFormData] = useState(createInitialFormData);
  const [loading, setLoading] = useState(false);

  const trenesPorLinea = {
    A: [{ value: "CNR", label: "CNR" }],
    B: [
      { value: "mitsubishi", label: "Mitsubishi" },
      { value: "CAF6000", label: "CAF6000" },
    ],
    C: [
      { value: "CNR", label: "CNR" },
      { value: "nagoya5000", label: "Nagoya 5000" },
    ],
    D: [
      { value: "alstom100", label: "Alstom Serie 100" },
      { value: "alstom300", label: "Alstom Serie 300" },
    ],
    E: [
      { value: "materfer", label: "FIAT Materfer" },
      { value: "alstom100", label: "Alstom Serie 100" },
    ],
    H: [{ value: "alstom300", label: "Alstom Serie 300" }],
    P: [{ value: "materfer", label: "FIAT Materfer" }],
    all: [{ value: "otro", label: "Otro" }],
  };

  const trenesDisponibles = [
    ...(trenesPorLinea[formData.linea] || []),
    ...trenesPorLinea.all,
  ];

  const radioMontada = !!(radio.formacion?.trim() && radio.cabina?.trim());

  useEffect(() => {
    setFormData({
      ...createInitialFormData(),
      formacion: radio.formacion || "",
      cabina: radio.cabina || "",
      linea: radio.linea || "",
      modeloTren: radio.modeloTren || "",
    });
  }, [radio]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "tipoEvento") {
      setFormData((prev) => ({
        ...createInitialFormData(),
        tipoEvento: value,
        fecha: prev.fecha,
        formacion: radio.formacion || "",
        cabina: radio.cabina || "",
        linea: radio.linea || "",
        modeloTren: radio.modeloTren || "",
      }));
      return;
    }

    if (name === "linea") {
      setFormData((prev) => ({
        ...prev,
        linea: value,
        modeloTren: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (formData.tipoEvento === "cambio") {
      const algunCambio =
        formData.cambioFuente ||
        formData.cambioMic ||
        formData.cambioAntena ||
        formData.cambioParlante;

      if (!algunCambio) {
        toast.error("Seleccioná al menos un componente");
        return;
      }
    }

    setLoading(true);

    try {
      await toast.promise(
        (async () => {
          // crear evento
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/radio-events`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                radioId: radio._id,
                ...formData,
              }),
            },
          );

          if (!res.ok) throw new Error();
        })(),
        {
          loading: "Guardando evento...",
          success: "Evento guardado",
          error: "Error al guardar",
        },
      );

      onSuccess?.();

      setFormData({
        ...createInitialFormData(),
        formacion: radio.formacion || "",
        cabina: radio.cabina || "",
        linea: radio.linea || "",
        modeloTren: radio.modeloTren || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form id="formRadioEvent" onSubmit={handleSubmit}>
        <h1>RADIO {radio.id} - Agregar Evento</h1>
        <div className="fsb">
          <select
            name="tipoEvento"
            id="tipoEvento"
            value={formData.tipoEvento}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="" disabled>
              Seleccionar evento...
            </option>
            <option value="desmonte" disabled={!radioMontada}>
              Desmonte
            </option>
            <option value="montaje" disabled={radioMontada}>
              Montaje
            </option>
            <option value="envioPolicia">Envio a Policía</option>
            <option value="falla">Falla</option>
            <option value="cambio">Cambio de componente</option>
          </select>
          <input
            type="datetime-local"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {(formData.tipoEvento === "desmonte" ||
          formData.tipoEvento === "montaje") && (
          <>
            <div className="fsb">
              <label>
                Línea:
                <select
                  name="linea"
                  value={formData.linea}
                  onChange={handleChange}
                  disabled={loading || formData.tipoEvento === "desmonte"}
                  className={
                    formData.tipoEvento === "montaje" &&
                    (formData.linea === "" || formData.linea === "N/A")
                      ? "attentionBorder"
                      : ""
                  }
                >
                  <option value="">Seleccionar línea...</option>
                  <option value="A" className="bg-A">
                    A
                  </option>
                  <option value="B" className="bg-B">
                    B
                  </option>
                  <option value="C" className="bg-C">
                    C
                  </option>
                  <option value="D" className="bg-D">
                    D
                  </option>
                  <option value="E" className="bg-E">
                    E
                  </option>
                  <option value="H" className="bg-H">
                    H
                  </option>
                  <option value="P" className="bg-P">
                    P
                  </option>
                </select>
              </label>
              <label>
                Modelo Tren
                <select
                  name="modeloTren"
                  value={formData.modeloTren}
                  onChange={handleChange}
                  disabled={loading || formData.tipoEvento === "desmonte"}
                  className={
                    formData.tipoEvento === "montaje" &&
                    formData.modeloTren === ""
                      ? "attentionBorder"
                      : ""
                  }
                >
                  <option value="">Seleccionar modelo...</option>
                  {trenesDisponibles.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="fsb">
              <label>
                Formación:
                <input
                  type="text"
                  name="formacion"
                  maxLength={7}
                  value={formData.formacion}
                  onChange={handleChange}
                  disabled={loading || formData.tipoEvento === "desmonte"}
                  autoComplete="off"
                  className={
                    formData.tipoEvento === "montaje" &&
                    formData.formacion === ""
                      ? "attentionBorder"
                      : ""
                  }
                />
              </label>

              <label>
                Cabina:
                <input
                  type="text"
                  name="cabina"
                  maxLength={7}
                  value={formData.cabina}
                  onChange={handleChange}
                  disabled={loading || formData.tipoEvento === "desmonte"}
                  autoComplete="off"
                  className={
                    formData.tipoEvento === "montaje" && formData.cabina === ""
                      ? "attentionBorder"
                      : ""
                  }
                />
              </label>
            </div>
          </>
        )}
        {formData.tipoEvento === "cambio" && (
          <>
            <h3>Seleccione los componentes reemplazados: </h3>
            <div id="componentes">
              <label>
                Fuente
                <input
                  type="checkbox"
                  name="cambioFuente"
                  checked={formData.cambioFuente}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
              <label>
                Micrófono
                <input
                  type="checkbox"
                  name="cambioMic"
                  checked={formData.cambioMic}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
              <label>
                Antena
                <input
                  type="checkbox"
                  name="cambioAntena"
                  checked={formData.cambioAntena}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
              <label>
                Parlante
                <input
                  type="checkbox"
                  name="cambioParlante"
                  checked={formData.cambioParlante}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
            </div>
          </>
        )}
        <label>Descripción:</label>
        <textarea
          type="text"
          name="descripcion"
          id="descripcion"
          maxLength={100}
          placeholder="Descripción del evento..."
          value={formData.descripcion}
          onChange={handleChange}
          disabled={loading}
        />
        <button
          type="submit"
          className="submitButton"
          disabled={
            loading ||
            (formData.tipoEvento === "montaje" &&
              (!formData.linea.trim() ||
                !formData.modeloTren.trim() ||
                !formData.formacion.trim() ||
                !formData.cabina.trim()))
          }
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </>
  );
}

export default FormRadioEvent;
