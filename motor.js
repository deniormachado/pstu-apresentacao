/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  MOTOR DE RENDERIZAÇÃO — PSTU Apresentação Modular   ║
 * ║                                                       ║
 * ║  Este arquivo lê os JSONs da pasta dados/ e           ║
 * ║  constrói os slides dinamicamente.                    ║
 * ║                                                       ║
 * ║  NÃO é necessário editar este arquivo para            ║
 * ║  alterar conteúdo — edite os .json em dados/          ║
 * ╚══════════════════════════════════════════════════════╝
 */

// ─────────────────────────────────────────────
// SEÇÃO 1: TEMPLATES DE RENDERIZAÇÃO
// Cada função recebe um objeto JSON e retorna HTML
// ─────────────────────────────────────────────

const TEMA_CSS = {
  'escuro':   'tema-escuro',
  'profundo': 'tema-profundo',
  'vermelho': 'tema-vermelho',
  'dark':     'tema-escuro',
  'deep':     'tema-profundo',
  'red-bg':   'tema-vermelho',
};

/** Gera a linha de acento lateral (barra vermelha→dourada) */
function acento(d) {
  return d.tem_linha_acento ? '<div class="accent-line"></div>' : '';
}

/** Template: CAPA */
function renderCapa(d) {
  const logos = (d.logos || []).map(u =>
    `<img src="${u}" alt="" onerror="this.style.display='none'">`
  ).join('');

  const palavraHtml = d.palavra_de_ordem
    ? `<div class="palavra" style="justify-content:center;"><span>${d.palavra_de_ordem}</span></div>` : '';

  const linksHtml = (d.links || []).map(l =>
    `<span style="font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.12em;color:var(--gold);">${l}</span>`
  ).join('');

  const titleStyle = d.titulo_estilo ? ` style="${d.titulo_estilo}"` : '';

  return `${acento(d)}
<div class="cover-wrap">
  <!-- pre_titulo: tag superior -->
  <div class="cover-tag">${d.pre_titulo}</div>
  <!-- titulo: nome grande -->
  <div class="cover-title"${titleStyle}>${d.titulo}</div>
  <!-- subtitulo: descrição -->
  <div class="cover-sub">${d.subtitulo}</div>
  ${logos ? `<div class="cover-logos">${logos}</div>` : ''}
  ${palavraHtml || linksHtml ? `<div style="display:flex;flex-direction:column;gap:10px;margin-top:16px;width:100%;max-width:420px;">${palavraHtml}${linksHtml ? `<div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-top:8px;">${linksHtml}</div>` : ''}</div>` : ''}
</div>`;
}

/** Template: SEÇÃO (abertura de módulo) */
function renderSecao(d) {
  return `
<div class="sec-giant">${d.numero_gigante || ''}</div>
<div class="section-wrap">
  <!-- pre_titulo: rótulo do módulo -->
  <div class="sec-mod-label">${d.pre_titulo}</div>
  <!-- titulo: nome da seção -->
  <div class="sec-title">${d.titulo}</div>
  <!-- subtitulo: descrição -->
  <div class="sec-desc">${d.subtitulo}</div>
</div>`;
}

/** Template: TEXTO */
function renderTexto(d) {
  const diffs = (d.diferenciais || []).map(t =>
    `<div class="diff-tag">${t}</div>`
  ).join('');
  const palavra = d.palavra_de_ordem
    ? `<div class="palavra"><span>${d.palavra_de_ordem}</span></div>` : '';

  return `${acento(d)}
<div class="text-wrap">
  <!-- titulo: título principal do slide -->
  <div class="slide-h">${d.titulo}</div>
  <div class="slide-rule"></div>
  <!-- texto: conteúdo principal -->
  <div class="slide-body">${d.texto}</div>
  ${diffs}
  ${palavra}
</div>`;
}

/** Template: DIVIDIDO (esquerda texto + direita itens) */
function renderDividido(d) {
  const diffs = (d.diferenciais || []).map(t =>
    `<div class="diff-tag">${t}</div>`
  ).join('');
  const palavra = d.palavra_de_ordem
    ? `<div class="palavra"><span>${d.palavra_de_ordem}</span></div>` : '';

  const items = (d.items_direita || []).map(item => {
    const style = item.estilo ? ` style="${item.estilo}"` : '';
    return `<div class="split-item"${style}>${item.texto}</div>`;
  }).join('');

  const rightStyle = d.estilo_direita ? ` style="${d.estilo_direita}"` : '';

  return `
<div class="split-wrap">
  <div class="split-left">
    <!-- titulo -->
    <div class="slide-h">${d.titulo}</div>
    <div class="slide-rule"></div>
    <!-- texto -->
    <div class="slide-body">${d.texto}</div>
    ${diffs}
    ${palavra}
  </div>
  <div class="split-right"${rightStyle}>
    <!-- items_direita: itens da coluna direita -->
    ${items}
  </div>
</div>`;
}

/** Template: COMPARATIVO (duas colunas) */
function renderComparativo(d) {
  function col(data) {
    if (!data) return '';
    const items = (data.items || []).map(item => {
      const style = item.estilo ? ` style="${item.estilo}"` : '';
      return `<div class="cmp-item"${style}>${item.texto}</div>`;
    }).join('');
    return `<div class="cmp-col"><div class="cmp-title">${data.titulo}</div>${items}</div>`;
  }
  return `<div class="compare-wrap">${col(d.coluna_esquerda)}${col(d.coluna_direita)}</div>`;
}

/** Template: ESTATÍSTICAS (grid 2×2) */
function renderEstatisticas(d) {
  const cells = (d.estatisticas || []).map(s => {
    const corStyle = s.cor ? ` style="color:${s.cor}"` : '';
    return `
    <div class="stat-cell">
      <!-- numero: valor em destaque -->
      <div class="stat-num"${corStyle}>${s.numero}</div>
      <!-- descricao: texto explicativo -->
      <div class="stat-desc">${s.descricao}</div>
      ${s.fonte ? `<div class="stat-src">${s.fonte}</div>` : ''}
    </div>`;
  }).join('');
  return `<div class="stats-wrap">${cells}</div>`;
}

/** Template: CITAÇÃO */
function renderCitacao(d) {
  return `
<div class="quote-wrap">
  <div class="quote-mark">"</div>
  <!-- titulo: texto da citação -->
  <div class="quote-text">${d.titulo}</div>
  <!-- pre_titulo: autor e fonte -->
  <div class="quote-cite">${d.pre_titulo}</div>
</div>`;
}

/** Template: TIMELINE */
function renderTimeline(d) {
  const rows = (d.itens_timeline || []).map(r =>
    `<div class="tl-row"><div class="tl-yr">${r.ano}</div><div class="tl-txt">${r.texto}</div></div>`
  ).join('');
  return `
<div class="timeline-wrap">
  <!-- titulo -->
  <div class="slide-h" style="margin-bottom:8px;">${d.titulo}</div>
  <div class="slide-rule"></div>
  <!-- itens_timeline: lista de eventos -->
  ${rows}
</div>`;
}

/** Template: VÍDEO */
function renderVideo(d) {
  return `
<div class="video-wrap">
  <div class="video-icon">▶</div>
  <!-- titulo: nome do vídeo -->
  <div class="video-title">${d.titulo}</div>
  <!-- texto: descrição -->
  <div class="video-desc">${d.texto}</div>
  <!-- subtitulo: link do vídeo -->
  <div class="video-link">${d.subtitulo}</div>
</div>`;
}

/** Template: DISCUSSÃO */
function renderDiscussao(d) {
  return `
<div class="discuss-wrap">
  <div class="discuss-label">Discussão</div>
  <!-- titulo: pergunta para debate -->
  <div class="discuss-q">${d.titulo}</div>
  <!-- subtitulo: dica para o apresentador -->
  <div class="discuss-hint">${d.subtitulo}</div>
</div>`;
}

/** Template: CARDS (pessoas) */
function renderCards(d) {
  const cards = (d.cards || []).map(c => {
    const initials = c.nome.split(' ').map(w => w[0]).join('').substring(0, 2);
    return `
    <div class="person-card">
      <div class="card-avatar">
        ${c.foto_url
          ? `<img src="${c.foto_url}" alt="${initials}" onerror="this.style.display='none';this.parentElement.textContent='${initials}';">`
          : initials}
      </div>
      <div class="card-info">
        <!-- nome -->
        <div class="card-name">${c.nome}</div>
        <!-- cargo -->
        <div class="card-role">${c.cargo}</div>
        <!-- texto: biografia -->
        <div class="card-text">${c.texto}</div>
      </div>
    </div>`;
  }).join('');
  return `<div class="cards-wrap">${cards}</div>`;
}

/** Seleciona o template correto baseado no campo "tipo" do JSON */
function renderSlide(d) {
  switch (d.tipo) {
    case 'capa':         return renderCapa(d);
    case 'secao':        return renderSecao(d);
    case 'texto':        return renderTexto(d);
    case 'dividido':     return renderDividido(d);
    case 'comparativo':  return renderComparativo(d);
    case 'estatisticas': return renderEstatisticas(d);
    case 'citacao':      return renderCitacao(d);
    case 'timeline':     return renderTimeline(d);
    case 'video':        return renderVideo(d);
    case 'discussao':    return renderDiscussao(d);
    case 'cards':        return renderCards(d);
    default:             return `<div class="text-wrap"><div class="slide-h">Tipo desconhecido: ${d.tipo}</div></div>`;
  }
}

// ─────────────────────────────────────────────
// SEÇÃO 2: CARREGAMENTO DOS DADOS (Fetch API)
// ─────────────────────────────────────────────

const BASE_PATH = 'dados/';

/** Carrega o índice e depois cada slide individual */
async function carregarDados() {
  try {
    // 1. Carregar o manifesto (lista de arquivos)
    const resp = await fetch(BASE_PATH + 'indice.json');
    if (!resp.ok) throw new Error('Falha ao carregar indice.json');
    const indice = await resp.json();

    // 2. Carregar cada slide em paralelo
    const promises = indice.map(arquivo =>
      fetch(BASE_PATH + arquivo).then(r => {
        if (!r.ok) throw new Error(`Falha ao carregar ${arquivo}`);
        return r.json();
      })
    );
    const slidesData = await Promise.all(promises);

    console.log(`✓ ${slidesData.length} slides carregados com sucesso`);
    return slidesData;

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    console.log('Verifique se a pasta dados/ está acessível.');
    console.log('Se estiver abrindo via file://, use um servidor local.');
    console.log('Exemplo: python3 -m http.server 8000');

    // Mostrar mensagem de erro na tela
    document.getElementById('loading').innerHTML = `
      <div style="text-align:center;padding:40px;max-width:500px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:3rem;color:#D62828;">Erro</div>
        <div style="font-family:'Syne',sans-serif;font-size:.9rem;color:rgba(255,255,255,.6);line-height:1.6;margin-top:16px;">
          Não foi possível carregar os dados dos slides.<br><br>
          <strong style="color:#fff;">Se abriu direto do computador:</strong><br>
          Abra um terminal na pasta do site e execute:<br>
          <code style="background:#222;padding:4px 10px;border-radius:4px;color:#E09F3E;">python3 -m http.server 8000</code><br>
          Depois acesse <code style="color:#E09F3E;">http://localhost:8000</code>
        </div>
      </div>`;
    return null;
  }
}

// ─────────────────────────────────────────────
// SEÇÃO 3: CONSTRUÇÃO DO DOM E NAVEGAÇÃO
// ─────────────────────────────────────────────

async function inicializar() {
  const slidesData = await carregarDados();
  if (!slidesData) return;

  const deck   = document.getElementById('deck');
  const tabBar = document.getElementById('tabs');
  const badge  = document.getElementById('module-badge');
  const badgeTxt = document.getElementById('badge-text');
  const drawer = document.getElementById('module-drawer');
  const menuBtn = document.getElementById('menu-btn');

  // ── Criar elementos de slide ──
  slidesData.forEach((d, i) => {
    const el = document.createElement('div');
    el.className = `slide ${TEMA_CSS[d.tema] || 'tema-escuro'}`;
    el.innerHTML = renderSlide(d);
    deck.appendChild(el);

    const tab = document.createElement('div');
    tab.className = 'tab';
    tabBar.appendChild(tab);
  });

  // ── Criar menu de módulos ──
  slidesData.forEach((d, i) => {
    if (d.eh_secao) {
      const a = document.createElement('a');
      a.innerHTML = `<span class="drawer-num">${i + 1}</span> ${d.rotulo_secao || d.modulo}`;
      a.addEventListener('click', () => { go(i); drawer.classList.remove('open'); });
      drawer.appendChild(a);
    }
  });

  menuBtn.addEventListener('click', e => { e.stopPropagation(); drawer.classList.toggle('open'); });
  document.addEventListener('click', () => drawer.classList.remove('open'));
  drawer.addEventListener('click', e => e.stopPropagation());

  // ── Estado da navegação ──
  let cur = 0;
  const allSlides = deck.querySelectorAll('.slide');
  const allTabs   = tabBar.querySelectorAll('.tab');
  const total     = slidesData.length;

  function go(n) {
    if (n < 0 || n >= total) return;
    const prev = cur;
    allSlides[prev].classList.remove('active');
    allSlides[prev].classList.add('prev');
    setTimeout(() => allSlides[prev].classList.remove('prev'), 550);

    cur = n;
    allSlides[cur].classList.add('active');
    allSlides[cur].scrollTop = 0;

    document.getElementById('progress').style.width = ((cur / (total - 1)) * 100) + '%';
    document.getElementById('counter').textContent = (cur + 1) + ' / ' + total;

    allTabs.forEach((t, i) => {
      t.classList.remove('done', 'cur');
      if (i < cur) t.classList.add('done');
      if (i === cur) t.classList.add('cur');
    });

    // Atualizar badge do módulo
    const mod = slidesData[cur].modulo;
    if (mod) {
      badgeTxt.textContent = mod;
      badge.classList.remove('hidden');
      badge.classList.toggle('accent', !!slidesData[cur].eh_secao);
    } else {
      badge.classList.add('hidden');
    }
  }

  go(0);

  // ── Teclado ──
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(cur - 1); }
    if (e.key === 'Escape') drawer.classList.remove('open');
  });

  // ── Clique ──
  deck.addEventListener('click', e => {
    if (e.target.closest('a,button,.split-right,.cmp-col:last-child,.person-card')) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.5) go(cur + 1); else go(cur - 1);
  });

  // ── Setas ──
  document.getElementById('nav-next').addEventListener('click', e => { e.stopPropagation(); go(cur + 1); });
  document.getElementById('nav-prev').addEventListener('click', e => { e.stopPropagation(); go(cur - 1); });

  // ── Touch / Swipe ──
  let tx = 0, ty = 0;
  deck.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) go(cur + 1); else go(cur - 1);
    }
  }, { passive: true });

  // ── Clique nas abas ──
  allTabs.forEach((t, i) => t.addEventListener('click', () => go(i)));

  // ── Esconder tela de carregamento ──
  document.getElementById('loading').classList.add('done');
}

// ── Iniciar quando a página carregar ──
document.addEventListener('DOMContentLoaded', inicializar);
