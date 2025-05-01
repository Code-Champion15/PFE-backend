const { DataTypes } = require("sequelize");
const { sequelize } = require("../Db/db");

const Operation = sequelize.define("Operation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  operationType: {
    type: DataTypes.ENUM("creation", "modification"),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  
  timestamps: true,        
});

module.exports = Operation;
