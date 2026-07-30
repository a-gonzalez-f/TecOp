export const getTipoEvento = (tipo) => {
  switch (tipo) {
    case "holdingRegisters":
      return "Lectura";
    case "connection":
      return "Conexión";
    default:
      return tipo ?? "-";
  }
};
