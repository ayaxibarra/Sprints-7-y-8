
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar configuración del secreto
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado.');
      return res.status(500).json({
        message: 'Error de configuración del servidor.'
      });
    }

    // Obtener token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Acceso denegado. Se requiere autenticación.'
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token || token.includes(' ')) {
      return res.status(401).json({
        message: 'Formato de token inválido.'
      });
    }

    // Verificar firma y expiración
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        message: 'Token inválido.'
      });
    }

    // Comprobar que el usuario siga existiendo
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'El usuario asociado al token ya no existe.'
      });
    }

    // Guardar información para los siguientes middlewares
    req.user = {
      id: user._id.toString(),
      email: user.email,
      nombre: user.nombre,
      role: user.role
    };

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'La sesión ha expirado. Iniciá sesión nuevamente.'
      });
    }

    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        message: 'Token inválido.'
      });
    }

    console.error('Error en authMiddleware:', error);

    return res.status(500).json({
      message: 'Error interno al verificar la autenticación.'
    });
  }
};

module.exports = authMiddleware;
