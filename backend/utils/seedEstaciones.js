import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Station from "../models/Estaciones.js";

dotenv.config({ path: "./backend/.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "../data/estaciones.csv");

async function seed() {
  try {
    await connectDB();

    const csv = fs.readFileSync(csvPath, "utf8");

    const lines = csv.trim().split("\n");

    lines.shift();

    const estaciones = lines.map((line) => {
      const [linea, nombre, ip] = line.split(",");

      return {
        linea: linea.trim(),
        nombre: nombre.trim(),
        ip: ip.trim(),
        puerto: 80,
        enabled: true,
      };
    });

    for (const estacion of estaciones) {
      await Station.findOneAndUpdate(
        {
          nombre: estacion.nombre,
          linea: estacion.linea,
        },
        estacion,
        {
          upsert: true,
        },
      );
    }

    console.log(`Seed completado (${estaciones.length} estaciones)`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
