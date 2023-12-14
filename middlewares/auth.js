const { AuthService } = require("../services/auth");

exports.validateToken = async function validateJWT(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const authService = new AuthService();
  const decoded = await authService.validateToken(token);
  console.log(decoded);
  req.user = decoded;
  next();
};
