// backend/Models/pageModel.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../Db/db');

const Page = sequelize.define('Page', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  parentId: {  
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Pages', 
      key: 'id',       
    },
    onDelete: 'SET NULL', 
  },
  generatedCode: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
}, {
  
  timestamps: true, 
});

Page.belongsTo(Page, { foreignKey: 'parentId', as: 'parent' });
Page.hasMany(Page, { foreignKey: 'parentId', as: 'children' });

module.exports = Page;
