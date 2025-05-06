const path = require("path");
const fs = require("fs");
const Projet = require("../Models/projet");

exports.getProjectPath = async (userId) => {
  if (!userId) {
    console.error("userId est undefined dans getProjectPath");
    return null;
  }
  const projetActif = await Projet.findOne({ where: { userId, isActive: true } });
  if (!projetActif) return null;
  return projetActif.path;
};

exports.getPagesPath = async (userId) => {
  const projectPath = await exports.getProjectPath(userId);
  if (!projectPath) return null;
  return path.join(projectPath, "src", "pages");
};
