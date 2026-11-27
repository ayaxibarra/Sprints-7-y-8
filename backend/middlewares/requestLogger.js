/**
 * Middleware para registrar peticiones HTTP en Express.
 * Ligero y seguro: registra timestamp, método, URL, status code y tiempo de respuesta.
 * No registra credenciales, contraseñas, tokens JWT ni cuerpos de solicitud.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = requestLogger;
