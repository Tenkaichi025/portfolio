// Logique du site (les données à modifier sont dans js/config.js)

const waLink = (text) => `https://wa.me/${WA_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : '');
const fmt = (n) => n.toLocaleString('fr-FR') + ' ' + PRODUCT.currency;

document.getElementById('year').textContent = new Date().getFullYear();

// Menu mobile : se ferme au choix d'un lien, avec Échap, au clic à l'extérieur ou en passant en affichage large
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const setMenu = (open) => {
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  menuBtn.querySelector('.menu-open').classList.toggle('hidden', open);
  menuBtn.querySelector('.menu-close').classList.toggle('hidden', !open);
};
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
addEventListener('click', (e) => { if (!menu.hidden && !e.target.closest('nav')) setMenu(false); });
matchMedia('(min-width: 768px)').addEventListener('change', (e) => e.matches && setMenu(false));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const isWebUrl = (u) => /^https?:\/\//i.test(u || '');

// Carrousel 3D des réalisations (la sous-section reste masquée si la liste est vide)
const projects = PROJECTS.filter((p) => isWebUrl(p.url));
const pad = (n) => String(n).padStart(2, '0');
if (projects.length) {
  document.getElementById('realisations').hidden = false;
  document.getElementById('cv-summary').textContent = `${projects.length} projet${projects.length > 1 ? 's' : ''} en ligne`;
  const stage = document.getElementById('cv-stage');
  stage.innerHTML = projects.map((p, i) => `
    <article class="cv-card" aria-label="${esc(p.title)}">
      <div class="cv-face" ${p.image ? `style="background-image:url('${esc(encodeURI(p.image))}')"` : ''}>
        ${p.image ? '' : `<span class="absolute inset-0 grid place-items-center font-display text-6xl font-bold text-white/10 sm:text-8xl" style="padding-bottom:45%" aria-hidden="true">${esc(p.title.charAt(0))}</span>`}
        <div class="relative flex items-baseline justify-between font-mono text-[11px] tracking-widest text-zinc-400">
          <span>${pad(i + 1)}</span><span>${esc(p.year)}</span>
        </div>
        <div class="cv-glow"></div>
        <div class="relative flex flex-col gap-2">
          <h4 class="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">${esc(p.title)}</h4>
          <span class="text-sm text-lime">${esc(p.category)}</span>
          <div class="cv-body">
            <p class="max-w-[34ch] text-sm leading-relaxed text-zinc-300">${esc(p.description)}</p>
            <a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:bg-lime">
              ouvrir <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg><span class="sr-only">${esc(p.title)} (nouvel onglet)</span>
            </a>
          </div>
        </div>
      </div>
    </article>`).join('');

  const cards = [...stage.children];
  const count = document.getElementById('cv-count');
  const bar = document.getElementById('cv-bar');
  let active = 0;
  const layout = () => {
    const step = Math.min(171, innerWidth * 0.2); // écart horizontal entre cartes
    cards.forEach((c, i) => {
      const d = i - active, a = Math.abs(d), s = Math.sign(d), k = Math.min(a, 3);
      c.style.transform = `translate3d(${s * k * step}px, ${a * 10}px, ${-k * 190}px) rotateY(${-s * k * 30}deg) rotateX(${a * 1.6}deg) scale(${Math.max(1 - a * 0.08, 0.68)})`;
      c.style.opacity = a === 0 ? 1 : a === 1 ? 0.48 : 0;
      c.style.zIndex = 60 - a * 10;
      c.style.pointerEvents = a <= 1 ? 'auto' : 'none'; // clic sur un voisin = on y va
      c.classList.toggle('is-active', a === 0);
      c.querySelector('a').tabIndex = a === 0 ? 0 : -1; // seul le lien de la carte active est focusable
    });
    count.textContent = `${pad(active + 1)} / ${pad(cards.length)}`;
    bar.style.transform = `scaleX(${(active + 1) / cards.length})`;
  };
  const go = (i) => { active = (i + cards.length) % cards.length; layout(); };

  document.getElementById('cv-prev').onclick = () => go(active - 1);
  document.getElementById('cv-next').onclick = () => go(active + 1);
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  });
  // Glisser (souris / tactile) ; un glissement ne déclenche pas de clic
  let x0 = null, dragged = false;
  stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; dragged = false; });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) { dragged = true; go(active + (dx < 0 ? 1 : -1)); }
  });
  stage.addEventListener('click', (e) => {
    if (dragged) { e.preventDefault(); dragged = false; return; }
    const card = e.target.closest('.cv-card');
    if (card && !card.classList.contains('is-active')) go(cards.indexOf(card));
  }, true);
  addEventListener('resize', layout);
  layout();
}

// Stack en bandeau défilant (liste doublée pour une boucle sans saut ; la copie est masquée aux lecteurs d'écran)
const tools = Object.entries(STACK).flatMap(([cat, list]) => list.map((t) => [cat, t]));
document.getElementById('stack-track').innerHTML = [...tools, ...tools].map(([cat, t], i) => `
  <li ${i >= tools.length ? 'aria-hidden="true"' : ''} class="group flex shrink-0 flex-col rounded-2xl border border-line bg-white/[.03] px-6 py-3 transition hover:border-lime/50">
    <span class="font-mono text-[11px] uppercase tracking-widest text-zinc-500">${cat}</span>
    <span class="mt-1 whitespace-nowrap font-display text-lg font-medium text-white transition group-hover:text-lime">${t}</span>
  </li>`).join('');
document.querySelectorAll('[data-wa]').forEach((a) => (a.href = waLink("Bonjour ! Je viens de voir votre portfolio et j'aimerais discuter d'un projet.")));

// Typing role in hero badge
const roles = [' · Boutiques WhatsApp', ' · Sites vitrines', ' · Web apps', ' · Audits SEO'];
const roleEl = document.getElementById('role');
let ri = 0, ci = 0, del = false;
(function type() {
  const word = roles[ri];
  roleEl.textContent = word.slice(0, ci);
  if (!del && ci === word.length) { del = true; return setTimeout(type, 1600); }
  ci += del ? -1 : 1;
  if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, del ? 35 : 70);
})();

// Cursor spotlight on cards
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Timeline "Ma philosophie" : les étapes s'allument à tour de rôle, en boucle, uniquement quand elle est visible
const flow = document.getElementById('flow');
const steps = [...flow.children];
let step = 0, flowTimer = null;
const paintFlow = () => {
  steps.forEach((s, i) => {
    s.classList.toggle('is-done', i < step);
    s.classList.toggle('is-current', i === step);
  });
  flow.style.setProperty('--p', step / (steps.length - 1));
};
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  step = steps.length - 1; // pas d'animation : tout le parcours est affiché
  paintFlow();
} else {
  paintFlow();
  new IntersectionObserver(([e]) => {
    clearInterval(flowTimer);
    if (e.isIntersecting) flowTimer = setInterval(() => { step = (step + 1) % steps.length; paintFlow(); }, 1400);
  }, { threshold: 0.4 }).observe(flow);
}

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ===== Simulateur de commande WhatsApp =====
let qty = 1, size = 'M', busy = false;
const qtyEl = document.getElementById('qty');
const chat = document.getElementById('chat');
const status = document.getElementById('chat-status');
const waReal = document.getElementById('wa-real');
document.getElementById('p-name').textContent = PRODUCT.name;
document.getElementById('p-price').textContent = fmt(PRODUCT.price);

const sizeBtns = document.querySelectorAll('.size-btn');
const paintSizes = () => sizeBtns.forEach((b) => {
  const on = b.dataset.size === size;
  b.setAttribute('role', 'radio');
  b.setAttribute('aria-checked', on);
  b.classList.toggle('bg-white', on);
  b.classList.toggle('text-ink', on);
  b.classList.toggle('font-semibold', on);
});
sizeBtns.forEach((b) => b.addEventListener('click', () => { size = b.dataset.size; paintSizes(); }));
paintSizes();

document.getElementById('qty-minus').onclick = () => (qtyEl.textContent = qty = Math.max(1, qty - 1));
document.getElementById('qty-plus').onclick = () => (qtyEl.textContent = qty = Math.min(9, qty + 1));

const scrollChat = () => (chat.scrollTop = chat.scrollHeight);
const bubble = (text, mine) => {
  const el = document.createElement('div');
  el.className = `bubble max-w-[85%] whitespace-pre-line rounded-lg px-3 py-2 ${mine ? 'self-end rounded-tr-none bg-[#005c4b] text-white' : 'self-start rounded-tl-none bg-[#1f2c34] text-zinc-200'}`;
  el.textContent = text;
  const meta = document.createElement('span');
  meta.className = 'mt-1 flex items-center justify-end gap-1 text-[11px] text-white/50';
  meta.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (mine) meta.insertAdjacentHTML('beforeend', '<svg class="h-3.5 w-3.5 text-sky-400" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" fill="none"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>');
  el.appendChild(meta);
  chat.appendChild(el);
  scrollChat();
};

document.getElementById('order-btn').addEventListener('click', () => {
  if (busy) return;
  busy = true;
  const ref = 'CMD-' + Math.floor(1000 + Math.random() * 9000);
  const msg = `Bonjour, je souhaite commander :\n• ${PRODUCT.name} — Taille ${size} × ${qty}\nTotal : ${fmt(PRODUCT.price * qty)}\nRéf. #${ref}`;
  bubble(msg, true);

  waReal.href = waLink(msg);
  waReal.classList.remove('pointer-events-none', 'opacity-40');
  document.getElementById('wa-hint').textContent = 'Envoyer pour de vrai →';

  setTimeout(() => {
    status.textContent = 'écrit…';
    const typing = document.createElement('div');
    typing.className = 'bubble flex gap-1 self-start rounded-lg rounded-tl-none bg-[#1f2c34] px-3 py-3';
    typing.innerHTML = '<span class="dot h-1.5 w-1.5 rounded-full bg-zinc-400"></span><span class="dot h-1.5 w-1.5 rounded-full bg-zinc-400"></span><span class="dot h-1.5 w-1.5 rounded-full bg-zinc-400"></span>';
    chat.appendChild(typing);
    scrollChat();

    setTimeout(() => {
      typing.remove();
      status.textContent = 'en ligne';
      bubble(`Merci ! Commande #${ref} bien reçue.\nNous vous confirmons la livraison dans quelques minutes.`, false);
      busy = false;
    }, 1400);
  }, 600);
});

// Formulaire de contact → message WhatsApp pré-rempli (aucun backend)
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text = `Bonjour ! Je suis ${f.get('name').trim()}.\n\n${f.get('message').trim()}`;
  window.open(waLink(text), '_blank', 'noopener');
});
