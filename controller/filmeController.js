const filmeModel = require('../model/filmeModel');

// ─────────────────────────────────────────────────────────────────────────────
// GET /v1/controle-filmes/filme
// Lista todos os filmes cadastrados
// ─────────────────────────────────────────────────────────────────────────────
async function listarFilmes(req, res) {
  try {
    const filmes = await filmeModel.getAllFilmes();
    return res.status(200).json(filmes);
  } catch (error) {
    console.error('Erro ao listar filmes:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar filmes.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /v1/controle-filmes/filme/:id
// Busca um filme pelo ID
// ─────────────────────────────────────────────────────────────────────────────
async function buscarFilme(req, res) {
  try {
    const { id } = req.params;

    // Valida se o ID é um número válido
    if (isNaN(Number(id))) {
      return res.status(400).json({ erro: 'ID inválido. Informe um número inteiro.' });
    }

    const filme = await filmeModel.getFilmeById(id);

    if (!filme) {
      return res.status(404).json({ erro: `Filme com ID ${id} não encontrado.` });
    }

    return res.status(200).json(filme);
  } catch (error) {
    console.error('Erro ao buscar filme:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar filme.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /v1/controle-filmes/filtro/filme?nome=xxx
// Filtra filmes pelo nome (parcial) ou pela sinopse
// ─────────────────────────────────────────────────────────────────────────────
async function filtrarFilmes(req, res) {
  try {
    const { nome } = req.query;

    // O parâmetro "nome" é obrigatório para o filtro
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

    return res.status(200).json(filmes);
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
    return res.status(201).json(novoFilme);
  } catch (error) {
    console.error('Erro ao criar filme:', error);
    return res.status(500).json({ erro: 'Erro interno ao criar filme.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /v1/controle-filmes/filme/:id
// Atualiza os dados de um filme existente
// ─────────────────────────────────────────────────────────────────────────────
async function atualizarFilme(req, res) {
  try {
    const { id } = req.params;
    const { nome, sinopse, genero, ano, duracao, capa } = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ erro: 'ID inválido. Informe um número inteiro.' });
    }

    // Verifica se o filme existe antes de atualizar
    const filmeExistente = await filmeModel.getFilmeById(id);
    if (!filmeExistente) {
      return res.status(404).json({ erro: `Filme com ID ${id} não encontrado.` });
    }

    if (!nome) {
      return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
    }

    const filmeAtualizado = await filmeModel.updateFilme(id, { nome, sinopse, genero, ano, duracao, capa });
    return res.status(200).json(filmeAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    return res.status(500).json({ erro: 'Erro interno ao atualizar filme.' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /v1/controle-filmes/filme/:id
// Remove um filme pelo ID
// ─────────────────────────────────────────────────────────────────────────────
async function deletarFilme(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ erro: 'ID inválido. Informe um número inteiro.' });
    }

    // Verifica se o filme existe antes de deletar
    const filmeExistente = await filmeModel.getFilmeById(id);
    if (!filmeExistente) {
      return res.status(404).json({ erro: `Filme com ID ${id} não encontrado.` });
    }

    await filmeModel.deleteFilme(id);
    return res.status(200).json({ mensagem: `Filme com ID ${id} deletado com sucesso.` });
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
