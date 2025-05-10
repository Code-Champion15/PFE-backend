const { DataTypes } = require('sequelize');
const { sequelize } = require('../Db/db');

const Avis = sequelize.define("Avis", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
},
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  username: { 
    type: DataTypes.STRING, 
    allowNull: false 
},
  note: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  commentaire: { 
    type: DataTypes.TEXT 
},
}, 
{
  timestamps: true,
});

module.exports = Avis;
