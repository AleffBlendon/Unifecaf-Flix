// Importa a instância única e reutilizável do PrismaClient.
const prisma = require('../prisma/prismaClient');

/**
 * Retorna todos os filmes cadastrados no banco.
 */
async function getAllFilmes() {
  return await prisma.tbl_filmes.findMany();
}

/**
 * Busca um filme pelo ID.
 * @param {number|string} id - ID do filme
 */
async function getFilmeById(id) {
  return await prisma.tbl_filmes.findUnique({
    where: { id: Number(id) },
  });
}

/**
 * Filtra filmes pelo nome (parcial) ou pela sinopse.
 * @param {string} termo - Texto a ser buscado
 */
async function getFilmesByNome(termo) {
  return await prisma.tbl_filmes.findMany({
    where: {
      OR: [
        { nome:    { contains: termo } },
        { sinopse: { contains: termo } },
      ],
    },
  });
}

/**
 * Cria um novo filme no banco.
 * @param {object} data - Dados do filme
 */
async function createFilme(data) {
  return await prisma.tbl_filmes.create({
    data: {
      nome:    data.nome,
      sinopse: data.sinopse  || null,
      genero:  data.genero   || null,
      ano:     data.ano      ? Number(data.ano)     : null,
      duracao: data.duracao  ? Number(data.duracao) : null,
      capa:    data.capa     || null,
    },
  });
}

/**
 * Atualiza os dados de um filme existente.
 * @param {number|string} id   - ID do filme
 * @param {object}        data - Novos dados
 */
async function updateFilme(id, data) {
  return await prisma.tbl_filmes.update({
    where: { id: Number(id) },
    data: {
      nome:    data.nome,
      sinopse: data.sinopse  || null,
      genero:  data.genero   || null,
      ano:     data.ano      ? Number(data.ano)     : null,
      duracao: data.duracao  ? Number(data.duracao) : null,
      capa:    data.capa     || null,
    },
  });
}

/**
 * Remove um filme do banco pelo ID.
 * @param {number|string} id - ID do filme
 */
async function deleteFilme(id) {
  return await prisma.tbl_filmes.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllFilmes,
  getFilmeById,
  getFilmesByNome,
  createFilme,
  updateFilme,
  deleteFilme,
};
