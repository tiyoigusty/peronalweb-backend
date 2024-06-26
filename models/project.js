"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  project.init(
    {
      image: DataTypes.STRING,
      project: DataTypes.STRING,
      start: DataTypes.STRING,
      end: DataTypes.STRING,
      duration: DataTypes.STRING,
      desc: DataTypes.STRING,
      tech1: DataTypes.STRING,
      tech2: DataTypes.STRING,
      tech3: DataTypes.STRING,
      tech4: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};
