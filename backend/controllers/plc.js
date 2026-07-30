import PLC from "../models/PLC.js";

export const getPLCs = async (req, res) => {
  try {
    const plcs = await PLC.find({ enabled: true }).sort({
      linea: 1,
      nombre: 1,
    });

    res.json(plcs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPLC = async (req, res) => {
  try {
    const plc = await PLC.findById(req.params.id);

    if (!plc) {
      return res.status(404).json({
        message: "PLC no encontrado",
      });
    }

    res.json(plc);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePLC = async (req, res) => {
  try {
    const actualizado = await PLC.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });

    if (!actualizado) {
      return res.status(404).json({ message: "No encontrado" });
    }

    res.json(actualizado);
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: `Ya existe un PLC con esa IP`,
        field: Object.keys(error.keyPattern || {})[0],
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
