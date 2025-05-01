// models/FileHistory.js
module.exports = (sequelize, DataTypes) =>
    sequelize.define("FileHistory", {
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      oldCode: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      newCode: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      editedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  