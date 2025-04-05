const { DataTypes } = require('sequelize');
const {sequelize} = require('../Db/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
     email: {
         type: DataTypes.STRING,
         allowNull: false
     },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
     role: {
        type: DataTypes.ENUM('client', 'admin', 'super-admin'),
        defaultValue: 'admin',  
        allowNull: false,  
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    failedAttempts: { 
        type: DataTypes.INTEGER, 
        default: 0 },
}, {
    freezeTableName: true,
});

module.exports = User;
