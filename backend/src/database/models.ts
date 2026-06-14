import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./sequelize.js";

export class Quiz extends Model<
  InferAttributes<Quiz>,
  InferCreationAttributes<Quiz>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare createdAt: CreationOptional<Date>;
  declare questions?: NonAttribute<Question[]>;
}

export class Question extends Model<
  InferAttributes<Question>,
  InferCreationAttributes<Question>
> {
  declare id: CreationOptional<string>;
  declare text: string;
  declare type: string;
  declare position: number;
  declare booleanAnswer: boolean | null;
  declare textAnswer: string | null;
  declare quizId: ForeignKey<Quiz["id"]>;
  declare options?: NonAttribute<QuestionOption[]>;
}

export class QuestionOption extends Model<
  InferAttributes<QuestionOption>,
  InferCreationAttributes<QuestionOption>
> {
  declare id: CreationOptional<string>;
  declare text: string;
  declare isCorrect: CreationOptional<boolean>;
  declare position: number;
  declare questionId: ForeignKey<Question["id"]>;
}

Quiz.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "quizzes",
    timestamps: false,
  },
);

Question.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booleanAnswer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    textAnswer: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "questions",
    timestamps: false,
    indexes: [{ unique: true, fields: ["quizId", "position"] }],
  },
);

QuestionOption.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "question_options",
    timestamps: false,
    indexes: [{ unique: true, fields: ["questionId", "position"] }],
  },
);

Quiz.hasMany(Question, {
  as: "questions",
  foreignKey: "quizId",
  onDelete: "CASCADE",
});
Question.belongsTo(Quiz, {
  as: "quiz",
  foreignKey: "quizId",
});

Question.hasMany(QuestionOption, {
  as: "options",
  foreignKey: "questionId",
  onDelete: "CASCADE",
});
QuestionOption.belongsTo(Question, {
  as: "question",
  foreignKey: "questionId",
});
