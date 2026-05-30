const { PrismaClient } = require('@prisma/client');

// Instância única e reutilizável do PrismaClient.
// A URL de conexão é lida automaticamente da variável DATABASE_URL do arquivo .env
const prisma = new PrismaClient();

module.exports = prisma;
