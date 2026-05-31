/**********************************************************************************************************************************
 * Objetivo: Realizar a comunicação com o banco de dados utilizando Prisma ORM.                                                   *
 * Funcionalidades:                                                                                                               *
 * - Inserção de filmes no banco                                                                                                  *
 * - Consulta de todos os filmes                                                                                                  *
 * - Busca de filme por ID                                                                                                        *
 * - Filtro por nome ou sinopse                                                                                                   *
 * - Atualização de registros                                                                                                     *
 * - Exclusão de filmes                                                                                                           *
 * Tecnologias: Node.js, Prisma ORM, MySQL                                                                                        *
 * Banco de Dados: db_unifecaf_flix                                                                                               *
 * Autor: Aleff Blendon Costa                                                                                                     *
 * Data: 2026                                                                                                                     *
 * Versão: 1.0                                                                                                                    *
 *********************************************************************************************************************************/

const prisma = require('../prisma/prismaClient');

/**
 * Retorna todos os filmes cadastrados no banco.
 */
async function getAllFilmes() {
  return await prisma.tbl_filmes.findMany();
}

/**
 * Busca um filme pelo ID.
 * Retorna null se não encontrado (sem lançar erro).
 * @param {number|string} id
 */
async function getFilmeById(id) {
  return await prisma.tbl_filmes.findUnique({
    where: { id: Number(id) },
  });
}

/**
 * Filtra filmes pelo nome, sinopse ou gênero (busca parcial, case-insensitive).
 * Converte o termo para lowercase para garantir case-insensitive
 * independente do collation configurado no banco MySQL.
 * @param {string} termo
 */
async function getFilmesByNome(termo) {
  const termoLower = termo.toLowerCase();
  return await prisma.tbl_filmes.findMany({
    where: {
      OR: [
        { nome:    { contains: termoLower } },
        { sinopse: { contains: termoLower } },
        { genero:  { contains: termoLower } },
      ],
    },
  });
}

/**
 * Cria um novo filme no banco.
 * @param {object} data
 */
async function createFilme(data) {
  return await prisma.tbl_filmes.create({
    data: {
      nome:    data.nome,
      sinopse: data.sinopse || null,
      genero:  data.genero  || null,
      ano:     data.ano     ? Number(data.ano)     : null,
      duracao: data.duracao ? Number(data.duracao) : null,
      capa:    data.capa    || null,
    },
  });
}

/**
 * Atualiza um filme existente.
 * A verificação de existência é feita no controller antes de chamar esta função.
 * @param {number|string} id
 * @param {object} data
 */
async function updateFilme(id, data) {
  return await prisma.tbl_filmes.update({
    where: { id: Number(id) },
    data: {
      nome:    data.nome,
      sinopse: data.sinopse || null,
      genero:  data.genero  || null,
      ano:     data.ano     ? Number(data.ano)     : null,
      duracao: data.duracao ? Number(data.duracao) : null,
      capa:    data.capa    || null,
    },
  });
}

/**
 * Remove um filme pelo ID.
 * A verificação de existência é feita no controller antes de chamar esta função.
 * @param {number|string} id
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
