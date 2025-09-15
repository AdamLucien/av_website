// assets/partials/header.js
(function () {
  const L = localStorage.getItem('lang') || 'cs';
  const t = (cs, ua) => (L === 'ua' ? (ua || cs) : (cs || ua));

  // === Bezchybné zjištění base path ===
  // lokálně => '/', na GitHub Pages => '/<repo>/'
  const REPO_BASE = (function () {
    if (location.hostname.endsWith('github.io')) {
      // /username.github.io/<repo>/...
      const segs = location.pathname.split('/').filter(Boolean);
      return '/' + (segs[0] || '') + '/';
    }
    return '/';
  })();
  const base = (p) => REPO_BASE + String(p).replace(/^\//, '');

  // NAV – Domů, Déšť, Statistiky, Růže, Dopis
  const nav = [
    { href: 'index.html',            cs: 'Domů',       ua: 'Додому' },
    { href: 'rain-story/index.html', cs: 'Déšť',       ua: 'Дощ' },
    { href: 'stats/index.html',      cs: 'Statistiky', ua: 'Статистика' },
    { href: 'roses/index.html',      cs: 'Růže',       ua: 'Троянди' },
    { href: 'letter/index.html',     cs: 'Dopis',      ua: 'Лист' },
  ];

  const el = document.getElementById('app-header');
  if (!el) return;

  el.innerHTML = `
  <!-- Posouvá se se stránkou (není sticky) -->
  <header class="relative z-50 bg-black/35 backdrop-blur-xl border-b border-white/10">
    <div class="max-w-6xl mx-auto px-4 py-2">
      <div class="flex items-center justify-between">
        <a class="flex items-center" href="${base('index.html')}" data-no-turn="1">
          <img src="${base('assets/brand/av-logo.png')}" alt="AV · 13" class="h-12 w-auto md:h-14">
        </a>

        <div class="nav-wrap hidden md:block relative">
          <div class="nav-glow absolute inset-0 rounded-xl"></div>
          <nav class="nav glass relative rounded-xl px-2 py-1.5">
            ${nav.map(n => `<a class="navlink px-3 py-2 rounded-lg" href="${base(n.href)}">${t(n.cs, n.ua)}</a>`).join('')}
            <span id="navLine" class="nav-underline"></span>
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <button id="langCZ" class="flag-btn tap" aria-label="Čeština">
            <span class="flag"><svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect width="3" height="1" y="1" fill="#d7141a"/><polygon points="0,0 1.2,1 0,2" fill="#11457e"/></svg></span>
          </button>
          <button id="langUA" class="flag-btn tap" aria-label="Українська">
            <span class="flag"><svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#0057b7"/><rect width="3" height="1" y="1" fill="#ffd700"/></svg></span>
          </button>
          <button id="hamb" class="md:hidden glass rounded-xl px-3 py-2 tap">≡</button>
        </div>
      </div>
    </div>

    <!-- Mobilní menu: tmavý overlay + pevné tmavé pozadí panelu -->
    <div id="drawer" class="hidden fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm">
      <div class="max-w-sm w-[92%] mx-auto mt-16" role="dialog" aria-modal="true">
        <div class="mx-auto w-14 h-1.5 rounded-full bg-white/25 mb-3"></div>
        <div class="rounded-2xl p-5 shadow-2xl border border-white/10 bg-[#0b1022]/95">
          <div class="flex items-center justify-center gap-3 mb-4">
            <button id="langCZm" class="flag-btn" aria-label="Čeština"><span class="flag"><svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect width="3" height="1" y="1" fill="#d7141a"/><polygon points="0,0 1.2,1 0,2" fill="#11457e"/></svg></span></button>
            <button id="langUAm" class="flag-btn" aria-label="Українська"><span class="flag"><svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#0057b7"/><rect width="3" height="1" y="1" fill="#ffd700"/></svg></span></button>
          </div>
          <nav class="divide-y divide-white/10">
            ${nav.map(n => `<a class="block py-3 flex items-center gap-3" href="${base(n.href)}">• ${t(n.cs, n.ua)}</a>`).join('')}
          </nav>
          <button id="drawerClose" class="w-full rounded-xl py-3 mt-5 border border-white/10 bg-white/10">OK</button>
        </div>
      </div>
    </div>
  </header>`;

  // jazyk
  function setLang(l){ localStorage.setItem('lang', l); location.reload(); }
  document.getElementById('langCZ')?.addEventListener('click', () => setLang('cs'));
  document.getElementById('langUA')?.addEventListener('click', () => setLang('ua'));
  document.getElementById('langCZm')?.addEventListener('click', () => setLang('cs'));
  document.getElementById('langUAm')?.addEventListener('click', () => setLang('ua'));

  // drawer (zamkne scroll, klik mimo panel zavírá)
  const drawer = document.getElementById('drawer');
  const openDrawer  = () => { drawer.classList.remove('hidden'); document.documentElement.classList.add('overflow-hidden'); };
  const closeDrawer = () => { drawer.classList.add('hidden');    document.documentElement.classList.remove('overflow-hidden'); };
  document.getElementById('hamb')?.addEventListener('click', openDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });

  // underline aktivní položky (funguje i pro index)
  (function(){
    const navEl = el.querySelector('.nav');
    const line  = el.querySelector('#navLine');
    if(!navEl || !line) return;
    const links = [...navEl.querySelectorAll('a')];

    // aktuální cesta relativně k REPO_BASE
    let here = location.pathname;
    if (here.startsWith(REPO_BASE)) here = here.slice(REPO_BASE.length);
    if (here === '' || here.endsWith('/')) here += 'index.html';

    function moveLine(a){
      const r = a.getBoundingClientRect(), p = navEl.getBoundingClientRect();
      line.style.width = r.width + 'px';
      line.style.transform = `translateX(${r.left - p.left}px)`;
    }
    const idx = links.findIndex(a => here.endsWith(a.getAttribute('href')));
    moveLine(links[idx >= 0 ? idx : 0]);

    links.forEach(a => ['mouseenter','focus','touchstart']
      .forEach(ev => a.addEventListener(ev, () => moveLine(a), {passive:true})));
    navEl.addEventListener('mouseleave', () => moveLine(links[idx >= 0 ? idx : 0]));
  })();
})();