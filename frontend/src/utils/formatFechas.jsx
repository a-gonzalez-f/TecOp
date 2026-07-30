export function formatFechas(data) {
  return data.map((d) =>
    new Date(d.fecha).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
}

export function formatFecha(fecha) {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatFechaHM(fecha) {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFechaHMS(fecha, conBr = true) {
  if (!fecha) return "-";

  const date = new Date(fecha);

  const fechaStr = date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const horaStr = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return conBr ? (
    <>
      {fechaStr}
      <br />
      {horaStr}
    </>
  ) : (
    `${fechaStr} ${horaStr}`
  );
}
