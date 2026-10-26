// Dreamy Magical Night Sky Background: Twinkling Stars, Shooting Stars, Sakura Petals & Glowing Fireflies
(function(){
  const canvas = document.getElementById('bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let stars = [];
  let petals = [];
  let shots = [];
  let fireflies = [];
  const R = Math.random;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Generate dreamy stars
    const starCount = Math.floor((w * h) / 3800);
    stars = Array.from({length: starCount}, () => ({
      x: R() * w,
      y: R() * h * 0.85,
      r: 0.4 + R() * 1.6,
      s: R() * 6,
      f: 0.6 + R() * 2.2,
      color: R() > 0.3 ? '255,250,235' : (R() > 0.5 ? '255,190,220' : '190,235,255')
    }));

    // Floating sakura / rose petals
    const petalCount = Math.min(28, Math.max(16, Math.floor(w / 45)));
    petals = Array.from({length: petalCount}, () => newPetal(true));

    // Glowing fairy fireflies
    const fireflyCount = Math.min(18, Math.max(10, Math.floor(w / 70)));
    fireflies = Array.from({length: fireflyCount}, () => ({
      x: R() * w,
      y: R() * h,
      r: 1.2 + R() * 2.2,
      vx: (R() - 0.5) * 0.6,
      vy: -0.3 - R() * 0.7,
      a: R() * Math.PI * 2,
      va: (R() - 0.5) * 0.04,
      hue: R() > 0.5 ? 45 : 330,
      glow: 8 + R() * 12
    }));
  }

  function newPetal(anywhere){
    return {
      x: R() * w,
      y: anywhere ? R() * h : -25,
      s: 8 + R() * 10,
      vy: 0.5 + R() * 1.0,
      vx: 0.3 + R() * 0.8,
      a: R() * 6,
      va: (R() - 0.5) * 0.035,
      f: R() * 6,
      ff: 0.02 + R() * 0.03,
      h: 330 + R() * 25
    };
  }

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);
    ctx.scale(Math.cos(p.f), 1);
    const grad = ctx.createLinearGradient(0, -p.s, 0, p.s);
    grad.addColorStop(0, `hsla(${p.h}, 100%, 92%, 0.85)`);
    grad.addColorStop(1, `hsla(${p.h}, 85%, 68%, 0.7)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -p.s);
    ctx.bezierCurveTo(p.s, -p.s * 0.6, p.s * 0.9, p.s * 0.6, 0, p.s);
    ctx.bezierCurveTo(-p.s * 0.9, p.s * 0.6, -p.s, -p.s * 0.6, 0, -p.s);
    ctx.fill();
    ctx.restore();
  }

  let lastShotTime = 0;
  function draw(t){
    ctx.clearRect(0, 0, w, h);

    // 1. Twinkling Stars
    for(const s of stars){
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin((t / 1000) * s.f + s.s));
      ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Shooting Stars
    if(t - lastShotTime > 3000 + R() * 3500){
      lastShotTime = t;
      shots.push({
        x: R() * w * 0.85 + w * 0.15,
        y: R() * h * 0.35,
        len: 120 + R() * 100,
        l: 0
      });
    }
    shots = shots.filter(s => s.l < 1);
    for(const s of shots){
      s.l += 0.022;
      const px = s.x - s.l * 320;
      const py = s.y + s.l * 180;
      const grad = ctx.createLinearGradient(px, py, px + 100, py - 56);
      grad.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, 1 - s.l)})`);
      grad.addColorStop(0.3, `rgba(255, 215, 150, ${Math.max(0, 0.7 - s.l)})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 100, py - 56);
      ctx.stroke();
    }

    // 3. Glowing Fireflies / Fairy Dust (optimized halo gradient, 0 GPU blur penalty)
    for(const f of fireflies){
      f.x += f.vx + Math.sin(t / 800 + f.a) * 0.4;
      f.y += f.vy;
      f.a += f.va;
      if(f.y < -20 || f.x < -20 || f.x > w + 20){
        f.y = h + 20;
        f.x = R() * w;
      }
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t / 700 + f.a));
      // Outer soft aura
      ctx.beginPath();
      ctx.fillStyle = `hsla(${f.hue}, 100%, 75%, ${alpha * 0.25})`;
      ctx.arc(f.x, f.y, f.r * 2.8, 0, Math.PI * 2);
      ctx.fill();
      // Inner glowing core
      ctx.beginPath();
      ctx.fillStyle = `hsla(${f.hue}, 100%, 90%, ${alpha})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Sakura / Rose Petals
    for(const p of petals){
      p.y += p.vy;
      p.x += p.vx + Math.sin(t / 950 + p.f) * 0.7;
      p.a += p.va;
      p.f += p.ff;
      if(p.y > h + 30 || p.x > w + 40){
        Object.assign(p, newPetal(false), { x: R() * w - w * 0.2 });
      }
      drawPetal(p);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();
