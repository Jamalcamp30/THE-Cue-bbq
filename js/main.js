/* ============================================
   CUE BARBECUE — Main Application Controller
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════
  // SITE LOADER
  // ═══════════════════════════════════════════
  const loader = document.querySelector('.site-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.classList.add('site-ready');
      }, 1200);
    });
    // Fallback
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.add('site-ready');
    }, 3000);
  }

  // ═══════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navMobile = document.querySelector('.nav__mobile');
  const navOverlay = document.querySelector('.nav__mobile-overlay');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Warm glow intensity based on scroll
    const warmth = Math.min(scrollY / 2000, 1);
    nav.style.setProperty('--nav-warmth', warmth);

    lastScroll = scrollY;
  });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('open');
      navOverlay.classList.toggle('visible');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMobile.classList.remove('open');
      navOverlay.classList.remove('visible');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMobile.classList.remove('open');
      navOverlay.classList.remove('visible');
      document.body.style.overflow = '';
    });
  });

  // ═══════════════════════════════════════════
  // EMBER PARTICLES
  // ═══════════════════════════════════════════
  const heroParticles = document.querySelector('.hero__particles');
  if (heroParticles && window.EmberParticleSystem) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    heroParticles.appendChild(canvas);
    const embers = new EmberParticleSystem(canvas);
    embers.start();

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          embers.start();
        } else {
          embers.stop();
        }
      });
    });
    observer.observe(heroParticles);
  }

  // ═══════════════════════════════════════════
  // SMOKEHOUSE MODE (Day/Night Toggle)
  // ═══════════════════════════════════════════
  const modeToggle = document.querySelector('.mode-toggle');
  const modeLabel = document.querySelector('.mode-toggle__label');

  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      document.body.classList.toggle('night-mode');
      const isNight = document.body.classList.contains('night-mode');
      if (modeLabel) {
        modeLabel.textContent = isNight ? 'Night Mode' : 'Day Mode';
      }
    });
  }

  // ═══════════════════════════════════════════
  // SCROLL REVEAL ANIMATIONS
  // ═══════════════════════════════════════════
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // ═══════════════════════════════════════════
  // SMOKE SCROLL LINE
  // ═══════════════════════════════════════════
  const smokeTrail = document.querySelector('.smoke-line__trail');
  if (smokeTrail) {
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      smokeTrail.style.height = scrollPercent + '%';
    });
  }

  // ═══════════════════════════════════════════
  // MENU TABS
  // ═══════════════════════════════════════════
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      menuPanels.forEach(panel => {
        if (panel.dataset.panel === target || target === 'all') {
          panel.style.display = 'grid';
          panel.style.animation = 'fadeInUp 0.4s ease-out';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // ═══════════════════════════════════════════
  // FLAVOR MAP
  // ═══════════════════════════════════════════
  const flavorTags = document.querySelectorAll('.flavor-tag');
  const flavorResults = document.querySelector('.flavor-results');
  let activeFilters = new Set();

  const flavorData = [
    { name: 'Smoked Jumbo Wings', icon: '🍗', desc: 'Brined, smoked, and fried crispy', flavors: ['smoky', 'crispy', 'shareable'] },
    { name: 'BBQ Nachos', icon: '🧀', desc: 'Pulled pork, cheese, jalapeños, house sauce', flavors: ['smoky', 'rich', 'shareable', 'spicy'] },
    { name: 'Brisket Platter', icon: '🥩', desc: 'Slow-smoked 14-hour brisket, hand-sliced', flavors: ['smoky', 'rich', 'savory'] },
    { name: 'St. Louis Ribs', icon: '🍖', desc: 'Full rack with our signature glaze', flavors: ['smoky', 'sweet', 'rich'] },
    { name: 'Macaroni Slammer', icon: '🧈', desc: 'Five-cheese baked mac & cheese', flavors: ['rich', 'creamy', 'savory'] },
    { name: 'Bacon Baked Beans', icon: '🫘', desc: 'Slow-cooked with smoked bacon and molasses', flavors: ['smoky', 'sweet', 'savory'] },
    { name: 'Grilled Pineapple', icon: '🍍', desc: 'Caramelized with cinnamon butter', flavors: ['sweet', 'tangy', 'crispy'] },
    { name: 'Banana Pudding', icon: '🍌', desc: 'Scratch-made Southern classic', flavors: ['sweet', 'creamy'] },
    { name: 'Hot Links', icon: '🌶️', desc: 'House-smoked sausage with kick', flavors: ['smoky', 'spicy', 'savory'] },
    { name: 'Pulled Pork Sandwich', icon: '🥪', desc: 'Hand-pulled, house sauce, pickles', flavors: ['smoky', 'tangy', 'savory'] },
    { name: 'Fried Okra', icon: '🫒', desc: 'Cornmeal-crusted, served with ranch', flavors: ['crispy', 'savory'] },
    { name: 'Collard Greens', icon: '🥬', desc: 'Slow-braised with smoked ham hocks', flavors: ['smoky', 'savory', 'rich'] },
  ];

  flavorTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const flavor = tag.dataset.flavor;
      tag.classList.toggle('active');

      if (activeFilters.has(flavor)) {
        activeFilters.delete(flavor);
      } else {
        activeFilters.add(flavor);
      }

      updateFlavorResults();
    });
  });

  function updateFlavorResults() {
    if (!flavorResults) return;

    if (activeFilters.size === 0) {
      flavorResults.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column:1/-1;">Select flavor profiles above to discover your perfect dish</p>';
      return;
    }

    const matches = flavorData.filter(item =>
      [...activeFilters].some(f => item.flavors.includes(f))
    ).sort((a, b) => {
      const aMatch = [...activeFilters].filter(f => a.flavors.includes(f)).length;
      const bMatch = [...activeFilters].filter(f => b.flavors.includes(f)).length;
      return bMatch - aMatch;
    });

    flavorResults.innerHTML = matches.map(item => `
      <div class="flavor-result">
        <span class="flavor-result__icon">${item.icon}</span>
        <div>
          <div class="flavor-result__name">${item.name}</div>
          <div class="flavor-result__desc">${item.desc}</div>
        </div>
      </div>
    `).join('');
  }

  // ═══════════════════════════════════════════
  // "WHAT SHOULD I ORDER?" QUIZ
  // ═══════════════════════════════════════════
  const quizQuestions = document.querySelectorAll('.quiz-question');
  const quizResult = document.querySelector('.quiz-result');
  const quizDots = document.querySelectorAll('.quiz-dot');
  let quizStep = 0;
  const quizAnswers = [];

  const quizRecommendations = {
    'bold-big': { dish: 'The Brisket Platter', why: 'Bold flavors meet generous portions. Our 14-hour smoked brisket with two scratch-made sides is what barbecue dreams are made of.' },
    'bold-light': { dish: 'Smoked Jumbo Wings', why: 'All the smoky intensity without the heaviness. Brined, smoked, then fried to crispy perfection.' },
    'mild-big': { dish: 'St. Louis Ribs (Full Rack)', why: 'A generous, crowd-pleasing rack with a sweet glaze that lets the smoke shine through gently.' },
    'mild-light': { dish: 'Pulled Pork Sandwich', why: 'Tender, approachable, and perfectly balanced. The gateway to Cue\'s smokehouse world.' },
    'adventurous-big': { dish: 'BBQ Nachos + Hot Links Combo', why: 'Go big and bold! Loaded nachos with house-smoked hot links for the daring appetite.' },
    'adventurous-light': { dish: 'Grilled Pineapple + Bacon Beans', why: 'Unexpected flavors that surprise and delight. Our wildcard picks for the adventurous eater.' },
  };

  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', () => {
      quizAnswers.push(option.dataset.value);
      quizStep++;

      quizQuestions.forEach(q => q.classList.remove('active'));
      quizDots.forEach((d, i) => {
        if (i < quizStep) d.classList.add('active');
      });

      if (quizStep < quizQuestions.length) {
        quizQuestions[quizStep].classList.add('active');
      } else {
        showQuizResult();
      }
    });
  });

  function showQuizResult() {
    const key = quizAnswers.join('-');
    const rec = quizRecommendations[key] || quizRecommendations['bold-big'];

    if (quizResult) {
      document.querySelector('.quiz-result__dish').textContent = rec.dish;
      document.querySelector('.quiz-result__why').textContent = rec.why;
      quizResult.classList.add('active');
    }
  }

  const quizRestart = document.querySelector('.quiz-restart');
  if (quizRestart) {
    quizRestart.addEventListener('click', () => {
      quizStep = 0;
      quizAnswers.length = 0;
      quizDots.forEach(d => d.classList.remove('active'));
      quizResult.classList.remove('active');
      quizQuestions.forEach(q => q.classList.remove('active'));
      quizQuestions[0].classList.add('active');
    });
  }

  // ═══════════════════════════════════════════
  // GIFT CARD AMOUNTS
  // ═══════════════════════════════════════════
  const giftAmounts = document.querySelectorAll('.gift-amount');
  const giftAmountDisplay = document.querySelector('.gift-card-mockup__amount');

  giftAmounts.forEach(btn => {
    btn.addEventListener('click', () => {
      giftAmounts.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (giftAmountDisplay) {
        giftAmountDisplay.textContent = btn.textContent;
      }
    });
  });

  // ═══════════════════════════════════════════
  // SMOOTH SCROLL
  // ═══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ═══════════════════════════════════════════
  // FIRE-TO-TABLE HORIZONTAL SCROLL SYNC
  // ═══════════════════════════════════════════
  const fttContainer = document.querySelector('.ftt-stages');
  if (fttContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    fttContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - fttContainer.offsetLeft;
      scrollLeft = fttContainer.scrollLeft;
      fttContainer.style.cursor = 'grabbing';
    });
    fttContainer.addEventListener('mouseleave', () => { isDown = false; fttContainer.style.cursor = 'grab'; });
    fttContainer.addEventListener('mouseup', () => { isDown = false; fttContainer.style.cursor = 'grab'; });
    fttContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - fttContainer.offsetLeft;
      const walk = (x - startX) * 2;
      fttContainer.scrollLeft = scrollLeft - walk;
    });
    fttContainer.style.cursor = 'grab';
  }

  // ═══════════════════════════════════════════
  // COUNTER ANIMATION (for stats)
  // ═══════════════════════════════════════════
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = prefix + Math.round(current) + suffix;
        }, 20);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ═══════════════════════════════════════════
  // PARALLAX EFFECTS
  // ═══════════════════════════════════════════
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY) * speed;
        el.style.transform = `translateY(${scrollY * speed * -0.2}px)`;
      });
    });
  }

  // ═══════════════════════════════════════════
  // CATERING FORM HANDLING
  // ═══════════════════════════════════════════
  const cateringForm = document.querySelector('.quote-form');
  if (cateringForm) {
    cateringForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = cateringForm.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Quote Request Sent!';
      btn.style.background = '#4ade80';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        cateringForm.reset();
      }, 3000);
    });
  }

  // ═══════════════════════════════════════════
  // NEWSLETTER FORM
  // ═══════════════════════════════════════════
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('.btn');
      const input = newsletterForm.querySelector('.newsletter__input');
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#4ade80';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Join the Pit Crew';
        btn.style.background = '';
      }, 3000);
    });
  }

});
