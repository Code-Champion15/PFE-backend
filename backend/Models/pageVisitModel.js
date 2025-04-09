// models/PageVisit.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../Db/db");

const PageVisit = sequelize.define("PageVisit", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  pageRoute: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  visitDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  visitTime: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  durationSeconds: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: true  
  }
});

module.exports = PageVisit;
