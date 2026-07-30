import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Interno from "../models/Interno.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const resultados = [];

fs.createReadStream("./data/internos.csv")
  .pipe(csv())
  .on("data", (data) => {
    resultados.push({
      LINEA: data.LINEA,
      REF1: data.REF1,
      REF2: data.REF2,
      INTERNO: Number(data.INTERNO),
    });
  })
  .on("end", async () => {
    try {
      await Interno.deleteMany();

      await Interno.insertMany(resultados);

      console.log("Internos importados correctamente");

      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
