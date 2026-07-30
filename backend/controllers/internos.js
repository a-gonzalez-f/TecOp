import Interno from "../models/Interno.js";

export const searchInternos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const regex = new RegExp(q, "i");

    const internos = await Interno.find({
      $or: [
        { LINEA: regex },
        { REF1: regex },
        { REF2: regex },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$INTERNO" },
              regex: q,
            },
          },
        },
      ],
    }).limit(50);

    res.json(internos);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar internos",
    });
  }
};

export const updateInterno = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = ["LINEA", "REF1", "REF2"];

    const updates = {};

    for (const key of Object.keys(req.body)) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedInterno = await Interno.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedInterno) {
      return res.status(404).json({
        error: "Interno no encontrado",
      });
    }

    res.json(updatedInterno);
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar interno",
    });
  }
};

export const createInterno = async (req, res) => {
  try {
    let { LINEA, REF1, REF2, INTERNO } = req.body;

    if (!INTERNO) {
      return res.status(400).json({
        error: "El interno es obligatorio",
      });
    }

    INTERNO = Number(INTERNO);

    if (isNaN(INTERNO) || INTERNO < 1000 || INTERNO > 9999) {
      return res.status(400).json({
        error: "El interno debe tener 4 cifras",
      });
    }

    LINEA = LINEA?.trim().toUpperCase() || "";

    if (LINEA.length === 1 && /^[A-Z]$/.test(LINEA)) {
      LINEA = `LINEA ${LINEA}`;
    }

    const existingInterno = await Interno.findOne({
      INTERNO,
    });

    if (existingInterno) {
      return res.status(409).json({
        error: "El interno ya existe",
      });
    }

    const newInterno = await Interno.create({
      LINEA,
      REF1: REF1?.trim() || "",
      REF2: REF2?.trim() || "",
      INTERNO,
    });

    res.status(201).json(newInterno);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear interno",
    });
  }
};
