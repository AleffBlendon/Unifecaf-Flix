require('dotenv').config(); // Carrega o .env antes de qualquer outro módulo

const express = require('express');
const cors    = require('cors');

const filmeController = require('./controller/filmeController');

const app  = express();
const PORT = 3000;

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());                        // substitui bodyParser.json()
app.use(express.urlencoded({ extended: true })); // substitui bodyParser.urlencoded()

// ─── Prefixo base da API ───────────────────────────────────────────────────────
const BASE = '/v1/controle-filmes';

// ─── Rotas de Filmes ───────────────────────────────────────────────────────────

// Filtro por nome/sinopse — deve vir ANTES de /:id para não colidir
app.get(`${BASE}/filtro/filme`,  filmeController.filtrarFilmes);

// CRUD completo
app.get(`${BASE}/filme`,         filmeController.listarFilmes);
app.get(`${BASE}/filme/:id`,     filmeController.buscarFilme);
app.post(`${BASE}/filme`,        filmeController.criarFilme);
app.put(`${BASE}/filme/:id`,     filmeController.atualizarFilme);
app.delete(`${BASE}/filme/:id`,  filmeController.deletarFilme);

// ─── Rota raiz ─────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    mensagem: 'API UniFECAF Flix está rodando!',
    versao:   'v1',
    rotas: {
      listar:  'GET    /v1/controle-filmes/filme',
      buscar:  'GET    /v1/controle-filmes/filme/:id',
      filtrar: 'GET    /v1/controle-filmes/filtro/filme?nome=xxx',
      criar:   'POST   /v1/controle-filmes/filme',
      editar:  'PUT    /v1/controle-filmes/filme/:id',
      deletar: 'DELETE /v1/controle-filmes/filme/:id',
    },
  });
});

// ─── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Rotas disponíveis em http://localhost:${PORT}/v1/controle-filmes/filme`);
});
