import RadioEvent from "../models/RadioEvent.js";
import Radio from "../models/Radio.js";

export const createRadioEvent = async (req, res) => {
  try {
    const {
      radioId,
      tipoEvento,
      fecha,
      descripcion,
      formacion,
      cabina,
      cambioFuente,
      cambioMic,
      cambioAntena,
      cambioParlante,
      linea,
      modeloTren,
    } = req.body;

    if (!radioId || !tipoEvento) {
      return res.status(400).json({
        error: "radioId y tipoEvento son obligatorios",
      });
    }

    // CREAR EVENTO (histórico)
    const event = new RadioEvent({
      radioId,
      type: "MANUAL",
      tipoEvento,
      fecha,
      descripcion,
      formacion,
      cabina,
      cambios: {
        fuente: cambioFuente,
        microfono: cambioMic,
        antena: cambioAntena,
        parlante: cambioParlante,
      },
      linea,
      modeloTren,
    });

    await event.save();

    // ACTUALIZAR RADIO (estado actual)
    if (tipoEvento === "montaje") {
      await Radio.findByIdAndUpdate(radioId, {
        $set: {
          formacion,
          cabina,
          tipo: "tren",
          linea,
          modeloTren,
        },
      });
    }

    if (tipoEvento === "desmonte") {
      await Radio.findByIdAndUpdate(radioId, {
        $set: {
          formacion: "",
          cabina: "",
        },
      });
    }

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear evento" });
  }
};

export const getRadioEvents = async (req, res) => {
  try {
    const { radioId } = req.query;

    if (!radioId) {
      return res.status(400).json({
        error: "radioId es requerido",
      });
    }

    const events = await RadioEvent.find({ radioId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(events);
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    res.status(500).json({
      error: "Error al obtener eventos",
    });
  }
};
