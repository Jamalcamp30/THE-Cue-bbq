/* ============================================
   CUE BARBECUE — State-of-the-Art Animation Engine
   Cinematic · Magnetic · Living · Unforgettable
   ============================================ */

(function() {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════

    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    const isMobile = () => window.innerWidth <= 768;
    const prefersReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ═══════════════════════════════════════════
    // 1. ADVANCED SCROLL REVEAL — Intersection Observer
    // ═══════════════════════════════════════════

    const advancedRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Trigger split text animation if present
          const splitChars = entry.target.querySelectorAll('.split-char, .split-word');
          splitChars.forEach((el, i) => {
            setTimeout(() => el.classList.add('animate-in'), i * 35);
          });
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    // Observe new reveal types
    document.querySelectorAll(
      '.reveal-wipe, .reveal-curtain, .reveal-diamond, .reveal-rotate, .reveal-blur, .stagger-cascade'
    ).forEach(el => advancedRevealObserver.observe(el));

    // Also observe existing section-headers for choreographed entrance
    document.querySelectorAll('.section-header').forEach(el => {
      advancedRevealObserver.observe(el);
    });

    // ═══════════════════════════════════════════
    // 2. TEXT SPLIT ANIMATIONS
    // ═══════════════════════════════════════════

    document.querySelectorAll('[data-split-text]').forEach(el => {
      const mode = el.dataset.splitText || 'words'; // 'chars' or 'words'
      const text = el.textContent;
      el.innerHTML = '';
      el.setAttribute('aria-label', text);

      if (mode === 'chars') {
        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.className = 'split-char';
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.transitionDelay = `${i * 30}ms`;
          el.appendChild(span);
        });
      } else {
        text.split(' ').forEach((word, i) => {
          const span = document.createElement('span');
          span.className = 'split-word';
          span.textContent = word;
          span.style.transitionDelay = `${i * 60}ms`;
          el.appendChild(span);
          // Add space
          if (i < text.split(' ').length - 1) {
            el.appendChild(document.createTextNode('\u00A0'));
          }
        });
      }
    });

    // ═══════════════════════════════════════════
    // 3. MAGNETIC BUTTON EFFECTS
    // ═══════════════════════════════════════════

    if (!isMobile() && !prefersReducedMotion()) {
      document.querySelectorAll('[data-magnetic]').forEach(btn => {
        const strength = parseFloat(btn.dataset.magnetic) || 0.3;

        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          btn.style.transform =
            `translate(${x * strength}px, ${y * strength}px)`;

          // Inner text moves more
          const inner = btn.querySelector('.btn__text');
          if (inner) {
            inner.style.transform =
              `translate(${x * strength * 0.5}px, ${y * strength * 0.5}px)`;
          }
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0, 0)';
          const inner = btn.querySelector('.btn__text');
          if (inner) inner.style.transform = 'translate(0, 0)';
        });
      });
    }

    // ═══════════════════════════════════════════
    // 4. 3D TILT CARD SYSTEM
    // ═══════════════════════════════════════════

    if (!isMobile() && !prefersReducedMotion()) {
      document.querySelectorAll('[data-tilt]').forEach(card => {
        const maxTilt = parseFloat(card.dataset.tilt) || 8;
        let ticking = false;

        card.addEventListener('mousemove', (e) => {
          if (ticking) return;
          ticking = true;

          requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (0.5 - y) * maxTilt;
            const tiltY = (x - 0.5) * maxTilt;

            card.style.transform =
              `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

            ticking = false;
          });
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform =
            'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
      });
    }

    // ═══════════════════════════════════════════
    // 5. EMBER CURSOR TRAIL
    // ═══════════════════════════════════════════

    if (!isMobile() && !prefersReducedMotion()) {
      let lastEmberTime = 0;
      const EMBER_THROTTLE = 50; // ms between embers
      const MAX_EMBERS = 20;
      let emberCount = 0;

      document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastEmberTime < EMBER_THROTTLE || emberCount >= MAX_EMBERS) return;
        lastEmberTime = now;
        emberCount++;

        const ember = document.createElement('div');
        ember.className = 'cursor-ember';
        ember.style.left = e.clientX + 'px';
        ember.style.top = e.clientY + 'px';

        // Random drift direction
        const dx = (Math.random() - 0.5) * 30;
        const dy = -(Math.random() * 50 + 20);
        ember.style.setProperty('--dx', dx + 'px');
        ember.style.setProperty('--dy', dy + 'px');

        // Random size
        const size = Math.random() * 4 + 3;
        ember.style.width = size + 'px';
        ember.style.height = size + 'px';

        document.body.appendChild(ember);

        setTimeout(() => {
          ember.remove();
          emberCount--;
        }, 1500);
      });
    }

    // ═══════════════════════════════════════════
    // 6. SCROLL-LINKED COLOR TEMPERATURE
    // ═══════════════════════════════════════════

    const glowLayer = document.querySelector('.scroll-glow-layer');
    if (glowLayer && !prefersReducedMotion()) {
      window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        // Glow intensifies in middle of page
        const intensity = Math.sin(scrollPercent * Math.PI) * 0.8;
        glowLayer.style.opacity = intensity;
      }, { passive: true });
    }

    // ═══════════════════════════════════════════
    // 7. FIRE-TO-TABLE SCROLL PROGRESS
    // ═══════════════════════════════════════════

    const fttContainer = document.querySelector('.ftt-stages');
    const fttProgressBar = document.querySelector('.ftt-progress__bar');

    if (fttContainer && fttProgressBar) {
      fttContainer.addEventListener('scroll', () => {
        const scrollLeft = fttContainer.scrollLeft;
        const maxScroll = fttContainer.scrollWidth - fttContainer.clientWidth;
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        fttProgressBar.style.width = progress + '%';
      });
    }

    // ═══════════════════════════════════════════
    // 8. GLOW-FOLLOW EFFECT ON HOVER CARDS
    // ═══════════════════════════════════════════

    if (!isMobile()) {
      document.querySelectorAll('.glow-hover').forEach(el => {
        const spot = el.querySelector('.glow-hover__spot');
        if (!spot) return;

        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          spot.style.left = (e.clientX - rect.left) + 'px';
          spot.style.top = (e.clientY - rect.top) + 'px';
        });
      });
    }

    // ═══════════════════════════════════════════
    // 9. SMOOTH PARALLAX — requestAnimationFrame
    // ═══════════════════════════════════════════

    if (!prefersReducedMotion()) {
      const depthElements = document.querySelectorAll('[data-depth]');
      let currentScrollY = 0;
      let targetScrollY = 0;
      let parallaxTicking = false;

      if (depthElements.length > 0) {
        window.addEventListener('scroll', () => {
          targetScrollY = window.scrollY;
          if (!parallaxTicking) {
            parallaxTicking = true;
            requestAnimationFrame(updateParallax);
          }
        }, { passive: true });
      }

      function updateParallax() {
        currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);

        depthElements.forEach(el => {
          const depth = parseFloat(el.dataset.depth) || 1;
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const viewCenter = window.innerHeight / 2;
          const distance = center - viewCenter;
          const movement = distance * depth * 0.05;

          el.style.transform = `translateY(${-movement}px)`;
        });

        if (Math.abs(currentScrollY - targetScrollY) > 0.5) {
          requestAnimationFrame(updateParallax);
        } else {
          parallaxTicking = false;
        }
      }
    }

    // ═══════════════════════════════════════════
    // 10. SECTION DIVIDER CREATION
    // ═══════════════════════════════════════════

    function createSmokeDivider() {
      const div = document.createElement('div');
      div.className = 'smoke-divider';
      div.setAttribute('aria-hidden', 'true');
      div.innerHTML = `
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path class="smoke-divider__wave"
            d="M0,60 C120,100 240,20 360,60 C480,100 600,20 720,60 C840,100 960,20 1080,60 C1200,100 1320,20 1440,60 L1440,120 L0,120 Z"
            fill="rgba(212,98,43,0.04)" />
          <path class="smoke-divider__wave"
            d="M0,80 C180,40 360,100 540,60 C720,20 900,90 1080,50 C1260,10 1350,80 1440,60 L1440,120 L0,120 Z"
            fill="rgba(212,98,43,0.03)" />
          <path class="smoke-divider__wave"
            d="M0,50 C200,90 400,30 600,70 C800,110 1000,30 1200,70 C1300,90 1380,50 1440,70 L1440,120 L0,120 Z"
            fill="rgba(212,98,43,0.02)" />
        </svg>
      `;
      return div;
    }

    // Insert dividers between major sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      if (index > 0 && index < sections.length && !prefersReducedMotion()) {
        const divider = createSmokeDivider();
        section.parentNode.insertBefore(divider, section);
      }
    });

    // ═══════════════════════════════════════════
    // 11. COUNTER SPRING ANIMATION — Enhanced
    // ═══════════════════════════════════════════

    const springCounters = document.querySelectorAll('[data-count]');
    const springObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.animated) return;
          el.dataset.animated = 'true';

          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 2000; // ms
          const start = performance.now();

          function springEase(t) {
            // Elastic overshoot
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1
              : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
          }

          function animateCount(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = springEase(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = prefix + current + suffix;

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              el.textContent = prefix + target + suffix;
              el.classList.add('counting');
            }
          }

          requestAnimationFrame(animateCount);
          springObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    springCounters.forEach(c => springObserver.observe(c));

    // ═══════════════════════════════════════════
    // 12. DISH CARD HORIZONTAL SCROLL VELOCITY
    // ═══════════════════════════════════════════

    const dishesScroll = document.querySelector('.dishes-scroll');
    if (dishesScroll && !isMobile()) {
      let scrollVelocity = 0;
      let lastScrollLeft = dishesScroll.scrollLeft;

      dishesScroll.addEventListener('scroll', () => {
        scrollVelocity = dishesScroll.scrollLeft - lastScrollLeft;
        lastScrollLeft = dishesScroll.scrollLeft;

        const cards = dishesScroll.querySelectorAll('.dish-card');
        cards.forEach(card => {
          const skew = clamp(scrollVelocity * 0.15, -3, 3);
          card.style.transform = `skewX(${skew}deg)`;
        });
      });

      // Reset skew when scroll stops
      let scrollTimer;
      dishesScroll.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          dishesScroll.querySelectorAll('.dish-card').forEach(card => {
            card.style.transform = 'skewX(0deg)';
          });
        }, 150);
      });
    }

    // ═══════════════════════════════════════════
    // 13. NAV ACTIVE SECTION TRACKING
    // ═══════════════════════════════════════════

    const navLinks = document.querySelectorAll('.nav__link');
    const trackedSections = [];

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) {
          trackedSections.push({ element: section, link: link });
        }
      }
    });

    if (trackedSections.length > 0) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const match = trackedSections.find(s => s.element === entry.target);
            if (match) {
              navLinks.forEach(l => l.classList.remove('active'));
              match.link.classList.add('active');
            }
          }
        });
      }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

      trackedSections.forEach(s => sectionObserver.observe(s.element));
    }

    // ═══════════════════════════════════════════
    // 14. SMOOTH SCROLL MOMENTUM
    // ═══════════════════════════════════════════

    // Enhanced smooth scroll with momentum feel
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetEl = document.querySelector(this.getAttribute('href'));
        if (!targetEl) return;

        const offset = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) * 0.5 + 500, 1500);
        const startTime = performance.now();

        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function scrollStep(timestamp) {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutExpo(progress);

          window.scrollTo(0, startPosition + distance * easedProgress);

          if (progress < 1) {
            requestAnimationFrame(scrollStep);
          }
        }

        requestAnimationFrame(scrollStep);
      });
    });

    // ═══════════════════════════════════════════
    // 15. HERO WORD CYCLE
    // ═══════════════════════════════════════════

    const heroAccent = document.querySelector('.hero__title-cycle');
    if (heroAccent) {
      const words = ['Homemade Everything', 'Smoke & Soul', 'Southern Craft', 'Live-Fire Luxury'];
      let currentIndex = 0;

      setInterval(() => {
        heroAccent.style.opacity = '0';
        heroAccent.style.transform = 'translateY(20px)';

        setTimeout(() => {
          currentIndex = (currentIndex + 1) % words.length;
          heroAccent.textContent = words[currentIndex];
          heroAccent.style.opacity = '1';
          heroAccent.style.transform = 'translateY(0)';
        }, 400);
      }, 4000);
    }

    // ═══════════════════════════════════════════
    // 16. SCROLL-DRIVEN NAV WARMTH
    // ═══════════════════════════════════════════

    const nav = document.querySelector('.nav');
    if (nav) {
      let lastKnownScrollY = 0;
      let navTicking = false;

      window.addEventListener('scroll', () => {
        lastKnownScrollY = window.scrollY;
        if (!navTicking) {
          requestAnimationFrame(() => {
            // Progressive warmth glow
            const warmth = Math.min(lastKnownScrollY / 500, 1);
            nav.style.setProperty('--nav-glow-opacity', warmth * 0.15);
            navTicking = false;
          });
          navTicking = true;
        }
      }, { passive: true });
    }

    // ═══════════════════════════════════════════
    // 17. MENU TAB TRANSITION ENHANCEMENT
    // ═══════════════════════════════════════════

    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuPanels = document.querySelectorAll('.menu-panel');

    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        // Fade out existing panels
        menuPanels.forEach(panel => {
          if (panel.style.display !== 'none') {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(10px)';
          }
        });

        // After short delay, swap and fade in
        setTimeout(() => {
          menuPanels.forEach(panel => {
            if (panel.dataset.panel === target || target === 'all') {
              panel.style.display = 'grid';
              // Trigger reflow
              void panel.offsetHeight;
              panel.style.opacity = '1';
              panel.style.transform = 'translateY(0)';

              // Stagger child items
              const items = panel.querySelectorAll('.menu-item');
              items.forEach((item, i) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(15px)';
                setTimeout(() => {
                  item.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0)';
                }, i * 50);
              });
            } else {
              panel.style.display = 'none';
            }
          });
        }, 200);
      });
    });

    // ═══════════════════════════════════════════
    // 18. FLAVOR TAG RIPPLE EFFECT
    // ═══════════════════════════════════════════

    document.querySelectorAll('.flavor-tag').forEach(tag => {
      tag.style.position = 'relative';
      tag.style.overflow = 'hidden';

      tag.addEventListener('click', function(e) {
        const rect = tag.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          border-radius: 50%;
          background: rgba(212,98,43,0.3);
          transform: scale(0);
          animation: rippleExpand 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
          z-index: 0;
        `;
        tag.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple keyframe
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes rippleExpand {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════
    // 19. FLOATING AMBIENT EMBERS (Section BGs)
    // ═══════════════════════════════════════════

    if (!isMobile() && !prefersReducedMotion()) {
      function createAmbientEmbers(container) {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        `;
        container.style.position = 'relative';
        container.insertBefore(canvas, container.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId = null;

        function resize() {
          canvas.width = container.offsetWidth;
          canvas.height = container.offsetHeight;
        }

        function createParticle() {
          return {
            x: Math.random() * canvas.width,
            y: canvas.height + 5,
            size: Math.random() * 2 + 0.5,
            speedY: -(Math.random() * 0.3 + 0.1),
            speedX: (Math.random() - 0.5) * 0.2,
            life: Math.random() * 300 + 200,
            maxLife: 0,
            hue: Math.random() * 25 + 15,
            wobble: Math.random() * Math.PI * 2,
          };
        }

        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (particles.length < 15 && Math.random() > 0.95) {
            const p = createParticle();
            p.maxLife = p.life;
            particles.push(p);
          }

          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life--;
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.wobble) * 0.1;
            p.wobble += 0.01;

            if (p.life <= 0 || p.y < -5) {
              particles.splice(i, 1);
              continue;
            }

            const alpha = (p.life / p.maxLife) * 0.6;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `hsl(${p.hue}, 80%, 55%)`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          animId = requestAnimationFrame(animate);
        }

        resize();
        window.addEventListener('resize', resize);

        // Only animate when visible
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (!animId) animate();
            } else {
              if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
              }
            }
          });
        });
        observer.observe(container);
      }

      // Add ambient embers to dark sections
      document.querySelectorAll('.fire-to-table, .cue-standard, .live-music').forEach(section => {
        createAmbientEmbers(section);
      });
    }

    // ═══════════════════════════════════════════
    // 20. SCROLL PROGRESS — Fire Line Enhancement
    // ═══════════════════════════════════════════

    const smokeTrail = document.querySelector('.smoke-line__trail');
    if (smokeTrail && !prefersReducedMotion()) {
      let trailTarget = 0;
      let trailCurrent = 0;

      function updateTrail() {
        trailCurrent = lerp(trailCurrent, trailTarget, 0.08);
        smokeTrail.style.height = trailCurrent + '%';

        if (Math.abs(trailCurrent - trailTarget) > 0.01) {
          requestAnimationFrame(updateTrail);
        }
      }

      window.addEventListener('scroll', () => {
        trailTarget = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        requestAnimationFrame(updateTrail);
      }, { passive: true });
    }

    // ═══════════════════════════════════════════
    // 21. GIFT CARD TILT ON MOUSE
    // ═══════════════════════════════════════════

    if (!isMobile()) {
      const giftCard = document.querySelector('.gift-card-mockup');
      if (giftCard) {
        const parent = giftCard.parentElement;

        parent.addEventListener('mousemove', (e) => {
          const rect = parent.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;

          const rotateY = (x - 0.5) * 20;
          const rotateX = (0.5 - y) * 15;

          giftCard.style.transform =
            `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        parent.addEventListener('mouseleave', () => {
          giftCard.style.transform = 'rotate(-3deg)';
        });
      }
    }

    // ═══════════════════════════════════════════
    // 22. PROOF STRIP ICON HOVER FLOAT
    // ═══════════════════════════════════════════

    document.querySelectorAll('.proof-strip__item').forEach(item => {
      const icon = item.querySelector('.proof-strip__icon');
      if (!icon) return;

      item.addEventListener('mouseenter', () => {
        icon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        icon.style.transform = 'translateY(-8px) scale(1.2)';
      });

      item.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateY(0) scale(1)';
      });
    });

    // ═══════════════════════════════════════════
    // 23. CTA BUTTON PARTICLE BURST ON CLICK
    // ═══════════════════════════════════════════

    document.querySelectorAll('.btn--primary').forEach(btn => {
      btn.addEventListener('click', function(e) {
        if (prefersReducedMotion()) return;

        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
          const particle = document.createElement('div');
          const angle = (Math.PI * 2 * i) / 8;
          const velocity = 40 + Math.random() * 30;
          const dx = Math.cos(angle) * velocity;
          const dy = Math.sin(angle) * velocity;

          particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--cue-ember-glow);
            box-shadow: 0 0 6px rgba(240,133,58,0.8);
            pointer-events: none;
            z-index: 9999;
            animation: particleBurst 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            --particle-dx: ${dx}px;
            --particle-dy: ${dy}px;
          `;

          document.body.appendChild(particle);
          setTimeout(() => particle.remove(), 700);
        }
      });
    });

    // Add particle burst keyframe
    if (!document.querySelector('#particle-burst-style')) {
      const style = document.createElement('style');
      style.id = 'particle-burst-style';
      style.textContent = `
        @keyframes particleBurst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--particle-dx), var(--particle-dy)) scale(0); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════
    // 24. LOCATION CARD — Pulse Ring on Hover
    // ═══════════════════════════════════════════

    document.querySelectorAll('.location-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        const badge = card.querySelector('.location-card__live-badge');
        if (badge) {
          badge.style.animation = 'none';
          void badge.offsetHeight;
          badge.style.animation = 'livePulse 1s ease-in-out infinite';
        }
      });
    });

    // ═══════════════════════════════════════════
    // 25. TYPING EFFECT FOR HERO SUBTITLE
    // ═══════════════════════════════════════════

    // Subtle — hero eyebrow gets a gentle typewriter shimmer
    const heroEyebrow = document.querySelector('.hero__eyebrow');
    if (heroEyebrow && !prefersReducedMotion()) {
      heroEyebrow.style.borderRight = '2px solid var(--cue-ember)';
      heroEyebrow.style.display = 'inline-block';

      // Blinking cursor that fades after animation
      setTimeout(() => {
        heroEyebrow.style.transition = 'border-color 1s';
        heroEyebrow.style.borderColor = 'transparent';
      }, 3500);
    }

  }); // end DOMContentLoaded

})();
