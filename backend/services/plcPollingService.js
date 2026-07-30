import PLC from "../models/PLC.js";
import PLCHistory from "../models/PLCHistory.js";
import { readHoldingRegisters } from "./modbusService.js";

let polling = false;

export async function pollPLCs() {
  if (polling) return;

  polling = true;

  try {
    const plcs = await PLC.find({ enabled: true });

    for (const plc of plcs) {
      await pollPLC(plc);
    }
  } finally {
    polling = false;
  }
}

async function pollPLC(plc) {
  const startTime = Date.now();

  try {
    const holdingRegisters = await readHoldingRegisters({
      ip: plc.ip,
      port: plc.puerto,
      slaveId: plc.slaveId,
      start: plc.holdingRegistersConfig.start,
      length: plc.holdingRegistersConfig.length,
    });

    const latency = Date.now() - startTime;
    const now = new Date();

    const update = {
      online: true,
      lastRead: now,
      latency,
      holdingRegisters,
      lastError: null,
    };

    if (!plc.online) {
      update.lastStatusChange = now;
    }

    await PLC.findByIdAndUpdate(plc._id, update);

    const cambioConexion = !plc.online || plc.lastError !== null;
    const cambioRegistros = !arraysEqual(
      plc.holdingRegisters,
      holdingRegisters,
    );

    if (cambioConexion) {
      await saveHistory({
        tipo: "connection",
        plcId: plc._id,
        online: true,
        latency,
        holdingRegisters,
        lastError: null,
      });
    }

    if (cambioRegistros) {
      await saveHistory({
        tipo: "holdingRegisters",
        plcId: plc._id,
        online: true,
        latency,
        holdingRegisters,
        lastError: null,
      });
    }
  } catch (err) {
    const now = new Date();

    const update = {
      online: false,
      lastRead: now,
      latency: null,
      holdingRegisters: [],
      lastError: err.message,
    };

    if (plc.online) {
      update.lastStatusChange = now;
    }

    await PLC.findByIdAndUpdate(plc._id, update);

    const cambioConexion = plc.online || plc.lastError !== err.message;

    if (cambioConexion) {
      await saveHistory({
        tipo: "connection",
        plcId: plc._id,
        online: false,
        latency: null,
        holdingRegisters: [],
        lastError: err.message,
      });
    }

    console.error(`[PLC ${plc.nombre}] ${err.message}`);
  }
}

async function saveHistory({
  tipo,
  plcId,
  online,
  latency,
  holdingRegisters,
  lastError,
}) {
  await PLCHistory.create({
    tipo,
    plc: plcId,
    online,
    latency,
    holdingRegisters,
    lastError,
  });
}

function arraysEqual(a = [], b = []) {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}
