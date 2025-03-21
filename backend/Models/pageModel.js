const { DataTypes } = require("sequelize");
const {sequelize} = require("../Db/db");

const Page = sequelize.define("Page", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  route: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Pages", 
      key: "id",
    },
    onDelete: "CASCADE", 
  },
});

Page.hasMany(Page, { as: "Children", foreignKey: "parentId" });
Page.belongsTo(Page, { as: "Parent", foreignKey: "parentId" });

module.exports = Page;
