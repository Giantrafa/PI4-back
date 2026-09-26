const getPerguntaQuestionarioModel = (sequelize, { DataTypes }) => {
  const PerguntaQuestionario = sequelize.define(
    "pergunta_questionario",
    {
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      tipo_resposta: {
        type: DataTypes.ENUM("texto", "sim_nao", "numero", "data"),
        allowNull: false,
        defaultValue: "texto",
      },
      ordem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
    },
    {
      tableName: "perguntas_questionario",
      underscored: true,
    }
  );

  PerguntaQuestionario.associate = (models) => {
    PerguntaQuestionario.hasMany(models.RespostaQuestionario, {
      foreignKey: "pergunta_id",
      as: "respostas",
      onDelete: "RESTRICT",
    });
  };

  return PerguntaQuestionario;
};

export default getPerguntaQuestionarioModel;
