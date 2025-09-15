// Globální vrstvy pozadí: slunce, déšť, hvězdy, srdce (respektuje výšku navu)
(function(){
  const d = document;
  if (d.getElementById('avSunrays')) return; // guard

  // helpers
  const $ = (tag, cls, id) => { const el = d.createElement(tag); if(cls) el.className=cls; if(id) el.id=id; return el; };

  // vrstvy
  const sunrays = $('div','bg-layer','avSunrays');
  const sunspot = $('div','bg-layer','avSunspot');
  const stars   = $('div','bg-layer','avStars');
  const rain    = $('div','bg-layer','avRain');
  const hearts  = $('div','bg-layer','avHearts');

  // pořadí + z-index (vždy POD navem)
  const zBase = 0;
  [sunrays,sunspot,stars,rain,hearts].forEach((el,i)=>{
    el.style.position='fixed';
    el.style.inset='0';
    el.style.pointerEvents='none';
    el.style.zIndex = String(zBase + i); // 0..4
  });

  // vložit PŘED <header>, aby nikdy neseděly nad ním
  const frag = d.createDocumentFragment();
  frag.append(sunrays, sunspot, stars, rain, hearts);
  const hdr = d.querySelector('header');
  if (hdr) d.body.insertBefore(frag, hdr); else d.body.prepend(frag);

  // hvězdy
  stars.style.opacity = '.18';
  stars.style.background = [
    'radial-gradient(2px 2px at 20% 30%, #e8eeff 50%, transparent 52%)',
    'radial-gradient(1.5px 1.5px at 60% 70%, #d6e2ff 50%, transparent 52%)',
    'radial-gradient(1.5px 1.5px at 80% 20%, #cfe0ff 50%, transparent 52%)',
    'radial-gradient(1.5px 1.5px at 35% 80%, #e8eeff 50%, transparent 52%)',
    'radial-gradient(1.5px 1.5px at 10% 60%, #e8eeff 50%, transparent 52%)'
  ].join(',');
  stars.style.backgroundSize = '800px 800px';
  stars.animate(
    [{backgroundPosition:'0 0,0 0,0 0,0 0,0 0'},
     {backgroundPosition:'800px 200px,-600px 100px,400px -200px,-400px -100px,200px 300px'}],
    {duration:60000, iterations:Infinity, easing:'linear'}
  );

  // slunce (paprsky + hotspot) – CSS vars
  const root = d.documentElement.style;
  function paintSun(){
    sunrays.style.mixBlendMode = 'screen';
    sunrays.style.filter = 'blur(10px) saturate(120%)';
    sunrays.style.background =
      `conic-gradient(from 0deg at var(--sx) calc(var(--sy) - 20%), rgba(255,248,196,.35), rgba(255,248,196,0) 10%),
       conic-gradient(from 24deg at var(--sx) calc(var(--sy) - 14%), rgba(245,214,122,.28), rgba(245,214,122,0) 12%),
       conic-gradient(from 48deg at var(--sx) calc(var(--sy) -  8%), rgba(255,240,180,.22), rgba(255,240,180,0) 10%),
       radial-gradient(900px 600px at var(--sx) var(--sy), rgba(245,214,122,.35), rgba(245,214,122,0) 60%)`;

    sunspot.style.mixBlendMode = 'screen';
    sunspot.style.filter = 'blur(2px)';
    sunspot.style.background =
      `radial-gradient(circle var(--sr) at var(--sx) var(--sy), rgba(255,248,210,.55), rgba(255,248,210,0) 70%),
       radial-gradient(circle calc(var(--sr) * .55) at var(--sx) var(--sy), rgba(255,255,255,.35), rgba(255,255,255,0) 70%)`;
  }
  paintSun();

  // animace slunce – elipsa + jemné chvění
  (function animateSun(){
    let t0 = performance.now();
    const W = () => window.innerWidth, H = () => window.innerHeight;
    function frame(t){
      const dt = (t - t0)/1000;
      const cx = W()*0.78, cy = H()*0.16;
      const rx = Math.max(140, Math.min(W()*0.22, 320));
      const ry = Math.max( 80, Math.min(H()*0.12, 180));
      const jitterX = Math.sin(dt*0.7)*8, jitterY = Math.cos(dt*0.9)*6;
      const x = cx + Math.cos(dt*0.25)*rx + jitterX;
      const y = cy + Math.sin(dt*0.25)*ry + jitterY;

      root.setProperty('--sx', (x/W()*100) + '%');
      root.setProperty('--sy', (y/H()*100) + '%');

      const base = Math.min(W(),H());
      const r = Math.max(120, Math.min(220, base*0.18 + Math.sin(dt*0.8)*12));
      root.setProperty('--sr', r + 'px');

      // „suché“ kolečko v dešti kolem slunce (mask)
      const mask = `radial-gradient(circle calc(var(--sr) * 1.1) at var(--sx) var(--sy), rgba(0,0,0,0) 98%, rgba(0,0,0,1) 100%)`;
      rain.style.webkitMaskImage = mask;
      rain.style.maskImage       = mask;

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  // déšť – kapky
  (function makeRain(){
    const COUNT = 100;
    for(let i=0;i<COUNT;i++){
      const dEl = document.createElement('span');
      dEl.className = 'drop';
      dEl.style.left = (Math.random()*100)+'%';
      dEl.style.animationDuration = (1.8 + Math.random()*2.2)+'s';
      dEl.style.animationDelay = (-Math.random()*3)+'s';
      dEl.style.height = (36 + Math.random()*28) + 'px';
      rain.appendChild(dEl);
    }
  })();

  // srdce – pouze POD navem (respektuje --navH)
  (function heartsSpawn(){
    const emojis = ['❤️','🔥❤️','🤍','💞'];

    function updateNavH(){
      const h = (document.querySelector('header')?.offsetHeight || 64);
      d.documentElement.style.setProperty('--navH', h + 'px');
    }
    updateNavH();
    window.addEventListener('resize', updateNavH, {passive:true});

    function spawn(){
      const vpH = window.innerHeight;
      const vpW = window.innerWidth;

      const minY = (parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--navH')) || 64) + 12;
      const maxY = Math.max(minY + 40, vpH - 40);

      const h = document.createElement('div');
      h.className = 'heart';
      h.textContent = emojis[(Math.random()*emojis.length)|0];

      const x = vpW * (0.08 + Math.random()*0.84);
      const y = minY + Math.random() * (maxY - minY);

      h.style.position='fixed';
      h.style.left = x + 'px';
      h.style.top  = y + 'px';
      h.style.fontSize = (18 + Math.random()*14) + 'px';
      h.style.zIndex = String(zBase + 4); // nad deštěm, pod headerem

      hearts.appendChild(h);
      setTimeout(()=>h.remove(), 6800);
      setTimeout(spawn, 2200 + Math.random()*1800);
    }
    setTimeout(spawn, 900);
  })();

})();