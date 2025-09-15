(function () {
  const LANG = localStorage.getItem("lang") || "cs";
  document.documentElement.lang = (LANG === "ua" ? "uk" : "cs");

  function setLang(l) { localStorage.setItem("lang", l); location.reload(); }
  window.UX = {
    L: LANG,
    t(cs, ua) { return (LANG === "ua") ? ua : cs; },
    setLang
  };

  function navLink(href, label) {
    return `<a href="${href}" class="nav-link" data-trans="wipe">${label}</a>`;
  }

  const nav = document.createElement("header");
  nav.className = "navbar";
  nav.innerHTML = `
    <div class="logo"><a href="../index.html" data-trans="wipe">AV · 13</a></div>
    <nav>
      ${navLink("../rain-story/index.html","Déšť")}
      ${navLink("../timeline/index.html","Timeline")}
      ${navLink("../stats/index.html","Statistiky")}
      ${navLink("../roses/index.html","Růže")}
      ${navLink("../letter/index.html","Dopis")}
      ${navLink("../game/index.html","Hra")}
    </nav>
    <div class="lang-switch">
      <button data-lang="cs" class="${LANG==='cs'?'active':''}">CZ</button>
      <button data-lang="ua" class="${LANG==='ua'?'active':''}">UA</button>
    </div>
  `;

  // Přidej navbar a overlay po načtení
  window.addEventListener("DOMContentLoaded", () => {
    document.body.prepend(nav);
    nav.querySelectorAll("[data-lang]").forEach(b =>
      b.addEventListener("click", () => setLang(b.dataset.lang))
    );

    // Overlay pro fallback přechod
    const ov = document.createElement('div');
    ov.className = 'route-overlay';
    document.body.appendChild(ov);
  });

  // Smooth scroll pro anchor odkazy
  document.addEventListener("click", (e) => {
  // -------- Page Transitions na klik uvnitř webu --------
  document.addEventListener('click', (e) => {

    // Přepočti cílové URL
    const dest = new URL(href, location.href);
    if (dest.origin !== location.origin) return;

    // Animuj a přejdi
    e.preventDefault();

    // Preferuj View Transitions API (iOS 17+ / moderní)
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        location.href = href;
      });
      return;
    }

    // Fallback: overlay wipe
    document.body.classList.add('route-leave');
    // drobný delay na vykreslení overlaye
    setTimeout(() => { location.href = href; }, 420);
  }, true);
})();// ---- Reveal on scroll (enter animations) ----
function initReveals() {
  // Auto-tag běžných prvků, pokud nemají data-reveal (bez úprav HTML)
  const auto = document.querySelectorAll(`
    .card, .kpi-grid .card, .tl .card,
    h1, h2, h3, .quote-card, .symbol-card, .cta-actions .btn
  `);
  auto.forEach((el, i) => {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
    if (!el.style.getPropertyValue('--rv-delay')) {
      el.style.setProperty('--rv-delay', `${i * 60}ms`);
    }
  });

  // Stagger pro kontejnery (volitelné: přidej data-reveal-stagger na wrapper)
  document.querySelectorAll('[data-reveal-stagger]').forEach(parent => {
    [...parent.children].forEach((ch, i) => {
      ch.style.setProperty('--rv-delay', `${i * 80}ms`);
    });
  });

  // Observer
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}

window.addEventListener('DOMContentLoaded', initReveals);
// --- Mobile hamburger & drawer ---
window.addEventListener("DOMContentLoaded", () => {
  const baseLink = (function(){
    const link=document.querySelector('link[rel="stylesheet"][href*="assets/site.css"]');
    if(!link) return "./"; const href=link.getAttribute("href"); const i=href.indexOf("assets/site.css");
    return i>-1?href.slice(0,i):"./";
  })();

  const header=document.querySelector('.navbar');
  if(header && !document.getElementById('hambBtn')){
    header.querySelector('.logo')?.insertAdjacentHTML('afterend','<div class="hamb"><button id="hambBtn" class="btn">☰ Menu</button></div>');
    const drawer=document.createElement('div');
    drawer.className='nav-drawer';
    drawer.innerHTML = `
      <div style="text-align:center">
        <a href="${baseLink}rain-story/index.html" data-trans="wipe">Déšť</a>
        <a href="${baseLink}timeline/index.html" data-trans="wipe">Timeline</a>
        <a href="${baseLink}stats/index.html" data-trans="wipe">Statistiky</a>
        <a href="${baseLink}roses/index.html" data-trans="wipe">Růže</a>
        <a href="${baseLink}letter/index.html" data-trans="wipe">Dopis</a>
        
      </div>`;
    document.body.appendChild(drawer);
    document.getElementById('hambBtn')?.addEventListener('click',()=>drawer.classList.toggle('open'));
    drawer.addEventListener('click',(e)=>{ if(e.target===drawer) drawer.classList.remove('open'); });
  }
});

// --- Reveal on scroll (IO + GSAP polish) ---
(function(){
  function initReveals(){
    const auto=document.querySelectorAll('.card, .kpi-grid .card, h1, h2, h3, .quote-card, .symbol-card, .cta-actions .btn');
    auto.forEach((el,i)=>{ if(!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal','up'); if(!el.style.getPropertyValue('--rv-delay')) el.style.setProperty('--rv-delay',`${i*60}ms`); });
    const io=new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in');
          if(window.gsap){ gsap.fromTo(e.target,{y:12,opacity:0},{y:0,opacity:1,duration:.5,ease:'power2.out'}); }
          io.unobserve(e.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
  }
  window.addEventListener('DOMContentLoaded',initReveals);
})();

// --- iOS haptics helper ---
window.haptics = function(type){ if(navigator.vibrate){ navigator.vibrate(type==='heavy'?30:10); } };
