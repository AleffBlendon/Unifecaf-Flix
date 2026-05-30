/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURAÇÃO
═══════════════════════════════════════════════════════════════════════════ */
const API_BASE = 'http://localhost:3000/v1/controle-filmes';

/* ═══════════════════════════════════════════════════════════════════════════
   REFERÊNCIAS DO DOM
═══════════════════════════════════════════════════════════════════════════ */
const filmesGrid    = document.getElementById('filmesGrid');
const searchInput   = document.getElementById('searchInput');
const searchBtn     = document.getElementById('searchBtn');
const sectionTitle  = document.getElementById('sectionTitle');
const sectionCount  = document.getElementById('sectionCount');

// Estados
const stateLoading  = document.getElementById('stateLoading');
const stateEmpty    = document.getElementById('stateEmpty');
const stateError    = document.getElementById('stateError');
const emptyMsg      = document.getElementById('emptyMsg');

// Modal
const modalOverlay  = document.getElementById('modalOverlay');
const modalClose    = document.getElementById('modalClose');
const modalCapa     = document.getElementById('modalCapa');
const modalNome     = document.getElementById('modalNome');
const modalBadges   = document.getElementById('modalBadges');
const modalSinopse  = document.getElementById('modalSinopse');
const modalMeta     = document.getElementById('modalMeta');

/* ═══════════════════════════════════════════════════════════════════════════
   CONTROLE DE ESTADOS VISUAIS
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Exibe apenas o estado desejado (loading | empty | error | grid).
 * @param {'loading'|'empty'|'error'|'grid'} estado
 */
function mostrarEstado(estado) {
  stateLoading.classList.remove('active');
  stateEmpty.classList.remove('active');
  stateError.classList.remove('active');
  filmesGrid.style.display = 'none';

  if (estado === 'loading') {
    stateLoading.classList.add('active');
  } else if (estado === 'empty') {
    stateEmpty.classList.add('active');
  } else if (estado === 'error') {
    stateError.classList.add('active');
  } else if (estado === 'grid') {
    filmesGrid.style.display = 'grid';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   RENDERIZAÇÃO DOS CARDS
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Gera o HTML de um card de filme.
 * @param {object} filme
 * @returns {string} HTML do card
 */
function criarCardHTML(filme) {
  // Capa: usa a URL do banco ou exibe placeholder
  const capaHTML = filme.capa
    ? `<img class="card__capa" src="${escaparHTML(filme.capa)}"
            alt="Capa de ${escaparHTML(filme.nome)}"
            onerror="this.parentElement.innerHTML = capaPlaceholderHTML('${escaparHTML(filme.nome)}')" />`
    : capaPlaceholderHTML(filme.nome);

  const generoLabel = filme.genero ? `<p class="card__genero">${escaparHTML(filme.genero)}</p>` : '';

  return `
    <article class="card" data-id="${filme.id}" tabindex="0" role="button"
             aria-label="Ver detalhes de ${escaparHTML(filme.nome)}">
      <div class="card__capa-wrap">
        ${capaHTML}
        <div class="card__overlay">
          <span class="card__overlay-icon">▶</span>
        </div>
      </div>
      <div class="card__footer">
        <p class="card__nome" title="${escaparHTML(filme.nome)}">${escaparHTML(filme.nome)}</p>
        ${generoLabel}
      </div>
    </article>
  `;
}

/**
 * HTML do placeholder quando não há capa.
 * @param {string} nome
 * @returns {string}
 */
function capaPlaceholderHTML(nome) {
  const inicial = nome ? nome.charAt(0).toUpperCase() : '?';
  return `
    <div class="card__capa-placeholder">
      <span>🎬</span>
      <span>${escaparHTML(inicial)}</span>
    </div>
  `;
}

/**
 * Renderiza a lista de filmes no grid.
 * @param {Array} filmes
 */
function renderizarFilmes(filmes) {
  filmesGrid.innerHTML = filmes.map(criarCardHTML).join('');

  // Adiciona evento de clique em cada card
  filmesGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => abrirModal(Number(card.dataset.id)));
    // Acessibilidade: Enter/Space abre o modal
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirModal(Number(card.dataset.id));
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHAMADAS À API
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Carrega todos os filmes da API e renderiza no grid.
 */
async function carregarFilmes() {
  mostrarEstado('loading');
  sectionTitle.textContent = 'Todos os Filmes';
  sectionCount.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/filme`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const filmes = await res.json();

    if (!filmes.length) {
      emptyMsg.textContent = 'Nenhum filme cadastrado ainda.';
      mostrarEstado('empty');
      return;
    }

    sectionCount.textContent = `${filmes.length} filmes`;
    renderizarFilmes(filmes);
    mostrarEstado('grid');

  } catch (err) {
    console.error('Erro ao carregar filmes:', err);
    mostrarEstado('error');
  }
}

/**
 * Filtra filmes pelo termo de busca via API.
 * @param {string} termo
 */
async function buscarFilmes(termo) {
  if (!termo.trim()) {
    carregarFilmes();
    return;
  }

  mostrarEstado('loading');
  sectionTitle.textContent = `Resultados para "${termo}"`;
  sectionCount.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/filtro/filme?nome=${encodeURIComponent(termo.trim())}`);

    // 404 da API significa "nenhum resultado encontrado"
    if (res.status === 404) {
      emptyMsg.textContent = `Nenhum filme encontrado para "${termo}".`;
      mostrarEstado('empty');
      return;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const filmes = await res.json();

    sectionCount.textContent = `${filmes.length} resultado${filmes.length !== 1 ? 's' : ''}`;
    renderizarFilmes(filmes);
    mostrarEstado('grid');

  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    mostrarEstado('error');
  }
}

/**
 * Busca os detalhes de um filme pelo ID e abre o modal.
 * @param {number} id
 */
async function abrirModal(id) {
  try {
    const res = await fetch(`${API_BASE}/filme/${id}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const filme = await res.json();
    preencherModal(filme);
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

  } catch (err) {
    console.error('Erro ao buscar detalhes do filme:', err);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Preenche o modal com os dados do filme.
 * @param {object} filme
 */
function preencherModal(filme) {
  // Capa
  if (filme.capa) {
    modalCapa.src = filme.capa;
    modalCapa.alt = `Capa de ${filme.nome}`;
    modalCapa.onerror = () => {
      modalCapa.parentElement.innerHTML = capaPlaceholderHTML(filme.nome);
    };
  } else {
    modalCapa.parentElement.innerHTML = capaPlaceholderHTML(filme.nome);
  }

  // Nome
  modalNome.textContent = filme.nome;

  // Badges
  const badges = [];
  if (filme.genero)  badges.push(`<span class="badge badge--genero">🎭 ${escaparHTML(filme.genero)}</span>`);
  if (filme.ano)     badges.push(`<span class="badge badge--ano">📅 ${filme.ano}</span>`);
  if (filme.duracao) badges.push(`<span class="badge badge--duracao">⏱ ${filme.duracao} min</span>`);
  modalBadges.innerHTML = badges.join('');

  // Sinopse
  modalSinopse.textContent = filme.sinopse || 'Sinopse não disponível.';

  // Meta
  const metas = [];
  if (filme.genero)  metas.push(`<p class="meta-item"><strong>Gênero:</strong> ${escaparHTML(filme.genero)}</p>`);
  if (filme.ano)     metas.push(`<p class="meta-item"><strong>Ano:</strong> ${filme.ano}</p>`);
  if (filme.duracao) metas.push(`<p class="meta-item"><strong>Duração:</strong> ${filme.duracao} minutos</p>`);
  modalMeta.innerHTML = metas.join('');
}

/**
 * Fecha o modal.
 */
function fecharModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITÁRIOS
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Escapa caracteres HTML para evitar XSS.
 * @param {string} str
 * @returns {string}
 */
function escaparHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Reseta a home: limpa busca e recarrega todos os filmes.
 */
function resetHome() {
  searchInput.value = '';
  carregarFilmes();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════════════════════════════════
   EVENTOS
═══════════════════════════════════════════════════════════════════════════ */

// Botão de busca
searchBtn.addEventListener('click', () => buscarFilmes(searchInput.value));

// Busca ao pressionar Enter
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') buscarFilmes(searchInput.value);
});

// Busca dinâmica com debounce (300ms) enquanto digita
let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const termo = searchInput.value.trim();
    // Só dispara busca se tiver 2+ caracteres ou estiver vazio (reset)
    if (termo.length >= 2 || termo.length === 0) {
      buscarFilmes(termo);
    }
  }, 300);
});

// Fechar modal
modalClose.addEventListener('click', fecharModal);

// Fechar modal clicando fora
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) fecharModal();
});

// Fechar modal com Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    fecharModal();
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
═══════════════════════════════════════════════════════════════════════════ */
carregarFilmes();
