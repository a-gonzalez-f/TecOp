import { useState } from "react";
import RadioCard from "../RadioCard/RadioCard";
import "./ContainerRadios.css";
import { icons } from "../../assets/icons/Icons";

function ContainerRadios({ radios, loading, onOpenDetail, onOpenEdit }) {
  const [search, setSearch] = useState("");
  const [linea, setLinea] = useState("");
  const [operativo, setOperativo] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const radiosFiltradas = radios.filter((radio) => {
    const matchTexto = `${radio.nserie} ${radio.alias} ${radio.id}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchLinea = linea ? radio.linea === linea : true;
    const matchUbicacion = ubicacion ? radio.ubicacion === ubicacion : true;
    const matchOperativo = operativo
      ? radio.operativo === (operativo === "true")
      : true;

    return matchTexto && matchLinea && matchUbicacion && matchOperativo;
  });
  return (
    <>
      <div className="filtros">
        <input
          id="buscador"
          type="text"
          placeholder="Buscar por ID, Alias, N° Serie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={linea} onChange={(e) => setLinea(e.target.value)}>
          <option value="">Todas las líneas</option>
          <option className="bg-A" value="A">
            Línea A
          </option>
          <option className="bg-B" value="B">
            Línea B
          </option>
          <option className="bg-C" value="C">
            Línea C
          </option>
          <option className="bg-D" value="D">
            Línea D
          </option>
          <option className="bg-E" value="E">
            Línea E
          </option>
          <option className="bg-H" value="H">
            Línea H
          </option>
          <option className="bg-P" value="P">
            Línea P
          </option>
        </select>

        <select
          value={operativo}
          onChange={(e) => setOperativo(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="true">Operativas</option>
          <option value="false">Falla</option>
        </select>

        <select
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        >
          <option value="">Todas las ubicaciones</option>
          <option value="campo">En campo</option>
          <option value="laboratorio">En laboratorio</option>
          <option value="policia">En policía</option>
          <option value="otro">Otro</option>
        </select>

        <button
          className="refreshBtn"
          onClick={() => {
            setSearch("");
            setLinea("");
            setUbicacion("");
            setOperativo("");
          }}
        >
          {icons.refresh}
        </button>
      </div>

      <div className="containerRadios">
        {loading ? (
          <p>Cargando...</p>
        ) : radiosFiltradas.length === 0 ? (
          <p className="noResults">
            Sin resultados
            {search && ` para "${search}"`}
            {linea && ` en Línea ${linea}`}
            {ubicacion && ` en ${ubicacion}`}
          </p>
        ) : (
          radiosFiltradas.map((radio) => (
            <RadioCard
              key={radio._id}
              radio={radio}
              onClick={() => onOpenDetail(radio)}
              onContextMenu={(e) => {
                onOpenEdit(radio);
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default ContainerRadios;
