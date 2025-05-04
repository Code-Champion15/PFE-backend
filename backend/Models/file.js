const { DataTypes } = require('sequelize');
const { sequelize } = require('../Db/db');

const File = sequelize.define('File', {
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
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
    },
     projectId: {
         type: DataTypes.INTEGER,
         allowNull: true,
    //     references: {
    //         model: 'projects', // Nom de la table de référence
    //         key: 'id',         // La colonne de référence dans la table 'projects'
    //       },
       }
});

module.exports = File;