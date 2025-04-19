const Page         = require("./pageModel");
const Modification = require("./modificationModel");
const PageVersion  = require("./pageVersionModel");
const User         = require("./userModel");
const PageVisit = require("./pageVisitModel");
const { sequelize } = require("../Db/db");

Page.hasMany(Page, { as: "Children", foreignKey: "parentId" });
Page.belongsTo(Page, { as: "Parent", foreignKey: "parentId" });

Page.hasMany(PageVisit, { foreignKey: "pageRoute", sourceKey: "route" });
PageVisit.belongsTo(Page, { foreignKey: "pageRoute", targetKey: "route" });

Page.hasMany(Modification, { foreignKey: "pageId" });
Modification.belongsTo(Page,   { foreignKey: "pageId" });

Page.hasMany(PageVersion,  { foreignKey: "pageId" });
PageVersion.belongsTo(Page,{ foreignKey: "pageId", onDelete: "CASCADE" });

User.hasMany(Modification, { foreignKey: "userId" });
Modification.belongsTo(User, { foreignKey: "userId" });



module.exports = { sequelize, Page, Modification, PageVersion, User, PageVisit };