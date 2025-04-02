const { DataTypes } = require("sequelize");
const {sequelize} = require("../Db/db");
const Page = require("./pageModel");
const User = require("./userModel");

const Modification = sequelize.define("Modification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Page,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  operationType: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  pageName: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  oldContent: {
    type: DataTypes.TEXT("long"),
    allowNull: true, 
  },
  newContent: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

Modification.belongsTo(Page, { foreignKey: "pageId" });

module.exports = Modification;