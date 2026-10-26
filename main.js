// Happy Birthday Rimpal - Interactive Scripts & Animations
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// 0. Scroll to top on page load/refresh
if('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// 1. Dynamic Shimmering Typewriter Effect
(function(){
  const el = $('#typewriter');
  if(!el) return;
  const phrases = [
    'Happy Birthday Rimpal! 🎂',
    'To an absolute angel 🌸',
    'From our school days till now ✨',
    'Always keep smiling 💖'
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

// 3. 3D Tilt Interaction (Desktop mouse only, skips touch to preserve 120Hz native phone scrolling)
(function(){
  const root = document.documentElement;
  const tilts = [...$$('.tilt')];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  let tiltRaf = null;
  addEventListener('pointermove', e => {
    // Never run heavy reflows on mobile touch gestures
    if(e.pointerType === 'touch') return;
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

  if(!audio) return;

  audio.src = 'audio/song_traditional_vocal.mp3';
  audio.loop = true;
  audio.volume = 1.0;
  audio.muted = false;

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

  function startAudio(){
    if(!audio) return;
    audio.muted = false;
    audio.volume = 1.0;
    const p = audio.play();
    if(p && typeof p.then === 'function'){
      p.then(() => {
        updateUI(true);
        removeUnlockers();
      }).catch(err => {
        updateUI(false);
      });
    }
  }

  function toggleAudio(e){
    if(e) e.stopPropagation();
    if(audio.paused){
      startAudio();
    } else {
      audio.pause();
      updateUI(false);
    }
  }

  if(toggleBtn){
    toggleBtn.addEventListener('click', toggleAudio);
  }

  audio.addEventListener('play', () => updateUI(true));
  audio.addEventListener('playing', () => updateUI(true));
  audio.addEventListener('pause', () => updateUI(false));
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    startAudio();
  });

  // Direct immediate execution
  startAudio();

  // On DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', startAudio);
  }

  // On Window Load
  window.addEventListener('load', startAudio);

  // Unblock on the very first natural user interaction anywhere on screen
  const unlockEvents = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'click', 'keydown'];
  function onFirstInteraction(){
    if(audio.paused){
      startAudio();
    }
  }

  function removeUnlockers(){
    unlockEvents.forEach(evt => {
      window.removeEventListener(evt, onFirstInteraction, { capture: true });
      document.removeEventListener(evt, onFirstInteraction, { capture: true });
    });
  }

  unlockEvents.forEach(evt => {
    window.addEventListener(evt, onFirstInteraction, { capture: true, passive: true });
    document.addEventListener(evt, onFirstInteraction, { capture: true, passive: true });
  });
})();

// 5. Interactive Birthday Cake & Candle Blowing Ceremony
(function(){
  const wishBtn = $('#wishBtn');
  const wishMsg = $('#wishMsg');
  const flameWrapper = $('#flameWrapper');

  const lines = [
    'Your wish is made! May all your dreams come true 🌟',
    'Keep smiling always, you truly deserve the best year ahead 💖',
    'The candles are out—time for lots of cake and happy moments! 🎂✨',
    'May you always stay as sweet and cheerful as you are 🌸',
    'To another amazing year of laughter and great friendship! 🥂✨'
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

// 8. Royal Birthday Card Interaction
(function(){
  const royalCard = $('#royalCard');
  const sealBtn = $('#sealBtn');
  const closeBtn = $('#cardCloseBtn');

  if(!royalCard) return;

  function openCard(e){
    if(e) e.stopPropagation();
    if(!royalCard.classList.contains('opened')){
      royalCard.classList.add('opened');
      if(typeof confetti === 'function'){
        const cols = ['#ffd77a', '#ff6b9d', '#fff0b3', '#ffffff', '#ff9ebb', '#ffb86b'];
        confetti({
          particleCount: 85,
          spread: 85,
          origin: { y: 0.6 },
          colors: cols,
          scalar: 1.15
        });
      }
      if(typeof spawnLanterns === 'function') spawnLanterns(4);
    }
  }

  function closeCard(e){
    if(e) e.stopPropagation();
    royalCard.classList.remove('opened');
  }

  if(sealBtn) sealBtn.addEventListener('click', openCard);
  const cardCover = $('#cardCover');
  if(cardCover) cardCover.addEventListener('click', openCard);
  if(closeBtn) closeBtn.addEventListener('click', closeCard);
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


