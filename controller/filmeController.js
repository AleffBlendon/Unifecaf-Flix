/**********************************************************************************************************************************
 * Objetivo: Gerenciar as requisições HTTP da API de filmes.                                                                      *
 * Funcionalidades:                                                                                                               *
 * - Listar todos os filmes                                                                                                       *
 * - Buscar filme por ID                                                                                                          *
 * - Filtrar filmes por nome ou sinopse                                                                                           *
 * - Criar novos filmes                                                                                                           *
 * - Atualizar dados de filmes                                                                                                    *
 * - Remover filmes                                                                                                               *
 * Tecnologias: Node.js, Express                                                                                                  *
 * Integração: FilmeModel (acesso ao banco de dados)                                                                              *
 * Autor: Aleff Blendon Costa                                                                                                     *
 * Data: 2026                                                                                                                     *
 * Versão: 1.0                                                                                                                    *
 *********************************************************************************************************************************/

const filmeModel = require('../model/filmeModel');

// ─────────────────────────────────────────────────────────────────────────────
// GET /v1/controle-filmes/filme
// Lista todos os filmes — resposta padronizada com quantidade + dados
// ─────────────────────────────────────────────────────────────────────────────
async function listarFilmes(req, res) {
  try {
    const filmes = await filmeModel.getAllFilmes();

    return res.status(200).json({
      quantidade: filmes.length,
      dados: filmes,
    });
  } catch (error) {
    console.error('Erro ao listar filmes:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar filmes.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /v1/controle-filmes/filme/:id
// Busca um filme pelo ID — resposta padronizada com dados
// ─────────────────────────────────────────────────────────────────────────────
async function buscarFilme(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ erro: 'ID inválido. Informe um número inteiro.' });
    }

    const filme = await filmeModel.getFilmeById(id);

    if (!filme) {
      return res.status(404).json({ erro: `Filme com ID ${id} não encontrado.` });
    }

    return res.status(200).json({
      quantidade: 1,
      dados: filme,
    });
  } catch (error) {
    console.error('Erro ao buscar filme:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar filme.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /v1/controle-filmes/filtro/filme?nome=xxx
// Filtra filmes pelo nome ou sinopse (case-insensitive)
// ─────────────────────────────────────────────────────────────────────────────
async function filtrarFilmes(req, res) {
  try {
    const { nome } = req.query;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        erro: 'Informe o parâmetro de busca. Ex: ?nome=matrix',
      });
    }

    const filmes = await filmeModel.getFilmesByNome(nome.trim());

    if (filmes.length === 0) {
      return res.status(404).json({
        erro: `Nenhum filme encontrado para o termo "${nome}".`,
      });
    }

    return res.status(200).json({
      quantidade: filmes.length,
      dados: filmes,
    });
  } catch (error) {
    console.error('Erro ao filtrar filmes:', error);
    return res.status(500).json({ erro: 'Erro interno ao filtrar filmes.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /v1/controle-filmes/filme
// Cria um novo filme
// ─────────────────────────────────────────────────────────────────────────────
async function criarFilme(req, res) {
  try {
    const { nome, sinopse, genero, ano, duracao, capa } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
    }

    const novoFilme = await filmeModel.createFilme({ nome, sinopse, genero, ano, duracao, capa });

    return res.status(201).json({
      mensagem: 'Filme criado com sucesso.',
      dados: novoFilme,
    });
  } catch (error) {
    console.error('Erro ao criar filme:', error);
    return res.status(500).json({ erro: 'Erro interno ao criar filme.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /v1/controle-filmes/filme/:id
// Atualiza um filme — verifica existência antes de chamar o model
// ─────────────────────────────────────────────────────────────────────────────
async function atualizarFilme(req, res) {
  try {
    const { id } = req.params;
    const { nome, sinopse, genero, ano, duracao, capa } = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ erro: 'ID inválido. Informe um número inteiro.' });
    }

    if (!nome) {
      return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
    }

    // Verifica existência antes de tentar atualizar — evita erro 500 do Prisma
    const filmeExistente = await filmeModel.getFilmeById(id);
    if (!filmeExistente) {
      return res.status(404).json({ erro: `Filme com ID ${id} não encontrado.` });
    }

    const filmeAtualizado = await filmeModel.updateFilme(id, { nome, sinopse, genero, ano, duracao, capa });

    return res.status(200).json({
      mensagem: 'Filme atualizado com sucesso.',
      dados: filmeAtualizado,
    });
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    return res.status(500).json({ erro: 'Erro interno ao atualizar filme.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /v1/controle-filmes/filme/:id
// Remove um filme — verifica existência antes de chamar o model
// ─────────────────────────────────────────────────────────────────────────────
async function deletarFilme(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ erro: 'ID inválido. Informe um número inteiro.' });
    }

    // Verifica existência antes de tentar deletar — evita erro 500 do Prisma
    const filmeExistente = await filmeModel.getFilmeById(id);
    if (!filmeExistente) {
      return res.status(404).json({ erro: `Filme com ID ${id} não encontrado.` });
    }

    await filmeModel.deleteFilme(id);

    return res.status(200).json({
      mensagem: `Filme com ID ${id} deletado com sucesso.`,
    });
  } catch (error) {
    console.error('Erro ao deletar filme:', error);
    return res.status(500).json({ erro: 'Erro interno ao deletar filme.' });
  }
}

module.exports = {
  listarFilmes,
  buscarFilme,
  filtrarFilmes,
  criarFilme,
  atualizarFilme,
  deletarFilme,
};
