import PLCHistory from "../models/PLCHistory.js";

export async function getPLCHistory(req, res) {
  try {
    const { plcId } = req.params;

    const limit = Math.min(Number(req.query.limit) || 100, 500);

    const history = await PLCHistory.find({ plc: plcId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error al obtener el historial del PLC",
    });
  }
}
