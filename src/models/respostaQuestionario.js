const getRespostaQuestionarioModel = (sequelize, { DataTypes }) => {
  const RespostaQuestionario = sequelize.define(
    "resposta_questionario",
    {
      visita_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "visitas",
          key: "id",
        },
      },
      pergunta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "perguntas_questionario",
          key: "id",
        },
      },
      resposta: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "respostas_questionario",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["visita_id", "pergunta_id"],
        },
      ],
    }
  );

  RespostaQuestionario.associate = (models) => {
    RespostaQuestionario.belongsTo(models.Visita, {
      foreignKey: "visita_id",
      as: "visita",
      onDelete: "CASCADE",
    });

    RespostaQuestionario.belongsTo(models.PerguntaQuestionario, {
      foreignKey: "pergunta_id",
      as: "pergunta",
      onDelete: "RESTRICT",
    });
  };

  return RespostaQuestionario;
};

export default getRespostaQuestionarioModel;
