const path = require("path");
const fs = require("fs");

const ACTIVE_PROJECT_PATH_FILE = path.join(__dirname, "../uploads/activeProjectPath.json");

exports.setActiveProjectPath = (projectPath) => {
  fs.writeFileSync(ACTIVE_PROJECT_PATH_FILE, JSON.stringify({ path: projectPath }));
};

exports.getPagesPath = () => {
  if (!fs.existsSync(ACTIVE_PROJECT_PATH_FILE)) {
    return null; // <-- Ne plus throw d'erreur ici
  }

  const { path: projectPath } = JSON.parse(fs.readFileSync(ACTIVE_PROJECT_PATH_FILE, "utf-8"));
  if (!projectPath) return null;

  return path.join(projectPath, "src", "pages");
};

exports.getProjectPath = () => {
  if (!fs.existsSync(ACTIVE_PROJECT_PATH_FILE)) {
    return null;
  }

  const { path: projectPath } = JSON.parse(fs.readFileSync(ACTIVE_PROJECT_PATH_FILE, "utf-8"));
  return projectPath || null;
};
