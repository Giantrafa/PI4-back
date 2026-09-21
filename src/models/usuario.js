const getUsuarioModel = (sequelize, { DataTypes }) => {
  const Usuario = sequelize.define(
    "usuario",
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      senha_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "gestor", "fiscalizador"),
        allowNull: false,
      },
    },
    {
      tableName: "usuarios",
      underscored: true,
    }
  );

  return Usuario;
};

export default getUsuarioModel;