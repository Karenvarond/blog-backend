const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Seguridad - cabeceras HTTP
app.use(helmet());

// Parsear JSON
app.use(express.json());

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - protección contra fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' }
});
app.use(limiter);

// Rutas
const authRoutes = require('./routes/auth.routes');
const feedRoutes = require('./routes/feed.routes');

app.use('/api', authRoutes);
app.use('/api', feedRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: 'Blog API funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;