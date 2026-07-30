import toast from "react-hot-toast";
import "./RadioDetail.css";
import { icons } from "../../assets/icons/Icons";
import Toggle from "../Toggle/Toggle";
import { useState, useEffect } from "react";
import RadioEvents from "../RadioEvents/RadioEvents";

function RadioDetail({
  radio,
  onClose,
  onSuccess,
  onEdit,
  onUpdate,
  onAddEvent,
}) {
  if (!radio) return null;

  const [data, setData] = useState(radio);

  const [refreshEvents, setRefreshEvents] = useState(0);

  useEffect(() => {
    setData(radio);
  }, [radio]);

  if (!data) return null;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta radio?",
    );
    if (!confirmDelete) return;

    try {
      await toast.promise(
        fetch(`${import.meta.env.VITE_API_URL}/api/radios/${radio._id}`, {
          method: "DELETE",
        }).then((res) => {
          if (!res.ok) throw new Error();
        }),
        {
          loading: "Eliminando radio...",
          success: "Radio eliminada",
          error: "Error al eliminar",
        },
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (field) => {
    const prevValue = data[field];
    const newValue = !prevValue;

    setData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    onUpdate(radio._id, field, newValue);

    try {
      await toast.promise(
        (async () => {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/radios/${data._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                [field]: newValue,
              }),
            },
          );

          if (!res.ok) throw new Error();

          await fetch(`${import.meta.env.VITE_API_URL}/api/radio-events`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              radioId: data._id,
              type: "STATE_CHANGE",
              field,
              prevValue,
              newValue,
              description: `${field} ${newValue ? "ON" : "OFF"}`,
            }),
          });
        })(),
        {
          loading: "Actualizando...",
          success: "Estado actualizado",
          error: "Error al actualizar",
        },
      );
      setRefreshEvents((prev) => prev + 1);
    } catch (err) {
      setData((prev) => ({
        ...prev,
        [field]: prevValue,
      }));

      onUpdate(radio._id, field, prevValue);
      console.error(err);
    }
  };

  return (
    <div className="radioDetail">
      <div className="container">
        <div className={`dataContainer bg-${data.linea || "default"}`}>
          <div className="detailHead">
            <span>{data.id.toUpperCase()}</span>
            <Toggle
              name="operativo"
              value={data.operativo}
              iconOn={icons.ok}
              iconOff={icons.error}
              onChange={handleToggle}
            />
          </div>
          <div className="gralData">
            <div className="row">
              <p>ID: </p>
              <p>{data.id.toUpperCase()}</p>
            </div>
            <div className="row">
              <p>Alias: </p>
              <p>{data.alias.toUpperCase()}</p>
            </div>
            <div className="row">
              <p>N° Serie: </p>
              <p>{data.nserie.toUpperCase()}</p>
            </div>
            <div className="row">
              <p>Modelo: </p>
              <p>{data.modelo.toUpperCase()}</p>
            </div>
            <div className="row">
              <p>Ubicación: </p>
              <p>En {data.ubicacion}</p>
            </div>
          </div>
          {data.tipo === "tren" ? (
            <div className="trenData">
              <div className="row">
                <p>Modelo: </p>
                <p>{data.modeloTren.toUpperCase()}</p>
              </div>
              <div className="row">
                <p>Formación: </p>
                <p>{data.formacion.toUpperCase()}</p>
              </div>
              <div className="row">
                <p>Cabina: </p>
                <p>{data.cabina.toUpperCase()}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                <p>Sector: </p>
                <p>{data.sector}</p>
              </div>
              <div className="row">
                <p>Responsable</p>
                <p>{data.responsable}</p>
              </div>
            </>
          )}
          <div className="estados">
            <div>
              <label>Fuente</label>
              <Toggle
                name="fuente"
                value={data.fuente}
                iconOn={icons.fuenteOn}
                iconOff={icons.fuenteOff}
                onChange={handleToggle}
              />
            </div>
            <div>
              <label>Micrófono</label>
              <Toggle
                name="microfono"
                value={data.microfono}
                iconOn={icons.microfonoOn}
                iconOff={icons.microfonoOff}
                onChange={handleToggle}
              />
            </div>
            <div>
              <label>Antena</label>
              <Toggle
                name="antena"
                value={data.antena}
                iconOn={icons.antenaOn}
                iconOff={icons.antenaOff}
                onChange={handleToggle}
              />
            </div>
            <div>
              <label>Parlante</label>
              <Toggle
                name="parlante"
                value={data.parlante}
                iconOn={icons.parlanteOn}
                iconOff={icons.parlanteOff}
                onChange={handleToggle}
              />
            </div>
          </div>
          {data.linea !== "N/A" && (
            <div className="row">
              <p>Línea</p>
              <p>{data.linea}</p>
            </div>
          )}
          <div className="actionsRadio">
            <button
              className="editButton"
              type="button"
              onClick={() => onEdit(data)}
            >
              {icons.edit}
            </button>
            <button
              className="deleteButton"
              type="button"
              onClick={handleDelete}
            >
              {icons.delete}
            </button>
          </div>
        </div>
        <div className="eventsContainer">
          <button
            type="button"
            id="addRadioEvent"
            className="addBtn"
            onClick={() => onAddEvent(data)}
          >
            {icons.add}
          </button>

          <RadioEvents radioId={data._id} refresh={refreshEvents} />
        </div>
      </div>
    </div>
  );
}

export default RadioDetail;
