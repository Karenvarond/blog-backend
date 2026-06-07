const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'No se proporcionaron credenciales de autenticacion'
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'Formato de token invalido, use Bearer <token>'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Token invalido o expirado'
    });
  }
};

module.exports = { verifyToken };