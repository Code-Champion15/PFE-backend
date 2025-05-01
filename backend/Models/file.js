const { DataTypes } = require('sequelize');
const { sequelize } = require('../Db/db');


const File = sequelize.define('File', {
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    route: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {  
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    username: { 
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = File;