require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const helmet = require('helmet');

const app = express();

// Middlewares globales
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json({ limit: '10kb' }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API de Sprints 7 y 8 funcionando correctamente.'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Manejo de rutas inexistentes
app.use(notFound);

// Manejo centralizado de errores
app.use(errorHandler);

// Iniciar servidor después de conectar MongoDB
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();