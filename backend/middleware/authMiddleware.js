const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET ;

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Token invalide" });
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "Token manquant" });
  }
};