import ReactECharts from "echarts-for-react";
import { formatFechas } from "../../utils/formatFechas";
import { useMemo } from "react";

function AccionamientosChart({ data, horarioEnServicio }) {
  const fechas = useMemo(() => formatFechas(data), [data]);

  const accionamientos = useMemo(
    () => data.map((d) => d.delta_accionam),
    [data],
  );

  const mediaMovil = useMemo(
    () =>
      data.map((d) =>
        horarioEnServicio ? d.media_movil_servicio : d.media_movil_completo,
      ),
    [data, horarioEnServicio],
  );

  const option = useMemo(
    () => ({
      title: {
        text: "Accionamientos",
        textStyle: {
          color: "#fff",
          fontFamily: "Arial",
        },
      },
      backgroundColor: "transparent",

      tooltip: {
        trigger: "axis",
        textStyle: {
          color: "#fff",
          fontSize: 13,
        },
        backgroundColor: "#222",
        borderColor: "#555",
      },

      dataZoom: [{ type: "slider", show: false }, { type: "inside" }],

      legend: {
        data: ["Accionamientos", "Media móvil"],
        textStyle: {
          color: "#ccc",
          fontSize: 14,
        },
      },
      xAxis: {
        type: "category",
        data: fechas,
        axisLabel: {
          color: "#fff",
        },
      },

      yAxis: {
        type: "value",
        axisLabel: {
          color: "#fff",
          fontSize: 12,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,0.08)",
            width: 1,
            type: "solid",
          },
        },
      },
      series: [
        {
          name: "Accionamientos",
          type: "line",
          color: "#4786b3",
          smooth: true,
          showSymbol: false,
          data: accionamientos,
        },
        {
          name: "Media móvil",
          type: "line",
          color: "#7dbda1",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            type: "dashed",
          },
          data: mediaMovil,
        },
      ],
    }),
    [fechas, accionamientos, mediaMovil],
  );

  return (
    <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
  );
}

export default AccionamientosChart;
