const getAssinaturaModel = (sequelize, { DataTypes }) => {
  const Assinatura = sequelize.define(
    "assinatura",
    {
      documento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "documentos",
          key: "id",
        },
      },
      assinante_nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      assinante_tipo: {
        type: DataTypes.ENUM("fiscalizador", "denunciado", "testemunha"),
        allowNull: false,
      },
      imagem_assinatura_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      data_assinatura: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "assinaturas",
      underscored: true,
    }
  );

  Assinatura.associate = (models) => {
    Assinatura.belongsTo(models.Documento, {
      foreignKey: "documento_id",
      as: "documento",
      onDelete: "CASCADE",
    });
  };

  return Assinatura;
};

export default getAssinaturaModel;
