import { icons } from "../assets/icons/Icons";

export const stateToIcon = (state) => {
  const stateMap = {
    funcionando: icons.ok,
    alerta: icons.alert,
    desconectada: icons.desconectado,
    fs: icons.error,
  };

  return stateMap[state] || null;
};
