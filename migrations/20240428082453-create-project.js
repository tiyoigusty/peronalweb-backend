"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
      },
      project: {
        type: Sequelize.STRING,
      },
      start: {
        type: Sequelize.STRING,
      },
      end: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.STRING,
      },
      desc: {
        type: Sequelize.STRING,
      },
      tech1: {
        type: Sequelize.STRING,
      },
      tech2: {
        type: Sequelize.STRING,
      },
      tech3: {
        type: Sequelize.STRING,
      },
      tech4: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("projects");
  },
};
