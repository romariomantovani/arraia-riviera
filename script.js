/* ==========================================================================
   Arraiá Riviera
   Tudo que muda de verdade está no CONFIG abaixo. Edite só aqui.
   ========================================================================== */

const CONFIG = {
  /* Data e hora do evento, no fuso de Brasília. */
  dataHora: '2026-08-08T18:00:00-03:00',

  /* Por quantas horas a festa segue depois do início (usado pela contagem). */
  duracaoHoras: 7,

  local: 'Praça do Bosque',

  /* EDITAR: se souber a rua, acrescente aqui. Ex.: 'Rua Lila Fachetti, s/n — Riviera'.
     Só muda o texto na tela: quem aponta o mapa são as coordenadas abaixo. */
  endereco: 'Riviera',

  cidade: 'Colatina/ES',

  /* O ponto exato da praça. Sai do link do Google Maps — abra a praça no Maps,
     copie os números depois do @ na URL e cole aqui como 'latitude,longitude'.
     Enquanto estiver vazio, o mapa busca por texto (menos preciso). */
  coordenadas: '-19.504598,-40.617779',

  organizador: 'Amigos do Riviera'
};

/* ------------------------------------------------------------------ */

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

/* ---------- endereço, mapa e organizador ---------- */

/* O que vai na URL do Maps: as coordenadas quando existem (aponta no lugar
   exato), senão o endereço escrito (pode cair na praça errada). */
function alvoDoMapa() {
  if (CONFIG.coordenadas) return CONFIG.coordenadas.replace(/\s/g, '');
  return [CONFIG.local, CONFIG.endereco, CONFIG.cidade].filter(Boolean).join(', ');
}

function montaLocal() {
  const busca = alvoDoMapa();

  $$('[data-maps]').forEach(a => {
    a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(busca);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  const linhaEndereco = [CONFIG.endereco, CONFIG.cidade].filter(Boolean).join(' — ');
  if (linhaEndereco) {
    $$('[data-endereco]').forEach(el => { el.textContent = linhaEndereco; });
  }

  const elCidade = $('[data-cidade]');
  if (elCidade) {
    if (CONFIG.cidade) elCidade.textContent = CONFIG.cidade;
    else elCidade.remove();
  }

  const elOrg = $('[data-organizador]');
  if (elOrg && CONFIG.organizador) elOrg.textContent = CONFIG.organizador;
}

/* ---------- contagem regressiva ---------- */

function contagem() {
  const caixa = $('[data-contagem]');
  if (!caixa) return;

  const rot = $('[data-contagem-rot]', caixa);
  const alvo = new Date(CONFIG.dataHora);
  const fim = new Date(alvo.getTime() + CONFIG.duracaoHoras * 3600 * 1000);

  const campos = {
    d: $('[data-d]', caixa),
    h: $('[data-h]', caixa),
    m: $('[data-m]', caixa),
    s: $('[data-s]', caixa)
  };

  function atualiza() {
    const agora = new Date();

    if (agora >= fim) {
      caixa.classList.add('contagem--fim');
      rot.textContent = 'O Arraiá Riviera de 2026 já passou. Obrigado a quem veio dançar.';
      return true;
    }
    if (agora >= alvo) {
      caixa.classList.add('contagem--fim');
      rot.textContent = 'É hoje! A fogueira já está acesa — vem.';
      return false;
    }

    let resto = Math.floor((alvo - agora) / 1000);
    const d = Math.floor(resto / 86400); resto %= 86400;
    const h = Math.floor(resto / 3600);  resto %= 3600;
    const m = Math.floor(resto / 60);
    const s = resto % 60;

    rot.textContent = d === 0 ? 'Falta pouco' : (d === 1 ? 'Falta' : 'Faltam');
    campos.d.textContent = d;
    campos.h.textContent = String(h).padStart(2, '0');
    campos.m.textContent = String(m).padStart(2, '0');
    campos.s.textContent = String(s).padStart(2, '0');
    return false;
  }

  if (!atualiza()) {
    const timer = setInterval(() => { if (atualiza()) clearInterval(timer); }, 1000);
  }
}

/* ---------- varal de bandeirinhas ---------- */

function desenhaVaral(el) {
  const w = el.clientWidth || window.innerWidth;
  const h = el.clientHeight || 118;
  const compacto = w < 560;

  const larg = compacto ? 24 : 38;          // base da bandeirinha
  const alt = larg * 1.3;                   // altura da bandeirinha
  const passo = larg * 1.34;
  const n = Math.max(4, Math.round(w / passo));
  const topo = compacto ? 5 : 7;            // onde a corda encosta na borda
  const barriga = Math.min(compacto ? 18 : 30, h - alt - topo - 4);

  const cores = (el.dataset.cores || 'vermelho,amarelo,verde,azul').split(',');

  let svg = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">`;
  svg += `<path class="corda" d="M0 ${topo} Q ${w / 2} ${topo + 2 * barriga} ${w} ${topo}"/>`;

  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = w * t;
    const y = topo + 4 * barriga * t * (1 - t);
    const ang = Math.atan2(4 * barriga * (1 - 2 * t), w) * 180 / Math.PI;
    const cor = cores[i % cores.length].trim();
    const atraso = (i % 7) * -0.29;
    /* O <g> segura a posição na corda; a animação de balanço fica no polígono,
       senão o transform do CSS apagaria o posicionamento. */
    svg += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(2)})">`
        +  `<polygon class="bandeira" points="${-larg / 2},0 ${larg / 2},0 0,${alt}"`
        +  ` style="fill:var(--${cor});animation-delay:${atraso}s"/></g>`;
  }

  svg += '</svg>';
  el.innerHTML = svg;
}

function montaVarais() {
  const varais = $$('[data-varal]');
  varais.forEach(desenhaVaral);

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => varais.forEach(desenhaVaral), 180);
  });

  if (semMovimento) return;

  /* O varal reage à velocidade do scroll: quanto mais rápido, mais ele balança. */
  let ultimoY = window.scrollY;
  let vel = 0;
  let rodando = false;

  function passo() {
    vel *= 0.9;
    const grau = Math.max(-9, Math.min(9, vel * 0.22));
    varais.forEach(v => v.style.setProperty('--sway', grau.toFixed(2) + 'deg'));
    if (Math.abs(vel) > 0.15) {
      requestAnimationFrame(passo);
    } else {
      varais.forEach(v => v.style.setProperty('--sway', '0deg'));
      rodando = false;
    }
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    vel += (y - ultimoY);
    ultimoY = y;
    if (!rodando) { rodando = true; requestAnimationFrame(passo); }
  }, { passive: true });
}

/* ---------- revelação no scroll ---------- */

function revelacoes() {
  const alvos = $$('[data-reveal]');
  if (semMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach(el => el.classList.add('visivel'));
    return;
  }

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

  alvos.forEach((el, i) => {
    el.style.transitionDelay = (Math.min(i, 5) * 60) + 'ms';
    obs.observe(el);
  });
}

/* ---------- vídeo do arraiá passado ---------- */

/* O vídeo nunca começa sozinho. O botão grande só existe pra ficar bonito e
   convidativo — os controles nativos do <video> continuam ali por baixo, então
   se este script não rodar o visitante ainda consegue dar play. */
function filme() {
  const caixa = $('[data-filme]');
  if (!caixa) return;

  const video = $('video', caixa);
  const botao = $('[data-filme-play]', caixa);
  if (!video || !botao) return;

  /* O HTML já traz o atributo controls — quem estiver sem JS continua podendo
     dar play. Com o JS de pé, a barra do navegador sai de baixo do poster e
     volta no primeiro play, deixando o cartaz limpo. */
  video.removeAttribute('controls');

  botao.addEventListener('click', () => {
    video.setAttribute('controls', '');
    video.play();
    video.focus();
  });

  video.addEventListener('play', () => caixa.classList.add('filme--tocando'));
  video.addEventListener('ended', () => caixa.classList.remove('filme--tocando'));
}

/* ---------- mapa (só carrega depois do clique) ---------- */

/* Enquanto ninguém pedir o mapa, o iframe do Google Maps não é carregado: a
   página fica mais leve e o visitante decide se quer o embed de terceiro. */
function mapa() {
  const caixa = $('[data-mapa]');
  if (!caixa) return;

  const botao = $('[data-mapa-btn]', caixa);
  if (!botao) return;

  botao.addEventListener('click', () => {
    const alvo = alvoDoMapa();
    const zoom = CONFIG.coordenadas ? 17 : 15;

    const frame = document.createElement('iframe');
    frame.className = 'mapa__frame';
    frame.title = 'Mapa da ' + CONFIG.local;
    frame.loading = 'lazy';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(alvo)
              + '&z=' + zoom + '&hl=pt-BR&output=embed';

    caixa.classList.add('mapa--aberto');
    $('[data-mapa-quadro]', caixa).replaceChildren(frame);
  });
}

/* ---------- start ---------- */

montaLocal();
contagem();
montaVarais();
revelacoes();
filme();
mapa();
