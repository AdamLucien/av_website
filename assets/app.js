(function () {
  // === LANG / UX helper ===
  const LANG = localStorage.getItem("lang") || "cs";
  document.documentElement.lang = (LANG === "ua" ? "uk" : "cs");
  function setLang(l){ localStorage.setItem("lang", l); location.reload(); }
  window.UX = { L: LANG, t(cs, ua){ return LANG==='ua'?ua:cs; }, setLang };

  // === Page-turn přechod (s View Transitions, když jsou) ===
  function pageTurnTo(href){
    const go = () => { location.href = href; };

    if (document.startViewTransition) {
      // Naše „stránkový list“ overlay + nativní VT
      const ov = document.createElement('div');
      ov.className = 'book-turn';
      document.body.appendChild(ov);
      // necháme overlay „přikrýt“ a současně pustíme VT
      document.startViewTransition(go);
      return;
    }

    // Fallback bez VT
    const ov = document.createElement('div');
    ov.className = 'book-turn';
    document.body.appendChild(ov);
    setTimeout(go, 600);
  }

  // === Jednotný click handler
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;

    // modifikátory / nové okno / download / contenteditable -> nech default
    if (e.defaultPrevented) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.target.closest('[contenteditable=""],[contenteditable="true"]')) return;

    const href = a.getAttribute('href') || '';
    if (!href) return;

    // kotvy na stejné stránce (smooth scroll)
    if (href.startsWith('#')) {
      if (a.dataset.noSmooth === '1') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      return;
    }

    // externí/absolutní mimo stejný původ -> nech default
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;

    // nepoužívat turn (opt-out)
    if (a.dataset.noTurn === '1') return;

    // normální interní navigace s „page turn“
    e.preventDefault();
    pageTurnTo(url.href);
  }, true);

  // === Reveal-on-scroll (bez GSAP)
  function initReveals(){
    const auto=document.querySelectorAll('.card, .glass, h1, h2, h3, .btn');
    auto.forEach((el,i)=>{
      if(!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal','');
      el.style.setProperty('--rv-delay',`${i*60}ms`);
    });
    const io=new IntersectionObserver(ents=>{
      ents.forEach(x=>{
        if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); }
      });
    },{threshold:.12});
    document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
  }
  window.addEventListener('DOMContentLoaded', initReveals, {once:true});

  // === Guard: stránky s vlastním navem (data-noappnav) – tady nic neinjektujeme
  if (document.body && document.body.hasAttribute('data-noappnav')) return;
})();

/* =========================
   NAV underline (jednotné)
   ========================= */
(function(){
  const nav = document.querySelector('.nav');
  const line = document.getElementById('navLine');
  if (!nav || !line) return;

  const links=[...nav.querySelectorAll('.nav a')];

  // vyber „aktivní“ link dle cesty (ignoruje ../ a index.html)
  function norm(p){ try{
    const u=new URL(p, location.href);
    return u.pathname.replace(/\/index\.html$/,'/'); }
    catch{ return p; }
  }
  const here = norm(location.pathname);
  let active = links.find(a => norm(a.getAttribute('href')) === here) || links[0];

  function moveLine(el){
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = nav.getBoundingClientRect();
    line.style.width = r.width+'px';
    line.style.transform = `translateX(${r.left - p.left}px)`;
  }

  // init
  moveLine(active);

  // interakce
  links.forEach(a=>{
    ['mouseenter','focus','touchstart'].forEach(ev =>
      a.addEventListener(ev,()=>moveLine(a),{passive:true})
    );
    a.addEventListener('click', ()=>{ active=a; }, {passive:true });
  });

  nav.addEventListener('mouseleave',()=>moveLine(active),{passive:true});
  window.addEventListener('resize', ()=>moveLine(active), {passive:true});
})();