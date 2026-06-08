const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Cada ruta maneja diferente el acceso sin token
  const isMeRoute = req.path === '/me' || req.originalUrl.includes('/me');
  const missingTokenStatus = isMeRoute ? 400 : 403;

  if (!authHeader) {
    return res.status(missingTokenStatus).json({
      error: isMeRoute ? 'Solicitud incorrecta' : 'Acceso denegado',
      message: 'No se proporcionaron credenciales de autenticacion'
    });
  }

  // Verificamos que el token venga en formato Bearer para seguir el estandar
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(missingTokenStatus).json({
      error: isMeRoute ? 'Solicitud incorrecta' : 'Acceso denegado',
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