const { DataTypes } = require('sequelize');
const {sequelize} = require('../Db/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('client', 'admin', 'super-admin'),
        defaultValue: 'client',  
        allowNull: false,  
      },
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
