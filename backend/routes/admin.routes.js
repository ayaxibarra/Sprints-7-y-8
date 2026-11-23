const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminGuard = require('../middlewares/adminGuard');

// Ruta temporal para verificar permisos de administrador
router.get('/test', authMiddleware, adminGuard, (req, res) => {
  res.status(200).json({
    message: 'Acceso autorizado: sos administrador.',
    user: req.user
  });
});

module.exports = router;