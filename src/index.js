import "dotenv/config";
import cors from "cors";
import express from "express";
import { sequelize } from "./models/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Servidor express executando...");
});

const port = process.env.PORT || 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE_ON_SYNC === "true";

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
  app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`));
});