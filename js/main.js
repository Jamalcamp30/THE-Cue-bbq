/* ============================================
   CUE BARBECUE — Main Application Controller
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════
  // SITE LOADER (fallback when cinematic intro handles transition)
  // ═══════════════════════════════════════════
  const cueIntro = document.querySelector('.cue-intro');
  const loader = document.querySelector('.site-loader');

  if (cueIntro) {
    // Cinematic intro handles site-ready; just hide the old loader
    if (loader) {
      loader.classList.add('loaded');
    }
  } else if (loader) {
    // No intro present — use original loader behavior
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

  const orderState = {
    cartCount: 0,
    cartSubtotal: 0,
    etaFloor: 20,
    location: 'milton'
  };

  function initLiveSignals() {
    const signalText = document.getElementById('hero-live-signal-text');
    const signalsWrap = document.getElementById('hero-live-signals');
    const todaySmoked = document.getElementById('today-smoked');
    const todayWait = document.getElementById('today-wait');
    const todayMusic = document.getElementById('today-music');
    if (!signalText) return;

    const signalData = {
      smoked_today: ['Brisket', 'Ribs', 'Wings'],
      pickup_wait_min: 14,
      now_playing: 'Soul Pit Sessions · 7:30 PM',
      orders_last_hour: 128
    };
    const liveSignals = [
      `🔥 Smoked today: ${signalData.smoked_today.join(', ')}`,
      `⏱️ Average pickup wait at Milton: ${signalData.pickup_wait_min} min`,
      `🎵 Now playing tonight: ${signalData.now_playing}`,
      `📦 ${signalData.orders_last_hour} orders fired in the last hour`
    ];
    let signalIndex = 0;
    let intervalId = null;

    const rotateLiveSignals = () => {
      signalIndex = (signalIndex + 1) % liveSignals.length;
      signalText.textContent = liveSignals[signalIndex];
    };
    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(rotateLiveSignals, 4500);
    };

    start();
    if (signalsWrap) {
      ['mouseenter', 'focusin'].forEach(ev => signalsWrap.addEventListener(ev, stop));
      ['mouseleave', 'focusout'].forEach(ev => signalsWrap.addEventListener(ev, start));
    }

    if (todaySmoked) todaySmoked.textContent = signalData.smoked_today.join(' · ');
    if (todayWait) todayWait.textContent = String(signalData.pickup_wait_min);
    if (todayMusic) todayMusic.textContent = signalData.now_playing;
  }

  function initSmartBundles() {
    const partySize = document.getElementById('bundle-party-size');
    const mood = document.getElementById('bundle-mood');
    const result = document.getElementById('bundle-reco-result');
    const bundleCards = document.querySelectorAll('.menu-bundle[data-bundle-name]');
    if (!partySize || !mood || !result || !bundleCards.length) return;

    const pickBundle = () => {
      const partyValue = partySize.value;
      const moodValue = mood.value;
      const firstMatch = [...bundleCards].find(card => {
        const parties = (card.dataset.party || '').split(',').map(v => v.trim());
        const moods = (card.dataset.moods || '').split(',').map(v => v.trim());
        return parties.includes(partyValue) && moods.includes(moodValue);
      }) || bundleCards[0];

      bundleCards.forEach(card => card.classList.toggle('is-recommended', card === firstMatch));
      const label = firstMatch.dataset.bundleName || 'The First Timer';
      result.textContent = `Recommended: ${label} (best for ${partyValue} guests + ${moodValue} mood)`;
    };

    partySize.addEventListener('change', pickBundle);
    mood.addEventListener('change', pickBundle);
    pickBundle();
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
  // SMOKE SCROLL LINE — handled by animations.js with smooth lerp
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // MENU TABS — Sticky + Scroll Spy + Category Filtering
  // ═══════════════════════════════════════════
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');
  const menuTabsWrap = document.getElementById('menu-tabs-sticky');

  // Sticky tabs on scroll
  // Sticky tabs on scroll (rootMargin offsets by nav bar height ~70px + 1px)
  if (menuTabsWrap) {
    const stickyObserver = new IntersectionObserver(([e]) => {
      menuTabsWrap.classList.toggle('is-stuck', e.intersectionRatio < 1);
    }, { threshold: [1], rootMargin: '-71px 0px 0px 0px' });
    stickyObserver.observe(menuTabsWrap);
  }

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
  // LOCATION PICKER
  // ═══════════════════════════════════════════
  const locationBtns = document.querySelectorAll('.menu-location-btn');
  locationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      locationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      orderState.location = btn.dataset.location || 'milton';
      localStorage.setItem('cue_location_pref_v1', orderState.location);
      persistOrderState();
      updateMobileBar();
    });
  });

  function initNearestLocation() {
    const storageKey = 'cue_location_pref_v1';
    const existingLocation = localStorage.getItem(storageKey);
    const fallbackLocation = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').includes('Atlanta')
      ? 'milton'
      : 'peachtree';
    const location = existingLocation || fallbackLocation;
    const matchingBtn = document.querySelector(`.menu-location-btn[data-location="${location}"]`);
    if (matchingBtn) matchingBtn.click();
    if (!existingLocation) localStorage.setItem(storageKey, location);
  }

  // ═══════════════════════════════════════════
  // ADD TO ORDER — Item-Level CTA + Mobile Bar
  // ═══════════════════════════════════════════
  const mobileBar = document.getElementById('menu-mobile-bar');
  const mobileCartCount = document.getElementById('mobile-cart-count');
  const mobileCartText = document.getElementById('mobile-cart-text');
  const mobileOrderEta = document.getElementById('mobile-order-eta');

  function persistOrderState() {
    localStorage.setItem('cue_order_state_v1', JSON.stringify(orderState));
  }

  function hydrateOrderState() {
    const raw = localStorage.getItem('cue_order_state_v1');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      orderState.cartCount = Number(parsed.cartCount) || 0;
      orderState.cartSubtotal = Number(parsed.cartSubtotal) || 0;
      orderState.etaFloor = Number(parsed.etaFloor) || 20;
      orderState.location = parsed.location || 'milton';
    } catch (_) {
      // Ignore corrupted local state and fallback to defaults.
    }
  }

  function updateMobileBar() {
    if (!mobileBar) return;
    if (orderState.cartCount > 0) {
      mobileBar.classList.add('is-visible');
    } else {
      mobileBar.classList.remove('is-visible');
    }
    if (mobileCartCount) mobileCartCount.textContent = orderState.cartCount;
    if (mobileCartText) {
      mobileCartText.textContent = orderState.cartCount > 0
        ? `${orderState.cartCount} item${orderState.cartCount > 1 ? 's' : ''} in cart · $${orderState.cartSubtotal}`
        : 'Ready to order';
    }
    if (mobileOrderEta) {
      orderState.etaFloor = Math.max(15, 27 - Math.min(orderState.cartCount, 8));
      mobileOrderEta.textContent = `ETA ${orderState.etaFloor}-${orderState.etaFloor + 10} min · ${orderState.location}`;
    }
  }

  // Item-level add buttons
  document.querySelectorAll('.menu-item__add, .menu-pick-card__add, .menu-bundle__order').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      orderState.cartCount++;
      orderState.cartSubtotal += 14;
      persistOrderState();
      updateMobileBar();

      // Visual feedback
      const original = btn.textContent;
      btn.textContent = '✓ Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('added');
      }, 1200);
    });
  });

  initLiveSignals();
  initSmartBundles();
  hydrateOrderState();
  initNearestLocation();
  updateMobileBar();

  // Pick card click → also acts as add
  document.querySelectorAll('.menu-pick-card').forEach(card => {
    card.addEventListener('click', () => {
      const addBtn = card.querySelector('.menu-pick-card__add');
      if (addBtn) addBtn.click();
    });
  });

  // Upsell item toggle
  document.querySelectorAll('.fe-upsell__item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
    });
  });

  // ═══════════════════════════════════════════
  // THE FLAVOR ENGINE — Guided Experience
  // ═══════════════════════════════════════════
  const feSection = document.querySelector('.flavor-engine');
  if (feSection) {
    const feSteps = feSection.querySelectorAll('.fe-step');
    const feStepLines = feSection.querySelectorAll('.fe-step__line');
    const fePanels = feSection.querySelectorAll('.fe-panel');
    const flavorTags = feSection.querySelectorAll('.flavor-tag');
    const radarShape = feSection.querySelector('.fe-radar__shape');
    const nextBtn = feSection.querySelector('.fe-next-btn');
    const restartBtn = feSection.querySelector('.fe-restart-btn');
    const resultsGrid = feSection.querySelector('.fe-results-grid');
    const pitmasterQuote = feSection.querySelector('.fe-pitmaster__quote');

    let feMood = '';
    let activeFilters = new Set();
    let feCurrentStep = 1;

    // Flavor data with mood biases and pairing suggestions
    const flavorData = [
      { name: 'Smoked Jumbo Wings', icon: '🍗', desc: 'Brined, smoked, and fried crispy', flavors: ['smoky', 'crispy', 'savory'], moods: ['bold', 'adventurous'], pairing: 'Bacon Baked Beans', pick: false },
      { name: 'BBQ Nachos', icon: '🧀', desc: 'Pulled pork, cheese, jalapeños, house sauce', flavors: ['smoky', 'rich', 'spicy'], moods: ['bold', 'adventurous', 'comfort'], pairing: 'Sweet Tea', pick: true },
      { name: 'Brisket Platter', icon: '🥩', desc: 'Slow-smoked 14-hour brisket, hand-sliced', flavors: ['smoky', 'rich', 'savory'], moods: ['comfort', 'bold'], pairing: 'Macaroni Slammer', pick: true },
      { name: 'St. Louis Ribs', icon: '🍖', desc: 'Full rack with our signature glaze', flavors: ['smoky', 'sweet', 'rich'], moods: ['comfort', 'bold'], pairing: 'Collard Greens', pick: true },
      { name: 'Macaroni Slammer', icon: '🧈', desc: 'Five-cheese baked mac & cheese', flavors: ['rich', 'creamy', 'savory'], moods: ['comfort', 'light'], pairing: 'Brisket Platter', pick: false },
      { name: 'Bacon Baked Beans', icon: '🫘', desc: 'Slow-cooked with smoked bacon and molasses', flavors: ['smoky', 'sweet', 'savory'], moods: ['comfort'], pairing: 'St. Louis Ribs', pick: false },
      { name: 'Grilled Pineapple', icon: '🍍', desc: 'Caramelized with cinnamon butter', flavors: ['sweet', 'tangy', 'crispy'], moods: ['light', 'adventurous'], pairing: 'Hot Links', pick: false },
      { name: 'Banana Pudding', icon: '🍌', desc: 'Scratch-made Southern classic', flavors: ['sweet', 'creamy'], moods: ['comfort', 'light'], pairing: 'Sweet Tea', pick: false },
      { name: 'Hot Links', icon: '🌶️', desc: 'House-smoked sausage with kick', flavors: ['smoky', 'spicy', 'savory'], moods: ['bold', 'adventurous'], pairing: 'Coleslaw', pick: false },
      { name: 'Pulled Pork Sandwich', icon: '🥪', desc: 'Hand-pulled, house sauce, pickles', flavors: ['smoky', 'tangy', 'savory'], moods: ['comfort', 'light'], pairing: 'Hand-Cut Fries', pick: false },
      { name: 'Fried Okra', icon: '🫒', desc: 'Cornmeal-crusted, served with ranch', flavors: ['crispy', 'savory'], moods: ['light', 'comfort'], pairing: 'Pulled Pork Sandwich', pick: false },
      { name: 'Collard Greens', icon: '🥬', desc: 'Slow-braised with smoked ham hocks', flavors: ['smoky', 'savory', 'rich'], moods: ['comfort', 'bold'], pairing: 'Brisket Platter', pick: false },
      { name: 'Pitmaster Combo', icon: '🔥', desc: 'Choose any three meats with two sides', flavors: ['smoky', 'rich', 'savory', 'spicy'], moods: ['bold', 'adventurous'], pairing: 'Banana Pudding', pick: true },
      { name: 'Pimento Cheese Dip', icon: '🧀', desc: 'House-made with cracklin chips and pickled veg', flavors: ['creamy', 'tangy', 'savory'], moods: ['light', 'comfort'], pairing: 'Fried Pickles', pick: false },
      { name: 'Fried Pickles', icon: '🥒', desc: 'Hand-breaded dill pickle chips with ranch', flavors: ['crispy', 'tangy'], moods: ['light', 'adventurous'], pairing: 'BBQ Nachos', pick: false },
    ];

    // Pitmaster quotes by mood
    const pitmasterQuotes = {
      comfort: [
        'You came for comfort and that is exactly what we do best. This plate is a warm hug from the smokehouse.',
        'Low and slow is not just how we cook — it is how we want you to feel tonight. Take your time with this one.'
      ],
      bold: [
        'You want flavor that hits? These picks have smoke, heat, and soul. The kind of meal you brag about.',
        'Bold choice. This is the plate people remember a week later. Every bite earns its place.'
      ],
      light: [
        'Light does not mean boring — not at Cue. These picks are clean, bright, and built to surprise.',
        'Sometimes the best meal is the one that does not weigh you down. Smart picks, all of them.'
      ],
      adventurous: [
        'You said surprise me, and the pitmaster does not bluff. This plate is a ride — trust the smoke.',
        'The adventurous eater gets rewarded here. These are the dishes our regulars come back for.'
      ]
    };

    // Radar axis mapping (6 axes for the hexagonal radar)
    const radarAxes = ['smoky', 'sweet', 'spicy', 'crispy', 'rich', 'tangy'];
    const radarCenter = { x: 150, y: 150 };
    const radarRadius = 100;

    function getRadarPoint(axisIndex, value) {
      const angle = (Math.PI * 2 / 6) * axisIndex - Math.PI / 2;
      const r = radarRadius * value;
      return {
        x: radarCenter.x + r * Math.cos(angle),
        y: radarCenter.y + r * Math.sin(angle)
      };
    }

    function updateRadar() {
      if (!radarShape) return;
      const points = radarAxes.map((axis, i) => {
        const val = activeFilters.has(axis) ? 1 : 0.08;
        return getRadarPoint(i, val);
      });
      radarShape.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
    }

    // Step navigation
    function goToStep(step) {
      feCurrentStep = step;

      feSteps.forEach((s, i) => {
        const stepNum = i + 1;
        s.classList.remove('active', 'completed');
        if (stepNum === step) s.classList.add('active');
        else if (stepNum < step) s.classList.add('completed');
      });

      feStepLines.forEach((line, i) => {
        line.classList.toggle('completed', i + 1 < step);
      });

      fePanels.forEach(p => {
        p.classList.toggle('active', parseInt(p.dataset.feStep, 10) === step);
      });
    }

    // STEP 1: Mood selection
    feSection.querySelectorAll('.fe-mood-card').forEach(card => {
      card.addEventListener('click', () => {
        feMood = card.dataset.mood;
        feSection.querySelectorAll('.fe-mood-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Auto-advance to step 2 after brief pause
        setTimeout(() => goToStep(2), 400);
      });
    });

    // STEP 2: Flavor tag selection
    flavorTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const flavor = tag.dataset.flavor;
        tag.classList.toggle('active');

        if (activeFilters.has(flavor)) {
          activeFilters.delete(flavor);
        } else {
          activeFilters.add(flavor);
        }

        updateRadar();
        if (nextBtn) nextBtn.disabled = activeFilters.size === 0;
      });
    });

    // Next button → Step 3
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (activeFilters.size === 0) return;
        goToStep(3);
        renderResults();
      });
    }

    // Restart
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        feMood = '';
        activeFilters.clear();
        flavorTags.forEach(t => t.classList.remove('active'));
        feSection.querySelectorAll('.fe-mood-card').forEach(c => c.classList.remove('selected'));
        if (nextBtn) nextBtn.disabled = true;
        updateRadar();
        goToStep(1);
      });
    }

    // Compute match score
    function getMatchScore(item) {
      const filterArr = [...activeFilters];
      const flavorMatch = filterArr.filter(f => item.flavors.includes(f)).length;
      const moodBonus = feMood && item.moods.includes(feMood) ? 1 : 0;
      const total = flavorMatch + moodBonus;
      const maxPossible = filterArr.length + 1;
      return { score: total, percent: Math.round((total / maxPossible) * 100) };
    }

    // Upsell pairing data by mood
    const upsellPairings = {
      comfort: { side: 'Macaroni Slammer', sidePrice: '+$6', sideEmoji: '🧈', drink: 'Sweet Tea', drinkPrice: '+$3', drinkEmoji: '🧊', dessert: 'Banana Pudding', dessertPrice: '+$7', dessertEmoji: '🍌' },
      bold: { side: 'Bacon Baked Beans', sidePrice: '+$5', sideEmoji: '🫘', drink: 'Local Craft Draft', drinkPrice: '+$7', drinkEmoji: '🍺', dessert: 'Bananas Doster', dessertPrice: '+$9', dessertEmoji: '🍨' },
      light: { side: 'Grilled Pineapple', sidePrice: '+$5', sideEmoji: '🍍', drink: 'House Wine', drinkPrice: '+$9', drinkEmoji: '🍷', dessert: 'Seasonal Cobbler', dessertPrice: '+$8', dessertEmoji: '🥧' },
      adventurous: { side: 'Collard Greens', sidePrice: '+$5', sideEmoji: '🥬', drink: 'Local Craft Draft', drinkPrice: '+$7', drinkEmoji: '🍺', dessert: 'Bananas Doster', dessertPrice: '+$9', dessertEmoji: '🍨' }
    };

    // Render results
    function renderResults() {
      if (!resultsGrid) return;

      const scored = flavorData.map(item => ({
        ...item,
        ...getMatchScore(item)
      })).filter(item => item.score > 0).sort((a, b) => b.score - a.score);

      const topResults = scored.slice(0, 6);
      const bestScore = topResults.length > 0 ? topResults[0].score : 0;

      // Set pitmaster quote
      if (pitmasterQuote) {
        const quotes = pitmasterQuotes[feMood] || pitmasterQuotes['comfort'];
        pitmasterQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
      }

      // Circumference for smoke ring (circle radius=16, C=2πr≈100.5)
      const circumference = 100.5;

      resultsGrid.innerHTML = topResults.map((item, i) => {
        const isPick = item.pick && item.score === bestScore;
        const dashOffset = circumference - (circumference * item.percent / 100);
        const filterArr = [...activeFilters];

        return `
          <div class="fe-result-card${isPick ? ' fe-result-card--pick' : ''}">
            ${isPick ? '<span class="fe-pick-badge">🔥 Pitmaster\'s Pick</span>' : ''}
            <div class="fe-result-card__top">
              <span class="fe-result-card__icon">${item.icon}</span>
              <div>
                <div class="fe-result-card__name">${item.name}</div>
                <div class="fe-result-card__desc">${item.desc}</div>
              </div>
              <div class="fe-smoke-ring">
                <svg viewBox="0 0 36 36">
                  <circle class="fe-smoke-ring__bg" cx="18" cy="18" r="16" />
                  <circle class="fe-smoke-ring__fill" cx="18" cy="18" r="16"
                    style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${dashOffset};" />
                </svg>
                <span class="fe-smoke-ring__text">${item.percent}%</span>
              </div>
            </div>
            <div class="fe-flavor-dots">
              ${item.flavors.map(f =>
                `<span class="fe-flavor-dot ${filterArr.includes(f) ? 'fe-flavor-dot--match' : 'fe-flavor-dot--extra'}">${f}</span>`
              ).join('')}
            </div>
            <div class="fe-pairing">
              <span class="fe-pairing__label">Perfect with:</span> ${item.pairing}
            </div>
          </div>
        `;
      }).join('');

      // Update upsell section based on mood
      const pairing = upsellPairings[feMood] || upsellPairings['comfort'];
      const upsellSide = document.getElementById('fe-upsell-side');
      const upsellDrink = document.getElementById('fe-upsell-drink');
      const upsellDessert = document.getElementById('fe-upsell-dessert');
      const upsellSidePrice = document.getElementById('fe-upsell-side-price');
      const upsellDrinkPrice = document.getElementById('fe-upsell-drink-price');
      const upsellDessertPrice = document.getElementById('fe-upsell-dessert-price');
      const upsellItems = feSection.querySelectorAll('.fe-upsell__item');
      const upsellEmojis = feSection.querySelectorAll('.fe-upsell__emoji');

      if (upsellSide) upsellSide.textContent = pairing.side;
      if (upsellDrink) upsellDrink.textContent = pairing.drink;
      if (upsellDessert) upsellDessert.textContent = pairing.dessert;
      if (upsellSidePrice) upsellSidePrice.textContent = pairing.sidePrice;
      if (upsellDrinkPrice) upsellDrinkPrice.textContent = pairing.drinkPrice;
      if (upsellDessertPrice) upsellDessertPrice.textContent = pairing.dessertPrice;
      if (upsellEmojis.length >= 3) {
        upsellEmojis[0].textContent = pairing.sideEmoji;
        upsellEmojis[1].textContent = pairing.drinkEmoji;
        upsellEmojis[2].textContent = pairing.dessertEmoji;
      }
      // Reset selected state
      upsellItems.forEach(item => item.classList.remove('selected'));
    }

    // Initialize
    updateRadar();
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
  // SMOOTH SCROLL — handled by animations.js with enhanced momentum
  // ═══════════════════════════════════════════

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
  // COUNTER ANIMATION — handled by animations.js with spring physics
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // PARALLAX EFFECTS — handled by animations.js with smooth depth system
  // ═══════════════════════════════════════════

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

  // ═══════════════════════════════════════════
  // DYNAMIC HOURS — Real-Time Open/Closed Status
  // ═══════════════════════════════════════════
  function updateLocationHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0=Sun, 6=Sat
    
    // Cue hours: Mon-Sun 11AM-9PM
    const openHour = 11;
    const closeHour = 21; // 9 PM
    const isOpen = hour >= openHour && hour < closeHour;
    
    document.querySelectorAll('.location-card__hours').forEach(el => {
      const dot = el.querySelector('.location-card__hours-dot');
      if (isOpen) {
        el.innerHTML = '';
        const dotEl = document.createElement('span');
        dotEl.className = 'location-card__hours-dot location-card__hours-dot--open';
        el.appendChild(dotEl);
        el.appendChild(document.createTextNode(' Open Now · Closes 9 PM'));
      } else {
        el.innerHTML = '';
        const dotEl = document.createElement('span');
        dotEl.className = 'location-card__hours-dot location-card__hours-dot--closed';
        el.appendChild(dotEl);
        el.appendChild(document.createTextNode(' Closed · Opens 11 AM'));
      }
    });
    
    // Also update location-mini hours in the map section
    document.querySelectorAll('.location-mini').forEach(el => {
      const hoursP = el.querySelector('p[style*="accent-primary"]');
      if (hoursP) {
        const statusText = isOpen ? '✓ Open Now' : 'Closed · Opens 11 AM';
        const originalText = hoursP.textContent;
        // Keep the schedule but prepend status
        if (originalText.includes('Live Music')) {
          hoursP.innerHTML = `${statusText} · Mon–Sun 11AM–9PM · <span style="color:var(--cue-ember)">Live Music Fri &amp; Sat</span>`;
        } else {
          hoursP.textContent = `${statusText} · Mon–Sun 11AM–9PM`;
        }
      }
    });
  }
  
  updateLocationHours();
  // Refresh every minute
  setInterval(updateLocationHours, 60000);

  // ═══════════════════════════════════════════
  // DYNAMIC LIVE MUSIC — Day-Aware Logic
  // ═══════════════════════════════════════════
  function updateLiveMusic() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    const hour = now.getHours();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Live music schedule: Friday & Saturday 7 PM - 10 PM
    const isMusicDay = (day === 5 || day === 6); // Fri or Sat
    const isMusicLive = isMusicDay && hour >= 19 && hour < 22;
    const isMusicTonight = isMusicDay && hour < 22;
    
    // Find next music day
    let nextMusicDay, daysUntilMusic;
    if (day === 5 && hour < 22) {
      nextMusicDay = 'Tonight';
      daysUntilMusic = 0;
    } else if (day === 5 && hour >= 22) {
      nextMusicDay = 'Tomorrow';
      daysUntilMusic = 1;
    } else if (day === 6 && hour < 22) {
      nextMusicDay = 'Tonight';
      daysUntilMusic = 0;
    } else {
      // Calculate days until next Friday
      daysUntilMusic = (5 - day + 7) % 7;
      if (daysUntilMusic === 0) daysUntilMusic = 7;
      nextMusicDay = 'This Friday';
    }
    
    // Update "Live Tonight" badges on location cards
    document.querySelectorAll('.location-card__live-badge').forEach(badge => {
      if (isMusicTonight) {
        badge.style.display = '';
        badge.textContent = isMusicLive ? '🎸 Live Now!' : '🎸 Live Tonight';
      } else {
        badge.textContent = `🎸 Live ${nextMusicDay}`;
        badge.style.display = '';
      }
    });
    
    // Update featured artist section badge
    const tonightBadge = document.querySelector('.music-tonight-badge');
    if (tonightBadge) {
      if (isMusicLive) {
        tonightBadge.textContent = '🔴 Live Now!';
        tonightBadge.classList.add('music-tonight-badge--live');
      } else if (isMusicTonight) {
        tonightBadge.textContent = '🔴 Live Tonight';
        tonightBadge.classList.remove('music-tonight-badge--live');
      } else {
        tonightBadge.textContent = `🎸 ${nextMusicDay}`;
        tonightBadge.classList.remove('music-tonight-badge--live');
      }
    }
    
    // Update the "Tonight at Cue Milton" eyebrow text
    const musicEyebrow = document.querySelector('.music-featured__info .section-header__eyebrow');
    if (musicEyebrow) {
      if (isMusicTonight) {
        musicEyebrow.textContent = 'Tonight at Cue Milton';
      } else {
        musicEyebrow.textContent = `${nextMusicDay} at Cue Milton`;
      }
    }
    
    // Update the "Friday · 7:00 PM – 10:00 PM" line
    const musicTime = document.querySelector('.music-featured__info p[style*="accent-primary"]');
    if (musicTime) {
      if (isMusicTonight && day === 5) {
        musicTime.textContent = 'Friday · 7:00 PM – 10:00 PM';
      } else if (isMusicTonight && day === 6) {
        musicTime.textContent = 'Saturday · 7:00 PM – 10:00 PM';
      } else {
        // Show the next scheduled performance
        musicTime.textContent = `${nextMusicDay} · Friday · 7:00 PM – 10:00 PM`;
      }
    }
  }
  
  updateLiveMusic();
  setInterval(updateLiveMusic, 60000);

  // ═══════════════════════════════════════════
  // DIETARY FILTER SYSTEM — Menu Intelligence
  // ═══════════════════════════════════════════
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const clearFilterBtn = document.querySelector('.menu-filter-btn--clear');
  const allMenuItems = document.querySelectorAll('.menu-item');
  let activeMenuFilters = new Set();

  function applyDietaryFilters() {
    if (activeMenuFilters.size === 0) {
      allMenuItems.forEach(item => item.classList.remove('filtered-out'));
      if (clearFilterBtn) clearFilterBtn.style.display = 'none';
      return;
    }

    if (clearFilterBtn) clearFilterBtn.style.display = '';

    allMenuItems.forEach(item => {
      const itemDietary = (item.dataset.dietary || '').split(' ').filter(Boolean);
      const hasMatch = [...activeMenuFilters].some(f => itemDietary.includes(f));
      item.classList.toggle('filtered-out', !hasMatch);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      if (filter === 'clear') {
        activeMenuFilters.clear();
        filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
        applyDietaryFilters();
        return;
      }

      const isActive = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', isActive ? 'false' : 'true');

      if (isActive) {
        activeMenuFilters.delete(filter);
      } else {
        activeMenuFilters.add(filter);
      }

      applyDietaryFilters();
    });
  });

  // ═══════════════════════════════════════════
  // RESUME ORDER PILL — Persistent Conversion Widget
  // ═══════════════════════════════════════════
  function initResumePill() {
    const pill = document.getElementById('resume-pill');
    const pillCount = document.getElementById('resume-pill-count');
    const pillMeta = document.getElementById('resume-pill-meta');
    const closeBtn = pill ? pill.querySelector('.resume-pill__close') : null;
    let dismissed = false;

    function updatePill() {
      if (!pill || dismissed) return;
      if (orderState.cartCount > 0) {
        pill.classList.add('is-visible');
        if (pillCount) {
          pillCount.textContent = `${orderState.cartCount} item${orderState.cartCount > 1 ? 's' : ''} · $${orderState.cartSubtotal}`;
        }
        if (pillMeta) {
          const etaMin = orderState.etaFloor;
          const loc = orderState.location.charAt(0).toUpperCase() + orderState.location.slice(1);
          pillMeta.textContent = `ETA ~${etaMin} min · ${loc}`;
        }
      } else {
        pill.classList.remove('is-visible');
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dismissed = true;
        pill.classList.remove('is-visible');
      });
    }

    // Expose updater so add-to-cart can call it
    window._cueUpdateResumePill = updatePill;
    updatePill();
  }

  // ═══════════════════════════════════════════
  // DAYPART-AWARE HERO — Dynamic Greeting
  // ═══════════════════════════════════════════
  function initDaypartHero() {
    const eyebrow = document.getElementById('hero-daypart-eyebrow');
    const heroSection = document.getElementById('hero');
    if (!eyebrow) return;

    const hour = new Date().getHours();
    let greeting, mood;

    if (hour >= 6 && hour < 11) {
      greeting = 'Good Morning — Start Your Day with Smoke & Soul';
      mood = 'morning';
    } else if (hour >= 11 && hour < 14) {
      greeting = 'Lunch Rush — Fresh Off the Pit Right Now';
      mood = 'lunch';
    } else if (hour >= 14 && hour < 17) {
      greeting = 'Afternoon Smoke — The Pit Never Stops';
      mood = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Dinner Time — Live Music & Smoked Perfection Await';
      mood = 'evening';
    } else {
      greeting = 'Late Night Cravings — Tomorrow\'s Smoke Starts Before Dawn';
      mood = 'night';
    }

    eyebrow.textContent = greeting;
    if (heroSection) heroSection.setAttribute('data-daypart', mood);
  }

  // ═══════════════════════════════════════════
  // HERO LOCATION PERSONALIZATION
  // ═══════════════════════════════════════════
  function initHeroLocation() {
    const locationText = document.getElementById('hero-location-text');
    if (!locationText) return;

    const loc = orderState.location;
    const locationNames = { milton: 'Milton', cumming: 'Cumming', peachtree: 'Peachtree Corners' };
    const name = locationNames[loc] || 'Milton';
    const eta = orderState.etaFloor || 14;
    locationText.textContent = `You're closest to ${name} — pickup in ~${eta} min`;
  }

  // ═══════════════════════════════════════════
  // 1-CLICK REORDER — Returning User Chip
  // ═══════════════════════════════════════════
  function initReorderChip() {
    const reorderEl = document.getElementById('hero-reorder');
    const reorderBtn = document.getElementById('hero-reorder-btn');
    if (!reorderEl || !reorderBtn) return;

    const lastOrder = localStorage.getItem('cue_last_order_v1');
    if (!lastOrder) return;

    try {
      const order = JSON.parse(lastOrder);
      if (order.items > 0) {
        reorderEl.style.display = 'flex';
        reorderBtn.addEventListener('click', () => {
          orderState.cartCount = order.items;
          orderState.cartSubtotal = order.subtotal || order.items * 14;
          persistOrderState();
          updateMobileBar();
          if (window._cueUpdateResumePill) window._cueUpdateResumePill();

          reorderBtn.textContent = '✓ Added to Cart!';
          setTimeout(() => { reorderBtn.textContent = '1-Tap Reorder →'; }, 2000);
        });
      }
    } catch (_) {
      // Ignore corrupted data
    }
  }

  // ═══════════════════════════════════════════
  // REVIEW CAROUSEL — Rotating Testimonials
  // ═══════════════════════════════════════════
  function initReviewCarousel() {
    const track = document.getElementById('review-carousel-track');
    const dotsContainer = document.getElementById('review-carousel-dots');
    if (!track || !dotsContainer) return;

    const reviews = [
      { quote: '"The brisket changed my entire understanding of barbecue. Unbelievable."', author: 'Marcus T. · Milton · Google' },
      { quote: '"Our rehearsal dinner in the Hickory Room was absolute perfection — 10/10."', author: 'Jennifer & Kyle R. · Cumming · Yelp' },
      { quote: '"Friday night live music with ribs and a local craft beer? Best weekend spot."', author: 'David L. · Peachtree Corners · TripAdvisor' },
      { quote: '"The mac and cheese slammer is legendary. My kids refuse to eat it anywhere else."', author: 'Sarah K. · Milton · Google' },
      { quote: '"We drove 45 minutes just for the smoked wings. Worth every mile."', author: 'Andre C. · Cumming · Google' },
      { quote: '"Best catering we\'ve ever had for a corporate event. Everyone was raving."', author: 'Lisa M. · Peachtree Corners · Yelp' }
    ];

    let currentSlide = 0;

    reviews.forEach((r, i) => {
      const slide = document.createElement('div');
      slide.className = 'review-carousel__slide';
      slide.innerHTML = `
        <p class="review-carousel__quote">${r.quote}</p>
        <p class="review-carousel__author">${r.author}</p>
      `;
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.className = 'review-carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Review ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dotsContainer.querySelectorAll('.review-carousel__dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === currentSlide);
      });
    }

    setInterval(() => {
      goToSlide((currentSlide + 1) % reviews.length);
    }, 6000);
  }

  // ═══════════════════════════════════════════
  // DAILY SPECIALS — Time-Based Dynamic Content
  // ═══════════════════════════════════════════
  function initDailySpecials() {
    const specialName = document.getElementById('today-special');
    const specialDesc = document.getElementById('today-special-desc');
    const soldOutFill = document.getElementById('sold-out-fill');
    const soldOutLabel = document.getElementById('sold-out-label');
    if (!specialName) return;

    const day = new Date().getDay();
    const specials = [
      { name: 'Smoked Brisket Burnt Ends', desc: 'Limited batch — crispy, caramelized, incredible.', claimed: 72 },
      { name: 'Hickory-Smoked Turkey Breast', desc: 'Sliced fresh this morning. Light & smoky.', claimed: 45 },
      { name: 'Texas-Style Sausage Links', desc: 'House-made with jalapeño & cheddar.', claimed: 58 },
      { name: 'Pulled Pork Loaded Fries', desc: 'Topped with cheese sauce, slaw, and pickles.', claimed: 67 },
      { name: 'Pitmaster\'s Choice Sampler', desc: 'Three meats, three sides, one legendary plate.', claimed: 81 },
      { name: 'Smoked Wagyu Beef Ribs', desc: 'Premium cut, 12-hour smoke. Only 15 servings.', claimed: 88 },
      { name: 'Baby Back Ribs & Corn Bread', desc: 'Fall-off-the-bone perfection with honey butter cornbread.', claimed: 55 }
    ];

    const todaySpecial = specials[day];
    specialName.textContent = todaySpecial.name;
    if (specialDesc) specialDesc.textContent = todaySpecial.desc;
    if (soldOutFill) soldOutFill.style.width = todaySpecial.claimed + '%';
    if (soldOutLabel) soldOutLabel.textContent = todaySpecial.claimed + '% claimed';
  }

  // ═══════════════════════════════════════════
  // WEATHER-AWARE SUGGESTIONS
  // ═══════════════════════════════════════════
  function initWeatherSuggestions() {
    const suggestionEl = document.getElementById('weather-suggestion');
    const descEl = document.getElementById('weather-desc');
    if (!suggestionEl || !descEl) return;

    const month = new Date().getMonth();
    const hour = new Date().getHours();

    let suggestion, desc;
    if (month >= 5 && month <= 8) {
      suggestion = 'Hot & sunny out there ☀️';
      desc = 'Cool off with our Sweet Tea and smoked wings on the patio.';
    } else if (month >= 11 || month <= 1) {
      suggestion = 'Cold day comfort 🌧️';
      desc = 'Warm up with our Brunswick Stew and a brisket platter.';
    } else if (month >= 2 && month <= 4) {
      suggestion = 'Perfect patio weather 🌤️';
      desc = 'Great day for outdoor dining — try the ribs with a local craft draft.';
    } else {
      suggestion = 'Crisp fall vibes 🍂';
      desc = 'Seasonal cobbler is back — pair it with our smoked chicken.';
    }

    if (hour >= 17) {
      desc += ' Plus live music tonight!';
    }

    suggestionEl.textContent = suggestion;
    descEl.textContent = desc;
  }

  // ═══════════════════════════════════════════
  // PIT DROP COUNTDOWN TIMER
  // ═══════════════════════════════════════════
  function initPitDropCountdown() {
    const hoursEl = document.getElementById('pit-drop-hours');
    const minsEl = document.getElementById('pit-drop-mins');
    const secsEl = document.getElementById('pit-drop-secs');
    const notifyBtn = document.getElementById('pit-drop-notify');
    const waitlistEl = document.getElementById('pit-drop-waitlist');
    if (!hoursEl || !minsEl || !secsEl) return;

    // Calculate next drop at 5 PM today or tomorrow
    const now = new Date();
    const dropTime = new Date(now);
    dropTime.setHours(17, 0, 0, 0);
    if (now >= dropTime) {
      dropTime.setDate(dropTime.getDate() + 1);
    }

    function updateCountdown() {
      const diff = dropTime - new Date();
      if (diff <= 0) {
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      const newH = String(h).padStart(2, '0');
      const newM = String(m).padStart(2, '0');
      const newS = String(s).padStart(2, '0');

      if (secsEl.textContent !== newS) {
        secsEl.classList.add('is-flipping');
        setTimeout(() => secsEl.classList.remove('is-flipping'), 300);
      }

      hoursEl.textContent = newH;
      minsEl.textContent = newM;
      secsEl.textContent = newS;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    if (notifyBtn) {
      notifyBtn.addEventListener('click', () => {
        notifyBtn.textContent = '✓ You\'re on the list!';
        notifyBtn.disabled = true;
        if (waitlistEl) {
          const currentCount = parseInt(waitlistEl.textContent) || 47;
          waitlistEl.textContent = `${currentCount + 1} on the waitlist`;
        }
        localStorage.setItem('cue_pit_drop_notify', 'true');
      });

      if (localStorage.getItem('cue_pit_drop_notify') === 'true') {
        notifyBtn.textContent = '✓ You\'re on the list!';
        notifyBtn.disabled = true;
      }
    }
  }

  // ═══════════════════════════════════════════
  // ORDER STATE HOOKS — Event-Driven Extensions
  // ═══════════════════════════════════════════
  // Listen for cart changes to save last order and update resume pill
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-item__add, .menu-pick-card__add, .menu-bundle__order');
    if (!btn) return;

    // After the existing click handler runs, save last order and update pill
    requestAnimationFrame(() => {
      if (orderState.cartCount > 0) {
        localStorage.setItem('cue_last_order_v1', JSON.stringify({
          items: orderState.cartCount,
          subtotal: orderState.cartSubtotal,
          location: orderState.location,
          timestamp: Date.now()
        }));
      }
      if (window._cueUpdateResumePill) window._cueUpdateResumePill();
    });
  });

  // ═══════════════════════════════════════════
  // INITIALIZE ALL NEW FEATURES
  // ═══════════════════════════════════════════
  initResumePill();
  initDaypartHero();
  initHeroLocation();
  initReorderChip();
  initReviewCarousel();
  initDailySpecials();
  initWeatherSuggestions();
  initPitDropCountdown();

});
