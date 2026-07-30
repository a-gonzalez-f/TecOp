import ReactECharts from "echarts-for-react";
import { formatFechas } from "../../utils/formatFechas";
import { useMemo } from "react";

const mapaEstados = {
  funcionando: 4,
  alerta: 3,
  desconectada: 2,
  fs: 1,
};

const labelsEstados = {
  1: "Fuera de Servicio",
  2: "Desconectada",
  3: "Alerta",
  4: "Funcionando",
};

const coloresEstados = {
  funcionando: "#0dae1a",
  alerta: "#fca311",
  desconectada: "#888",
  fs: "#d90429",
};

function EstadosChart({ data }) {
  const fechas = useMemo(() => formatFechas(data), [data]);

  const estadosNumericos = useMemo(
    () => data.map((d) => mapaEstados[d.estado] ?? 0),
    [data],
  );

  const colores = useMemo(
    () => data.map((d) => coloresEstados[d.estado] ?? "#fff"),
    [data],
  );

  const option = useMemo(
    () => ({
      title: {
        text: "Estado",
        textStyle: {
          color: "#fff",
          fontFamily: "Arial",
        },
      },

      backgroundColor: "transparent",

      tooltip: {
        trigger: "axis",
        backgroundColor: "#222",
        borderColor: "#555",
        textStyle: {
          color: "#fff",
          fontSize: 13,
        },
        formatter: (params) =>
          `${params[0].axisValue}<br/>Estado: <b>${labelsEstados[params[0].value]}</b>`,
      },

      dataZoom: [{ type: "slider", show: false }, { type: "inside" }],

      xAxis: {
        type: "category",
        data: fechas,
        axisLabel: {
          color: "#fff",
        },
      },

      yAxis: {
        type: "value",
        min: 0,
        max: 4,
        interval: 1,

        axisLabel: {
          color: "#fff",
          formatter: (value) => labelsEstados[value] ?? "",
        },

        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,0.08)",
            width: 1,
          },
        },
      },

      series: [
        {
          name: "Estado",
          type: "line",
          data: estadosNumericos,

          step: "middle",
          smooth: false,

          symbol: "circle",
          symbolSize: 8,

          lineStyle: {
            width: 2,
            color: "#666",
          },

          itemStyle: {
            color: (params) => colores[params.dataIndex],
          },
        },
      ],
    }),
    [fechas, estadosNumericos, colores],
  );

  return (
    <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
  );
}

export default EstadosChart;
