const errorHandler = (err, req, res, next) => {
  // Asegurar 400 ante errores de validación o conversión de tipos de Mongoose
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    err.statusCode = 400;
  }

  // Compatibilidad con err.statusCode y err.status (por defecto 500)
  const statusCode = err.statusCode || err.status || 500;

  // Registrar errores de servidor (500) sin exponer trazas al cliente
  if (statusCode >= 500) {
    console.error(`[Error 500] ${req.method} ${req.originalUrl}:`, err.message);
  } else {
    console.warn(`[Error ${statusCode}] ${req.method} ${req.originalUrl}:`, err.message);
  }

  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor.'
  });
};

module.exports = errorHandler;