const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Verificar conexion al iniciar el servidor
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Conexion a PostgreSQL establecida correctamente');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
}

connectDB();

module.exports = prisma;