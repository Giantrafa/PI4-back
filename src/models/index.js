import Sequelize from "sequelize";
import pg from "pg";

import getUsuarioModel from "./usuario.js";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
});

const models = {
    Usuario: getUsuarioModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;