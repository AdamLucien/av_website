(function () {
  const LANG = localStorage.getItem("lang") || "cs";
  document.documentElement.lang = (LANG === "ua" ? "uk" : "cs");
  function setLang(l){ localStorage.setItem("lang", l); location.reload(); }
  window.UX = { L: LANG, t(cs, ua){ return (LANG==='ua')?ua:cs; }, setLang };

  function detectBasePrefix(){
    const link = document.querySelector('link[rel="stylesheet"][href*="assets/site.css"]');
    if(!link) return "./";
    const href = link.getAttribute("href");
    const i = href.indexOf("assets/site.css");
    return i>-1 ? href.slice(0,i) : "./";
  }
  const BASE = detectBasePrefix();

  function navLink(path,label){ return `<a href="${BASE}${path}" class="nav-link" data-trans="wipe">${label}</a>`; }

  const header = document.createElement('header');
  header.className = 'navbar';
  header.innerHTML = `
    <div class="logo"><a href="${BASE}index.html" data-trans="wipe">AV · 13</a></div>
    <nav>
      ${navLink("rain-story/index.html","Déšť")}
      ${navLink("timeline/index.html","Timeline")}
      ${navLink("stats/index.html","Statistiky")}
      ${navLink("roses/index.html","Růže")}
      ${navLink("letter/index.html","Dopis")}
      ${navLink("game/index.html","Hra")}
    </nav>
    <div class="lang-switch">
      <button data-lang="cs" class="${LANG==='cs'?'active':''}">CZ</button>
      <button data-lang="ua" class="${LANG==='ua'?'active':''}">UA</button>
    </div>
  `;

  window.addEventListener('DOMContentLoaded', () => {
    document.body.prepend(header);
    header.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', ()=> setLang(b.dataset.lang)));
    const ov = document.createElement('div'); ov.className='route-overlay'; document.body.appendChild(ov);

    if(!document.getElementById('hambBtn')){
      header.querySelector('.logo')?.insertAdjacentHTML('afterend','<div class="hamb"><button id="hambBtn" class="btn">☰ Menu</button></div>');
      const drawer=document.createElement('div');
      drawer.className='nav-drawer';
      drawer.innerHTML = `
        <div style="text-align:center">
          ${navLink("rain-story/index.html","Déšť")}
          ${navLink("timeline/index.html","Timeline")}
          ${navLink("stats/index.html","Statistiky")}
          ${navLink("roses/index.html","Růže")}
          ${navLink("letter/index.html","Dopis")}
          ${navLink("game/index.html","Hra")}
        </div>`;
      document.body.appendChild(drawer);
      document.getElementById('hambBtn')?.addEventListener('click',()=>drawer.classList.toggle('open'));
      drawer.addEventListener('click',(e)=>{ if(e.target===drawer) drawer.classList.remove('open'); });
    }
  });

  document.addEventListener('click',(e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    if(a.closest('.btn') || a.getAttribute('role')==='button') return;
    if(e.target.closest('button')) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  }, true);

  document.addEventListener('click',(e)=>{
    const a = e.target.closest('a[href]');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || a.target==='_blank') return;
    e.preventDefault();
    if(document.startViewTransition){
      document.startViewTransition(()=>{ location.href = href; });
      return;
    }
    document.body.classList.add('route-leave');
    setTimeout(()=>{ location.href = href; }, 420);
  }, true);

  function initReveals(){
    const auto=document.querySelectorAll('.card, .kpi-grid .card, .tl .card, h1, h2, h3, .quote-card, .symbol-card, .cta-actions .btn');
    auto.forEach((el,i)=>{ if(!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal','up'); if(!el.style.getPropertyValue('--rv-delay')) el.style.setProperty('--rv-delay',`${i*60}ms`); });
    const io=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{threshold:.12,rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
  }
  window.addEventListener('DOMContentLoaded', initReveals);

  window.haptics = function(type){ if(navigator.vibrate){ navigator.vibrate(type==='heavy'?30:10); } };
})();
