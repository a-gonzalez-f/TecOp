import { useEffect, useState } from "react";
import { icons } from "../../assets/icons/Icons";
import "./RadioEvents.css";
import { capitalize } from "../../utils/format";

function getEventData(e) {
  if (e.type === "STATE_CHANGE") {
    let newIcon = e.field + (e.newValue ? "On" : "Off");
    let prevIcon = e.field + (e.prevValue ? "On" : "Off");

    if (e.field === "operativo") {
      newIcon = e.newValue ? "ok" : "error";
      prevIcon = e.prevValue ? "ok" : "error";
    }

    return {
      label: capitalize(e.field),
      prevIcon,
      newIcon,
      isState: true,
    };
  }

  if (e.type === "MANUAL") {
    if (e.tipoEvento === "cambio") {
      return {
        label: "Cambio comp.",
        cambios: e.cambios,
        esCambio: true,
      };
    }
    if (e.tipoEvento === "desmonte" || e.tipoEvento === "montaje") {
      return {
        label: capitalize(e.tipoEvento),
        formacion: e.formacion,
        cabina: e.cabina,
        esMontaje: true,
      };
    }
    if (e.tipoEvento === "envioPolicia") {
      return {
        label: "Envío a Policía",
        descripcion: e.descripcion,
        esEnvío: true,
      };
    }
    if (e.tipoEvento === "falla") {
      return {
        label: capitalize(e.tipoEvento),
        descripcion: e.descripcion,
        esFalla: true,
      };
    }
  }

  return {
    label: e.description || e.type,
    isState: false,
  };
}

function RadioEvents({ radioId, refresh }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/radio-events?radioId=${radioId}`,
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error cargando eventos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (radioId) fetchEvents();
  }, [radioId, refresh]);

  return (
    <div className="eventsList">
      {loading && <p>Cargando eventos...</p>}

      {!loading && events.length === 0 && <p>Sin eventos</p>}

      {!loading &&
        events.map((e) => {
          const eventData = getEventData(e);

          const prevIcon = icons[eventData.prevIcon] || "❓";
          const newIcon = icons[eventData.newIcon] || "❓";

          return (
            <div key={e._id} className="eventItem">
              <div>
                <p>{eventData.label}</p>
              </div>

              {eventData.isState && (
                <p className="stateChange">
                  {prevIcon} {icons.arrow} {newIcon}
                </p>
              )}
              {eventData.esCambio && (
                <div className="cambiosIcons">
                  {Object.entries(e.cambios || {})
                    .filter(([_, value]) => value)
                    .map(([key]) => {
                      const iconName = key + "On";
                      return (
                        <span key={key} className="iconCambio">
                          {icons[iconName] || "❓"}
                        </span>
                      );
                    })}
                </div>
              )}
              {eventData.esMontaje && (
                <div className="montado">
                  <p>
                    Form.: <b>{eventData.formacion}</b>
                  </p>
                  <p>
                    Cab.: <b>{eventData.cabina}</b>
                  </p>
                </div>
              )}
              {(eventData.esFalla || eventData.esEnvío) && (
                <div className="descripcion">{eventData.descripcion}</div>
              )}
              <div>
                <span className="eventDate">
                  {new Date(e.createdAt).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default RadioEvents;
