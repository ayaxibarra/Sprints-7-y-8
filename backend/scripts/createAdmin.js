require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectDB = require('../config/db');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    // Verificar variables de entorno
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('Faltan las variables ADMIN_NAME, ADMIN_EMAIL o ADMIN_PASSWORD.');
    }

    const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

    if (ADMIN_PASSWORD.length < 8 || ADMIN_PASSWORD.length > 128) {
      throw new Error('La contraseña debe tener entre 8 y 128 caracteres.');
    }

    // Conectar a MongoDB
    await connectDB();

    // Comprobar si ya existe el usuario
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new Error('Ya existe un usuario con ese email. No se realizaron cambios.');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Crear administrador
    await User.create({
      nombre: ADMIN_NAME.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Administrador creado correctamente.');
  } catch (error) {
    console.error('Error al crear administrador:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();