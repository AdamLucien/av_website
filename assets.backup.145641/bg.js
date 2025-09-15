(function () {
  const c = document.createElement("canvas");
  c.className = "bg-canvas";
  document.body.appendChild(c);
  const ctx = c.getContext("2d", { alpha: true });

  let W = 0, H = 0, dots = [];
  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    W = c.width  = Math.floor(innerWidth  * dpr);
    H = c.height = Math.floor(innerHeight * dpr);
    c.style.width  = "100%";
    c.style.height = "100%";
    dots = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .25 * dpr,
      vy: (Math.random() - .5) * .25 * dpr,
      r:  (.7 + Math.random() * 1.6) * dpr
    }));
  }
  addEventListener("resize", resize, { passive: true });
  resize();

  let t = 0;
  function frame() {
    t += 0.004;
    ctx.clearRect(0, 0, W, H);

    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#0b1224");
    g.addColorStop(1, "#101a3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 3; i++) {
      const y0 = H * (0.20 + i * 0.22) + Math.sin(t + i) * 26;
      ctx.beginPath(); ctx.moveTo(0, y0);
      for (let x = 0; x <= W; x += 24) {
        const y = y0 + Math.sin(x * 0.003 + t + i) * 12;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ["#4e7bff","#6ea1ff","#9bb8ff"][i];
      ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.globalAlpha = 1;

    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(158,186,255,.9)"; ctx.fill();
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(110,161,255,${1 - dist / 120})`;
          ctx.lineWidth = 1; ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();