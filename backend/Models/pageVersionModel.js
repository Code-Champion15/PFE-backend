const {DataTypes} = require("sequelize");
const {sequelize} = require("../Db/db");

const PageVersion = sequelize.define("PageVersion", {
    id:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pageId:    { type: DataTypes.INTEGER, allowNull: false },
    content:   { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false }

});

module.exports = PageVersion;