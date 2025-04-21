
// module.exports = (requiredRole) => (req, res, next) => {
//     const user = req.user;
//     if (!user || user.role !== requiredRole) {
//       return res.status(403).json({ message: "Accès non autorisé" });
//     }
//     next();
//   };
// middleware/authorize.js

module.exports = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        if (user.role !== requiredRole) {
            return res.status(403).json({ message: "Accès non autorisé" });
        }

        // L'utilisateur a le bon rôle
        next();
    };
};
