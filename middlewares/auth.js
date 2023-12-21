const { AuthService } = require("../services/auth");

exports.validateToken = async function validateJWT(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const authService = new AuthService();
  try {
    const decoded = await authService.validateToken(token);
    req.user = decoded;
  } catch (err) {
    res.apiError(err.message, err.statusCode);
  }

  next();
};
