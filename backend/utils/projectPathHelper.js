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


exports.getProjectDetails = async (userId) => {
  if (!userId) {
    console.error("userId est undefined dans getProjectDetails");
    return null;
  }

  // Trouver le projet actif
  const projetActif = await Projet.findOne({ where: { userId, isActive: true } });
  if (!projetActif) return null;

  // Retourner à la fois le chemin et l'ID du projet
  return {
    projectId: projetActif.id,  // Ajout de l'ID du projet
    path: projetActif.path       // Retourner également le chemin du projet
  };
};

// exports.getPagesPath = async (userId) => {
//   const projectPath = await exports.getProjectPath(userId);
//   if (!projectPath) return null;
//   return path.join(projectPath, "src", "pages");
// };

exports.getPagesPath = async (userId) => {
  const projectDetails = await exports.getProjectDetails(userId);
  if (!projectDetails) return null;

  return path.join(projectDetails.path, "src", "pages");
};
