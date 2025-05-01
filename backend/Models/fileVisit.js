const { DataTypes } = require("sequelize");
const { sequelize } = require("../Db/db");

const FileVisit = sequelize.define("FileVisit", {

      pageName: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   notNull: { msg: 'Le nom de la page est requis' },
        //   notEmpty: { msg: 'Le nom de la page ne peut pas être vide' },
        // },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false, 
        defaultValue: 'Anonyme', 
      },
      visitTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, 
      },
      durationSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      timestamps: true, 
    });
  
module.exports = FileVisit; 