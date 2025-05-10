//const Page = require("./pageModel");
const Modification = require("./modificationModel");
//const PageVersion = require("./pageVersionModel");
const User = require("./userModel");
//const PageVisit = require("./pageVisitModel");
const File = require("./file");
const Projet = require('./projet');

const { sequelize } = require("../Db/db");
const FileVisit = require("./fileVisit");
const Operation = require("./operationModel");

// Page.hasMany(Page, { as: "Children", foreignKey: "parentId" });
// Page.belongsTo(Page, { as: "Parent", foreignKey: "parentId" });

// Page.hasMany(PageVisit, { foreignKey: "pageRoute", sourceKey: "route" });
// PageVisit.belongsTo(Page, { foreignKey: "pageRoute", targetKey: "route" });

// Page.hasMany(Modification, { foreignKey: "pageId" });
// Modification.belongsTo(Page, { foreignKey: "pageId" });

// Page.hasMany(PageVersion, { foreignKey: "pageId" });
// PageVersion.belongsTo(Page, { foreignKey: "pageId", onDelete: "CASCADE" });

User.hasMany(Modification, { foreignKey: "userId" });
Modification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(File, { foreignKey: 'userId' });
File.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(FileVisit, {
    foreignKey: 'userId',
    as: 'pageVisits',
});

FileVisit.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

User.hasMany(Projet, { foreignKey: 'userId' });
Projet.belongsTo(User, { foreignKey: 'userId' });

Projet.hasMany(File, { foreignKey: 'projectId' });
File.belongsTo(Projet, { foreignKey: 'projectId' });

Projet.hasMany(Operation, { foreignKey: 'projectId' });
Operation.belongsTo(Projet, { foreignKey: 'projectId' });



module.exports = { sequelize, Modification, User, FileVisit, Projet, File, Operation };