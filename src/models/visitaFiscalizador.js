const getVisitaFiscalizadorModel = (sequelize, { DataTypes }) => {
  const VisitaFiscalizador = sequelize.define(
    "visita_fiscalizador",
    {
      visita_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "visitas",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      fiscalizador_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "visita_fiscalizadores",
      underscored: true,
    }
  );

  return VisitaFiscalizador;
};

export default getVisitaFiscalizadorModel;
