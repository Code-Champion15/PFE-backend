const { DataTypes } = require('sequelize');
const { sequelize } = require('../Db/db');

const Projet = sequelize.define('Projet', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  timestamps: true,
  
});

module.exports = Projet;
