import Estacion from "../models/Estaciones.js";

export const getEstaciones = async (req, res) => {
  try {
    const estaciones = await Estacion.find().sort({ linea: 1 });
    res.json(estaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEstacionById = async (req, res) => {
  try {
    const estacion = await Estacion.findById(req.params.id);

    if (!estacion) {
      return res.status(404).json({ message: "No encontrada" });
    }

    res.json(estacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEstacion = async (req, res) => {
  try {
    const nueva = await Estacion.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEstacion = async (req, res) => {
  try {
    const actualizada = await Estacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true },
    );

    if (!actualizada) {
      return res.status(404).json({ message: "No encontrada" });
    }

    res.json(actualizada);
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: `Ya existe una estación con esa IP`,
        field: Object.keys(error.keyPattern || {})[0],
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const deleteEstacion = async (req, res) => {
  try {
    const eliminada = await Estacion.findByIdAndDelete(req.params.id);

    if (!eliminada) {
      return res.status(404).json({ message: "No encontrada" });
    }

    res.json({ message: "Eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
