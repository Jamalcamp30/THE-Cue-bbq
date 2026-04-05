/* ============================================
   CUE BARBECUE — Cinematic Intro Engine
   Brisket-Slicing Logo Reveal Sequence
   ============================================ */

(function () {
  'use strict';

  /* ─── Configuration ─── */
  var CONFIG = {
    /* Timeline (ms) — slow-luxurious build, hard-confident finish */
    smokeDelay:       300,
    brisketDelay:     1500,
    knifeFlashDelay:  2600,
    slice1Delay:      3100,   /* 'c' */
    slice2Delay:      3900,   /* 'u' — faster */
    slice3Delay:      4500,   /* 'e' — hardest */
    apostropheDelay:  5100,
    brandDelay:       5600,
    taglineDelay:     6000,
    glowDelay:        6400,
    transitionDelay:  7400,

    /* Particle system */
    maxEmbers:     50,
    maxSmoke:      18,
    emberSpawnRate: 0.08,
    smokeSpawnRate: 0.025,

    /* Skip intro shown after (ms) */
    skipShowDelay: 1500
  };

  /* ─── DOM References ─── */
  var intro, canvas, ctx;
  var smokeLayer, emberGlow, brisket, knifeFlash;
  var letterC, letterU, letterE, apostrophe;
  var slash1, slash2, slash3;
  var pulseEl, brandEl, taglineEl, skipBtn;

  /* ─── State ─── */
  var particles = [];
  var animFrameId = null;
  var isRunning = false;
  var isSkipped = false;
  var timeouts = [];

  /* ═══════════════════════════════════════════
     PARTICLE SYSTEM — Embers & Smoke
     ═══════════════════════════════════════════ */

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createEmber() {
    var cx = canvas.width * 0.5;
    var spread = canvas.width * 0.3;
    return {
      type: 'ember',
      x: cx + (Math.random() - 0.5) * spread,
      y: canvas.height * (0.4 + Math.random() * 0.2),
      size: Math.random() * 2.5 + 0.8,
      speedY: -(Math.random() * 0.8 + 0.2),
      speedX: (Math.random() - 0.5) * 0.5,
      life: Math.random() * 180 + 80,
      maxLife: 0,
      wobble: Math.random() * Math.PI * 2,
      hue: Math.random() * 25 + 15,
      brightness: Math.random() * 25 + 65
    };
  }

  function createSmoke() {
    var cx = canvas.width * 0.5;
    var spread = canvas.width * 0.2;
    return {
      type: 'smoke',
      x: cx + (Math.random() - 0.5) * spread,
      y: canvas.height * (0.45 + Math.random() * 0.1),
      size: Math.random() * 30 + 15,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.3,
      life: Math.random() * 200 + 100,
      maxLife: 0,
      alpha: 0
    };
  }

  function spawnParticles() {
    var embers = particles.filter(function (p) { return p.type === 'ember'; });
    var smokes = particles.filter(function (p) { return p.type === 'smoke'; });

    if (embers.length < CONFIG.maxEmbers && Math.random() < CONFIG.emberSpawnRate) {
      var e = createEmber();
      e.maxLife = e.life;
      particles.push(e);
    }
    if (smokes.length < CONFIG.maxSmoke && Math.random() < CONFIG.smokeSpawnRate) {
      var s = createSmoke();
      s.maxLife = s.life;
      particles.push(s);
    }
  }

  function updateParticles() {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life--;
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.type === 'ember') {
        p.wobble += 0.03;
        p.x += Math.sin(p.wobble) * 0.4;
        p.size *= 0.997;
      }

      if (p.life <= 0 || p.size < 0.2) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var lifeRatio = p.life / p.maxLife;

      if (p.type === 'ember') {
        var alpha = lifeRatio > 0.5 ? 1 : lifeRatio * 2;
        alpha *= 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ', 80%, ' + p.brightness + '%, ' + alpha + ')';
        ctx.fill();

        /* Glow */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ', 90%, 50%, ' + (alpha * 0.15) + ')';
        ctx.fill();
      }

      if (p.type === 'smoke') {
        var sAlpha = lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3 : (lifeRatio > 0.2 ? 1 : lifeRatio / 0.2);
        sAlpha *= 0.04;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 180, 160, ' + sAlpha + ')';
        ctx.fill();
      }
    }
  }

  function particleLoop() {
    if (!isRunning) return;
    spawnParticles();
    updateParticles();
    drawParticles();
    animFrameId = requestAnimationFrame(particleLoop);
  }

  /* ═══════════════════════════════════════════
     JUICE SPRAY — CSS Particle Burst
     ═══════════════════════════════════════════ */
  function spawnJuiceSpray(count) {
    if (!intro) return;
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'cue-intro__juice';
      var angle = Math.random() * Math.PI - Math.PI / 2;
      var dist = Math.random() * 60 + 20;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 15;
      el.style.setProperty('--juice-x', dx + 'px');
      el.style.setProperty('--juice-y', dy + 'px');
      el.style.setProperty('--juice-duration', (Math.random() * 0.3 + 0.4) + 's');
      el.style.width = (Math.random() * 3 + 2) + 'px';
      el.style.height = el.style.width;
      intro.appendChild(el);

      /* Trigger spray */
      requestAnimationFrame(function () {
        el.classList.add('juice--spray');
      });

      /* Clean up */
      (function (elem) {
        setTimeout(function () {
          if (elem.parentNode) elem.parentNode.removeChild(elem);
        }, 800);
      })(el);
    }
  }

  /* ═══════════════════════════════════════════
     BASS HIT — Visual Pulse
     ═══════════════════════════════════════════ */
  function bassHit() {
    if (!pulseEl || !intro) return;
    /* Pulse glow */
    pulseEl.classList.remove('pulse--hit');
    void pulseEl.offsetWidth;
    pulseEl.classList.add('pulse--hit');

    /* Screen shake */
    intro.classList.remove('intro--shake');
    void intro.offsetWidth;
    intro.classList.add('intro--shake');

    /* Burst extra embers on hit */
    for (var i = 0; i < 8; i++) {
      var e = createEmber();
      e.maxLife = e.life;
      e.speedY = -(Math.random() * 2 + 1);
      e.size = Math.random() * 3 + 1.5;
      particles.push(e);
    }
  }

  /* ═══════════════════════════════════════════
     SLASH ANIMATION — Knife Cut Effect
     ═══════════════════════════════════════════ */
  function fireSlash(slashEl) {
    if (!slashEl) return;
    slashEl.classList.remove('slash--active');
    void slashEl.offsetWidth;
    slashEl.classList.add('slash--active');
  }

  /* ═══════════════════════════════════════════
     TIMELINE — Main Sequence Orchestrator
     ═══════════════════════════════════════════ */
  function schedule(fn, delay) {
    var id = setTimeout(fn, delay);
    timeouts.push(id);
    return id;
  }

  function runIntro() {
    isRunning = true;

    /* Start particle system */
    resizeCanvas();
    particleLoop();

    /* Phase 1: Smoke fades in */
    schedule(function () {
      if (isSkipped) return;
      intro.classList.add('intro--smoke');
    }, CONFIG.smokeDelay);

    /* Phase 2: Brisket appears */
    schedule(function () {
      if (isSkipped) return;
      intro.classList.add('intro--brisket');
    }, CONFIG.brisketDelay);

    /* Phase 3: Knife flash */
    schedule(function () {
      if (isSkipped) return;
      knifeFlash.classList.add('flash--active');
    }, CONFIG.knifeFlashDelay);

    /* Phase 4: Slice 1 — 'c' */
    schedule(function () {
      if (isSkipped) return;
      intro.classList.add('intro--slicing');
      fireSlash(slash1);
      bassHit();
      schedule(function () {
        letterC.classList.add('letter--revealed');
      }, 150);
    }, CONFIG.slice1Delay);

    /* Phase 5: Slice 2 — 'u' (faster, harder) */
    schedule(function () {
      if (isSkipped) return;
      fireSlash(slash2);
      bassHit();
      schedule(function () {
        letterU.classList.add('letter--revealed');
      }, 100);
    }, CONFIG.slice2Delay);

    /* Phase 6: Slice 3 — 'e' (hardest, with juice) */
    schedule(function () {
      if (isSkipped) return;
      fireSlash(slash3);
      bassHit();
      spawnJuiceSpray(12);
      schedule(function () {
        letterE.classList.add('letter--revealed');
      }, 80);
    }, CONFIG.slice3Delay);

    /* Phase 7: Apostrophe flick */
    schedule(function () {
      if (isSkipped) return;
      apostrophe.classList.add('letter--revealed');
      /* Small ember burst for the accent */
      for (var i = 0; i < 5; i++) {
        var e = createEmber();
        e.maxLife = e.life;
        e.x = canvas.width * 0.5 - canvas.width * 0.12;
        e.y = canvas.height * 0.42;
        e.speedY = -(Math.random() * 1.5 + 0.5);
        e.size = Math.random() * 2 + 1;
        particles.push(e);
      }
    }, CONFIG.apostropheDelay);

    /* Phase 8: Brand name */
    schedule(function () {
      if (isSkipped) return;
      brandEl.classList.add('brand--visible');
    }, CONFIG.brandDelay);

    /* Phase 9: Tagline */
    schedule(function () {
      if (isSkipped) return;
      taglineEl.classList.add('tagline--visible');
    }, CONFIG.taglineDelay);

    /* Phase 10: Final glow hold */
    schedule(function () {
      if (isSkipped) return;
      intro.classList.add('intro--glow');
    }, CONFIG.glowDelay);

    /* Phase 11: Transition to homepage */
    schedule(function () {
      completeIntro();
    }, CONFIG.transitionDelay);

    /* Show skip button */
    schedule(function () {
      if (skipBtn && !isSkipped) skipBtn.classList.add('skip--visible');
    }, CONFIG.skipShowDelay);
  }

  /* ═══════════════════════════════════════════
     COMPLETE / SKIP
     ═══════════════════════════════════════════ */
  function completeIntro() {
    if (isSkipped) return;
    isSkipped = true;

    /* Clear pending timers */
    for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    timeouts = [];

    /* Stop particles */
    isRunning = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);

    /* Fade out intro */
    intro.classList.add('intro--done');

    /* Trigger site-ready */
    document.body.classList.add('site-ready');

    /* Remove intro from DOM after transition */
    setTimeout(function () {
      if (intro && intro.parentNode) {
        intro.parentNode.removeChild(intro);
      }
    }, 1200);

    /* Store that user has seen intro this session */
    try {
      sessionStorage.setItem('cue-intro-seen', '1');
    } catch (e) { /* silent */ }
  }

  function skipIntro() {
    /* Instantly reveal all letters for a flash view */
    if (letterC) letterC.classList.add('letter--revealed');
    if (letterU) letterU.classList.add('letter--revealed');
    if (letterE) letterE.classList.add('letter--revealed');
    if (apostrophe) apostrophe.classList.add('letter--revealed');
    if (brandEl) brandEl.classList.add('brand--visible');

    setTimeout(function () {
      completeIntro();
    }, 400);
  }

  /* ═══════════════════════════════════════════
     CHECK: Should We Show Intro?
     ═══════════════════════════════════════════ */
  function shouldShowIntro() {
    /* Skip if user prefers reduced motion */
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    /* Skip if already seen this session */
    try {
      if (sessionStorage.getItem('cue-intro-seen') === '1') {
        return false;
      }
    } catch (e) { /* silent */ }
    return true;
  }

  /* ═══════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════ */
  function init() {
    intro = document.querySelector('.cue-intro');
    if (!intro) return;

    /* If intro shouldn't show, remove it and proceed */
    if (!shouldShowIntro()) {
      intro.parentNode.removeChild(intro);
      document.body.classList.add('site-ready');
      return;
    }

    /* Hide old loader if it exists */
    var oldLoader = document.querySelector('.site-loader');
    if (oldLoader) {
      oldLoader.style.display = 'none';
    }

    /* Cache DOM elements */
    canvas      = intro.querySelector('.cue-intro__canvas');
    ctx         = canvas ? canvas.getContext('2d') : null;
    smokeLayer  = intro.querySelector('.cue-intro__smoke');
    emberGlow   = intro.querySelector('.cue-intro__ember-glow');
    brisket     = intro.querySelector('.cue-intro__brisket');
    knifeFlash  = intro.querySelector('.cue-intro__knife-flash');
    letterC     = intro.querySelector('.cue-intro__letter--c');
    letterU     = intro.querySelector('.cue-intro__letter--u');
    letterE     = intro.querySelector('.cue-intro__letter--e');
    apostrophe  = intro.querySelector('.cue-intro__apostrophe');
    slash1      = intro.querySelector('.cue-intro__slash--1');
    slash2      = intro.querySelector('.cue-intro__slash--2');
    slash3      = intro.querySelector('.cue-intro__slash--3');
    pulseEl     = intro.querySelector('.cue-intro__pulse');
    brandEl     = intro.querySelector('.cue-intro__brand');
    taglineEl   = intro.querySelector('.cue-intro__tagline');
    skipBtn     = intro.querySelector('.cue-intro__skip');

    /* Events */
    window.addEventListener('resize', resizeCanvas);
    if (skipBtn) {
      skipBtn.addEventListener('click', skipIntro);
    }

    /* Run after page assets are ready (or fallback) */
    if (document.readyState === 'complete') {
      runIntro();
    } else {
      window.addEventListener('load', function () {
        runIntro();
      });
      /* Fallback: don't wait forever */
      setTimeout(function () {
        if (!isRunning && !isSkipped) runIntro();
      }, 2000);
    }
  }

  /* ─── Bootstrap ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
