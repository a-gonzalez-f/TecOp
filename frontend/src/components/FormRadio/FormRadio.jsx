import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "./FormRadio.css";
import Toggle from "../Toggle/Toggle";
import { icons } from "../../assets/icons/Icons";
import Confirm from "../Confirm/Confirm";

const initialFormData = {
  tipo: "tren",
  modelo: "mtm5400",
  id: "",
  alias: "",
  nserie: "",
  linea: "N/A",
  ubicacion: "campo",
  operativo: true,

  modeloTren: "",
  formacion: "",
  cabina: "",

  sector: "",
  responsable: "",

  fuente: true,
  microfono: true,
  antena: true,
  parlante: true,

  comentario: "",

  liberado: false,
  instalado: true,
};

function FormRadio({ radio, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...radio,
  });

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    setFormData({
      ...initialFormData,
      ...radio,
    });
  }, [radio]);

  const isEdit = !!radio;

  const modelosPorTipo = {
    tren: [
      { value: "mtm5400", label: "MTM5400" },
      { value: "mtm800e", label: "MTM800e" },
    ],
    fijo: [
      { value: "mtm5400", label: "MTM5400" },
      { value: "mtm800e", label: "MTM800e" },
    ],
    handy: [
      { value: "mtp3250", label: "MTP3250" },
      { value: "mtp850", label: "MTP850" },
    ],
    all: [{ value: "otro", label: "Otro" }],
  };

  const modelosDisponibles = formData.tipo
    ? [...modelosPorTipo[formData.tipo], ...modelosPorTipo.all]
    : [];

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

  const cabinasPorModelo = {
    CNR: [
      { value: "RCA", label: "RCA" },
      { value: "RC", label: "RC" },
    ],
    mitsubishi: [
      { value: "6", label: "6" },
      { value: "1", label: "1" },
    ],
    CAF6000: [
      { value: "6", label: "6" },
      { value: "1", label: "1" },
    ],
    nagoya5000: [
      { value: "constitucion", label: "Constitución" },
      { value: "retiro", label: "Retiro" },
    ],
    alstom100: [
      { value: "RCA", label: "RCA" },
      { value: "RCB", label: "RCB" },
    ],
    alstom300: [
      { value: "RCA", label: "RCA" },
      { value: "RCB", label: "RCB" },
    ],
    materfer: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
    ],
    all: [{ value: "otro", label: "Otro" }],
  };

  const cabinasDisponibles = formData.modeloTren
    ? [
        ...(cabinasPorModelo[formData.modeloTren] || []),
        ...cabinasPorModelo.all,
      ]
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "tipo") {
        return {
          ...prev,
          tipo: value,
          modelo: "",
        };
      }

      if (name === "linea") {
        return {
          ...prev,
          linea: value,
          modeloTren: "",
          cabina: "",
        };
      }

      if (name === "modeloTren") {
        return {
          ...prev,
          modeloTren: value,
          cabina: "",
        };
      }

      if (name === "instalado") {
        const next = value === "true" || value === true;

        return {
          ...prev,
          instalado: next,
          ubicacion: next ? "campo" : "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleToggle = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/api/radios/${radio._id}`
      : `${import.meta.env.VITE_API_URL}/api/radios`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar");
      }

      toast.success(isEdit ? "Radio actualizada" : "Radio creada");

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_API_URL}/api/radios/${radio._id}`;

    const method = "DELETE";

    try {
      const res = await fetch(url, {
        method,
      });

      if (!res.ok) throw new Error();

      toast.success("Radio eliminada");

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Error al eliminar Radio");
    }
  };

  return (
    <>
      <form id="formRadio" onSubmit={handleSubmit}>
        {isEdit && (
          <button
            type="button"
            onClick={() => setOpenConfirm(true)}
            className="deleteBtn"
            id="deleteRadio"
            title="Eliminar Radio"
          >
            {icons.delete}
          </button>
        )}
        <h1>{isEdit ? "Editar Radio" : "Nueva Radio"}</h1>
        <section className="general">
          <div>
            <label htmlFor="tipo">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Seleccionar...
              </option>
              <option value="tren">Tren</option>
              <option value="fijo">Equipo fijo</option>
              <option value="handy">Handy</option>
            </select>
          </div>
          <div>
            <label htmlFor="modelo">Modelo</label>
            <select
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              disabled={!formData.tipo}
              required
            >
              {modelosDisponibles.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="id">ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              maxLength={10}
              autoComplete="off"
              placeholder="Ej.: 123456"
              required
            />
          </div>
          <div>
            <label htmlFor="alias">Alias</label>
            <input
              type="text"
              name="alias"
              id="alias"
              placeholder="Ej.: Formacion D LA"
              autoComplete="off"
              value={formData.alias}
              onChange={handleChange}
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="nserie">N° Serie</label>
            <input
              type="text"
              name="nserie"
              id="nserie"
              placeholder="Ej.: 857TPJ1516"
              autoComplete="off"
              value={formData.nserie}
              onChange={handleChange}
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="linea">Línea</label>
            <select
              name="linea"
              id="linea"
              value={formData.linea}
              onChange={handleChange}
            >
              <option value="N/A">N/A</option>
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
          </div>
          <div>
            <label htmlFor="liberado">Liberado (Todos los canales)</label>
            <Toggle
              name="liberado"
              value={formData.liberado}
              onChange={handleToggle}
              iconOn={icons.ok}
              iconOff={icons.error}
            />
          </div>
          {!isEdit && (
            <>
              <div>
                <label htmlFor="operativo">Operativo</label>
                <Toggle
                  name="operativo"
                  value={formData.operativo}
                  onChange={handleToggle}
                  iconOn={icons.ok}
                  iconOff={icons.error}
                />
              </div>
              {formData.tipo !== "handy" && (
                <div>
                  <label htmlFor="instalado">Instalado</label>
                  <Toggle
                    name="instalado"
                    value={formData.instalado}
                    onChange={handleToggle}
                    iconOn={icons.ok}
                    iconOff={icons.error}
                  />
                </div>
              )}
            </>
          )}
          <div>
            <label>Ubicación</label>

            {formData.instalado ? (
              <input value="En campo" disabled />
            ) : (
              <select
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
              >
                <option value="laboratorio">En laboratorio</option>
                <option value="policia">En policía</option>
                <option value="otro">Otro</option>
              </select>
            )}
          </div>
        </section>
        {formData.tipo === "tren" && formData.instalado && (
          <section className="tipoTren">
            <div>
              <label htmlFor="modeloTren">Modelo Tren</label>
              <select
                name="modeloTren"
                id="modeloTren"
                value={formData.modeloTren}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Seleccionar...
                </option>

                {trenesDisponibles.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="formacion">Formación</label>
              <input
                type="text"
                name="formacion"
                id="formacion"
                autoComplete="off"
                value={formData.formacion}
                onChange={handleChange}
                maxLength={10}
              />
            </div>
            <div>
              <label htmlFor="cabina">Cabina</label>
              <select
                name="cabina"
                id="cabina"
                value={formData.cabina}
                disabled={!formData.modeloTren}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Seleccionar...
                </option>

                {cabinasDisponibles.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}
        {((formData.tipo === "fijo" && formData.instalado) ||
          formData.tipo === "handy") && (
          <section className="tipoFijo-Handy">
            <div>
              <label htmlFor="sector">Sector</label>
              <input
                type="text"
                name="sector"
                id="sector"
                maxLength={20}
                autoComplete="off"
                value={formData.sector}
                onChange={handleChange}
                placeholder="Ej.: Tráfico"
              />
            </div>
            <div>
              <label htmlFor="responsable">Responsable</label>
              <input
                type="text"
                name="responsable"
                id="responsable"
                autoComplete="off"
                value={formData.responsable}
                onChange={handleChange}
                maxLength={20}
                placeholder="Ej.: Supervisor Pérez"
              />
            </div>
          </section>
        )}
        <button type="submit" className="submitButton">
          {isEdit ? "Guardar cambios" : "Crear radio"}
        </button>
      </form>
      <Confirm
        open={openConfirm}
        title="Eliminar radio"
        message="Esta acción no se puede deshacer"
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </>
  );
}
export default FormRadio;
