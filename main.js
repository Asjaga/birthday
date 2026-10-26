// Happy Birthday Rimpal - Interactive Scripts & Animations
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// 1. Dynamic Shimmering Typewriter Effect
(function(){
  const el = $('#typewriter');
  if(!el) return;
  const phrases = [
    'Happy Birthday ✨',
    'To Dearest Rimpal 🌸',
    'Queen of Radiance 👑',
    'Wishing You Endless Joy 💖'
  ];
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  (async function loop(){
    await sleep(1000);
    let pIdx = 0;
    while(true){
      const text = phrases[pIdx % phrases.length];
      for(let i = 1; i <= text.length; i++){
        el.textContent = text.slice(0, i);
        await sleep(95 + Math.random() * 40);
      }
      await sleep(2000);
      for(let i = text.length; i >= 0; i--){
        el.textContent = text.slice(0, i);
        await sleep(40);
      }
      await sleep(350);
      pIdx++;
    }
  })();
})();

// 2. IntersectionObserver for Smooth Scroll Reveal
(function(){
  const elements = $$('[data-r]');
  if(!('IntersectionObserver' in window)){
    elements.forEach(e => e.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(e => observer.observe(e));
})();

// 3. 3D Tilt Interaction (rAF throttled for butter-smooth 60/120fps)
(function(){
  const root = document.documentElement;
  const tilts = [...$$('.tilt')];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  let tiltRaf = null;
  addEventListener('pointermove', e => {
    if(tiltRaf) return;
    tiltRaf = requestAnimationFrame(() => {
      tiltRaf = null;
      root.style.setProperty('--mx', clamp(e.clientX / innerWidth - 0.5, -0.5, 0.5).toFixed(3));
      root.style.setProperty('--my', clamp(e.clientY / innerHeight - 0.5, -0.5, 0.5).toFixed(3));

      for(const t of tilts){
        const r = t.getBoundingClientRect();
        if(e.clientY < r.top - 80 || e.clientY > r.bottom + 80 || e.clientX < r.left - 80 || e.clientX > r.right + 80){
          t.style.transform = '';
          continue;
        }
        const px = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5);
        const py = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);
        t.style.transform = `perspective(900px) rotateY(${(px * 14).toFixed(1)}deg) rotateX(${(-py * 14).toFixed(1)}deg)`;
      }
    });
  }, { passive: true });

  addEventListener('pointerleave', () => tilts.forEach(t => t.style.transform = ''));
  document.addEventListener('pointerup', e => {
    if(e.pointerType === 'touch') tilts.forEach(t => t.style.transform = '');
  });
})();

// 4. Background Music Controller - Exclusively plays Rimpal's Birthday Song (song_traditional_vocal.mp3)
(function(){
  const audio = $('#bgMusic');
  const toggleBtn = $('#musicToggle');
  const eq = $('#equalizer');
  const titleText = $('#musicTitle');
  const statusText = $('#musicStatus');
  const playIcon = $('#playIcon');

  if(audio){
    audio.src = 'audio/song_traditional_vocal.mp3';
    audio.loop = true;
    audio.volume = 1.0;
    audio.muted = false;
    try { audio.load(); } catch(e){}
  }

  function updateUI(playing){
    if(playing){
      if(eq) eq.classList.remove('paused');
      if(statusText) statusText.textContent = 'Playing 🎵';
      if(playIcon) playIcon.textContent = '⏸';
    } else {
      if(eq) eq.classList.add('paused');
      if(statusText) statusText.textContent = 'Tap to Play';
      if(playIcon) playIcon.textContent = '▶';
    }
  }

  let isAttempting = false;
  async function tryPlay(){
    if(!audio || isAttempting) return;
    isAttempting = true;
    try {
      audio.volume = 1.0;
      audio.muted = false;
      const playPromise = audio.play();
      if(playPromise !== undefined){
        await playPromise;
        updateUI(true);
        cleanupInteractionListeners();
      }
    } catch(err) {
      // Browser blocked unprompted autoplay - silent wait for earliest movement/touch
      updateUI(false);
    } finally {
      isAttempting = false;
    }
  }

  function pauseMusic(){
    if(!audio) return;
    audio.pause();
    updateUI(false);
  }

  if(toggleBtn){
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if(audio && !audio.paused){
        pauseMusic();
      } else {
        tryPlay();
      }
    });
  }

  if(audio){
    audio.addEventListener('play', () => updateUI(true));
    audio.addEventListener('playing', () => updateUI(true));
    audio.addEventListener('pause', () => updateUI(false));
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      tryPlay();
    });
  }

  // Direct immediate execution
  tryPlay();

  // On DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', tryPlay);
  }

  // On Window Load
  window.addEventListener('load', tryPlay);

  // Seamless silent triggers on any movement, touch, scroll, focus, or key
  const gestureEvents = [
    'mousemove', 'pointermove', 'pointerdown', 'mousedown', 'mouseup',
    'touchstart', 'touchend', 'scroll', 'wheel', 'keydown', 'focus'
  ];

  function onGesture(){
    if(audio && audio.paused){
      tryPlay();
    }
  }

  function cleanupInteractionListeners(){
    gestureEvents.forEach(evt => {
      window.removeEventListener(evt, onGesture, { capture: true });
      document.removeEventListener(evt, onGesture, { capture: true });
    });
  }

  gestureEvents.forEach(evt => {
    window.addEventListener(evt, onGesture, { capture: true, passive: true });
    document.addEventListener(evt, onGesture, { capture: true, passive: true });
  });
})();

// 5. Interactive Birthday Cake & Candle Blowing Ceremony
(function(){
  const wishBtn = $('#wishBtn');
  const wishMsg = $('#wishMsg');
  const flameWrapper = $('#flameWrapper');

  const lines = [
    'Your wish has been heard by the stars ✨ May all your dreams come true!',
    'Close your eyes, smile brightly, and believe in magic 🌟',
    'Another year wiser, stronger, and more breathtaking than ever 👑',
    'The candles are out—let a magical year begin! 🎂💖',
    'May every day bring you a reason to smile as radiantly as you do 🌸'
  ];
  let msgIdx = 0;

  function blowCandleAndWish(){
    if(flameWrapper){
      flameWrapper.classList.add('blown-out');
    }

    if(wishMsg){
      wishMsg.textContent = lines[msgIdx++ % lines.length];
      wishMsg.classList.remove('pop');
      void wishMsg.offsetWidth;
      wishMsg.classList.add('pop');
    }

    if(typeof confetti === 'function'){
      const cols = ['#ffd27a', '#ff7eb6', '#7fe7ff', '#ffffff', '#ff9ccc', '#ffb86b'];
      confetti({ particleCount: 100, angle: 60, spread: 75, origin: { x: 0, y: 0.7 }, colors: cols });
      confetti({ particleCount: 100, angle: 120, spread: 75, origin: { x: 1, y: 0.7 }, colors: cols });
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 95,
          origin: { y: 0.5 },
          colors: cols
        });
      }, 250);
    }

    spawnLanterns(8);
  }

  if(wishBtn) wishBtn.addEventListener('click', blowCandleAndWish);
  if(flameWrapper) flameWrapper.addEventListener('click', blowCandleAndWish);
})();

// 6. Cherished Moments 3D Polaroid Carousel (5 Photos)
(function(){
  const cards = [...$$('.polaroid')];
  const n = cards.length;
  const stack = $('#stack');
  const count = $('#count');
  if(!cards.length || !stack) return;

  let idx = 0;
  let autoTimer;

  function render(){
    cards.forEach((c, i) => {
      let o = ((i - idx) % n + n) % n;
      if(o > n / 2) o -= n;
      const a = Math.abs(o);

      c.style.zIndex = 15 - a;
      c.style.opacity = a > 2 ? 0 : (a === 2 ? 0.35 : (a === 1 ? 0.75 : 1));
      c.style.pointerEvents = a > 1 ? 'none' : 'auto';
      c.style.filter = a ? `brightness(${0.9 - a * 0.25}) blur(${a * 1}px)` : 'none';
      c.style.transform = `translateX(${o * 62}%) translateZ(${-a * 180}px) rotateY(${-o * 38}deg) rotateZ(${o * 2.5}deg)`;
      c.dataset.o = o;
    });
    if(count) count.textContent = `${idx + 1} / ${n}`;
  }

  const go = d => {
    idx = ((idx + d) % n + n) % n;
    render();
  };

  const userAction = d => {
    go(d);
    clearInterval(autoTimer);
    autoTimer = setInterval(() => go(1), 5500);
  };

  const nextBtn = $('#nextImg');
  const prevBtn = $('#prevImg');
  if(nextBtn) nextBtn.onclick = () => userAction(1);
  if(prevBtn) prevBtn.onclick = () => userAction(-1);

  addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') userAction(1);
    if(e.key === 'ArrowLeft') userAction(-1);
  });

  // Touch and Drag handling
  let startX = null;
  let targetCard = null;

  stack.addEventListener('pointerdown', e => {
    startX = e.clientX;
    targetCard = e.target.closest('.polaroid');
  });

  stack.addEventListener('pointerup', e => {
    if(startX === null) return;
    const diff = e.clientX - startX;
    startX = null;
    if(Math.abs(diff) > 40){
      userAction(diff < 0 ? 1 : -1);
    } else {
      const o = targetCard ? +targetCard.dataset.o : 0;
      if(o !== 0) userAction(o);
    }
  });

  stack.addEventListener('pointercancel', () => { startX = null; });

  render();
  autoTimer = setInterval(() => go(1), 5500);
})();

// 7. Full Screen Lightbox Modal
(function(){
  const modal = $('#lightboxModal');
  const modalImg = $('#lightboxImg');
  const modalCaption = $('#lightboxCaption');
  const closeBtn = $('#lightboxClose');

  if(!modal || !modalImg) return;

  function openLightbox(src, caption){
    modalImg.src = src;
    if(modalCaption) modalCaption.textContent = caption || 'Rimpal ✨';
    modal.classList.add('open');
  }

  function closeLightbox(){
    modal.classList.remove('open');
  }

  $$('.polaroid').forEach(p => {
    p.addEventListener('click', () => {
      const img = p.querySelector('img');
      const cap = p.querySelector('figcaption');
      if(img) openLightbox(img.src, cap ? cap.textContent : '');
    });
  });

  if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', e => {
    if(e.target === modal) closeLightbox();
  });
  addEventListener('keydown', e => {
    if(e.key === 'Escape') closeLightbox();
  });
})();

// 8. 3D Flip Birthday Greeting Card
(function(){
  const card = $('#card');
  const cardContainer = $('#cardContainer');
  const toggleBtn = $('#toggleButton');

  if(!card) return;
  const flip = () => card.classList.toggle('flipped');

  if(toggleBtn){
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      flip();
    });
  }
  if(cardContainer){
    cardContainer.addEventListener('click', flip);
  }
})();

// 9. Sky Lanterns Spawner Function
function spawnLanterns(num = 8){
  const box = $('#lanterns');
  if(!box) return;
  for(let i = 0; i < num; i++){
    const l = document.createElement('span');
    l.className = 'lantern';
    l.style.left = (6 + Math.random() * 88) + '%';
    l.style.setProperty('--t', (5 + Math.random() * 4) + 's');
    l.style.setProperty('--x', ((Math.random() - 0.5) * 140) + 'px');
    l.style.animationDelay = (Math.random() * 1.4) + 's';
    box.appendChild(l);
    l.addEventListener('animationend', () => l.remove());
  }
}

// 10. Butter-smooth Inertial Scrolling Engine (Apple / Awwwards Grade)
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let currentY = window.scrollY;
  let targetY = window.scrollY;
  let isScrolling = false;
  const ease = 0.085; // Silky glide inertia factor

  function clamp(val, min, max){
    return Math.max(min, Math.min(val, max));
  }

  function getMaxScroll(){
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function tick(){
    const diff = targetY - currentY;
    if(Math.abs(diff) < 0.4){
      currentY = targetY;
      window.scrollTo(0, currentY);
      isScrolling = false;
      return;
    }

    currentY += diff * ease;
    window.scrollTo(0, currentY);
    requestAnimationFrame(tick);
  }

  window.addEventListener('wheel', (e) => {
    // Preserve browser zoom behavior with modifier keys
    if(e.ctrlKey || e.metaKey || e.altKey) return;

    e.preventDefault();
    const maxScroll = getMaxScroll();
    let delta = e.deltaY;
    if(e.deltaMode === 1) delta *= 38;
    else if(e.deltaMode === 2) delta *= 750;

    targetY = clamp(targetY + delta, 0, maxScroll);

    if(!isScrolling){
      isScrolling = true;
      requestAnimationFrame(tick);
    }
  }, { passive: false });

  // Sync state if user drags scrollbar, swipes on touch, or uses keyboard
  window.addEventListener('scroll', () => {
    if(!isScrolling){
      currentY = window.scrollY;
      targetY = window.scrollY;
    }
  }, { passive: true });
})();


