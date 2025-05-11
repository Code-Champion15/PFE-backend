const { DataTypes } = require('sequelize');
const { sequelize } = require('../Db/db');


const Connexion = sequelize.define("Connexion", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
},
    {
        timestamps: false
    }
);
module.exports = Connexion;
