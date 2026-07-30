import Radio from "../models/Radio.js";
import RadioEvent from "../models/RadioEvent.js";

export const getRadios = async (req, res) => {
  try {
    const radios = await Radio.find().sort({ createdAt: -1 });
    res.json(radios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener radios" });
  }
};

export const createRadio = async (req, res) => {
  try {
    req.body.id = req.body.id?.trim().toUpperCase();
    req.body.nserie = req.body.nserie?.trim().toUpperCase();

    const nuevaRadio = new Radio(req.body);

    const guardada = await nuevaRadio.save();

    res.status(201).json(guardada);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(400).json({
        error: `${field.toUpperCase()} ya existe`,
      });
    }

    res.status(400).json({
      error: "Error al crear radio",
      detalle: error.message,
    });
  }
};

export const updateRadio = async (req, res) => {
  const trackFields = [
    "operativo",
    "antena",
    "microfono",
    "parlante",
    "fuente",
    "ubicacion",
  ];

  try {
    const { id } = req.params;

    // normalización
    if (req.body.id) {
      req.body.id = req.body.id.trim().toUpperCase();
    }

    if (req.body.nserie) {
      req.body.nserie = req.body.nserie.trim().toUpperCase();
    }

    const updates = req.body;

    // obtener estado actual
    const prevRadio = await Radio.findById(id);

    if (!prevRadio) {
      return res
        .status(404)
        .json({ error: "No se encontró la radio para actualizar" });
    }

    // detectar cambios
    const changes = [];

    for (const key in updates) {
      if (!trackFields.includes(key)) continue;

      const prevValue = prevRadio[key];
      const newValue = updates[key];

      const changed = prevValue !== newValue;

      if (changed) {
        changes.push({
          field: key,
          prevValue,
          newValue,
        });
      }
    }

    // actualizar radio
    const updatedRadio = await Radio.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // si no hubo cambios trackeables
    if (changes.length === 0) {
      return res.json(updatedRadio);
    }

    // crear eventos
    const events = changes.map((change) => ({
      radioId: id,
      type: "STATE_CHANGE",
      field: change.field,
      prevValue: change.prevValue,
      newValue: change.newValue,
      createdBy: "system",
    }));

    await RadioEvent.insertMany(events);

    res.json(updatedRadio);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(400).json({
        error: `${field.toUpperCase()} ya existe`,
      });
    }

    res.status(400).json({
      error: "Error al actualizar la radio",
      detalle: error.message,
    });
  }
};

export const deleteRadio = async (req, res) => {
  try {
    const { id } = req.params;

    const radioEliminada = await Radio.findByIdAndDelete(id);

    if (!radioEliminada) {
      return res.status(404).json({ error: "La radio no existe" });
    }

    res.json({ message: "Radio eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar la radio",
      detalle: error.message,
    });
  }
};
