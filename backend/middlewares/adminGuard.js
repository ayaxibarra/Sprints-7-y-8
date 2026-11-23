
const adminGuard = (req, res, next) => {
    // Comprobar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        message: 'Debés iniciar sesión para acceder.'
      });
    }
  
    // Comprobar que tenga permisos de administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'No tenés permisos para realizar esta acción.'
      });
    }
  
    next();
  };
  
  module.exports = adminGuard;
  