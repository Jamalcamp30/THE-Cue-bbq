/* ============================================
   CUE BARBECUE — The Hickory Room Experience Builder
   Premium Interactive Private Event Experience
   ============================================ */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════
    const lerp = (a, b, t) => a + (b - a) * t;
    const isMobile = () => window.innerWidth <= 768;

    // ═══════════════════════════════════════════
    // 1. SMOKE REVEAL EFFECT
    // ═══════════════════════════════════════════
    const smokeCanvas = document.getElementById('hickory-smoke-canvas');
    if (smokeCanvas) {
      const ctx = smokeCanvas.getContext('2d');
      let smokeParticles = [];
      let smokeRevealed = false;
      let smokeAnimFrame;

      function resizeSmokeCanvas() {
        const rect = smokeCanvas.parentElement.getBoundingClientRect();
        smokeCanvas.width = rect.width;
        smokeCanvas.height = rect.height;
      }
      resizeSmokeCanvas();
      window.addEventListener('resize', resizeSmokeCanvas);

      class SmokeParticle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 60 + 30;
          this.speedX = (Math.random() - 0.5) * 2;
          this.speedY = -Math.random() * 1.5 - 0.5;
          this.opacity = Math.random() * 0.4 + 0.2;
          this.life = 1;
          this.decay = Math.random() * 0.008 + 0.003;
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.size += 0.5;
          this.life -= this.decay;
          this.opacity = this.life * 0.4;
        }
        draw(ctx) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.opacity;
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          gradient.addColorStop(0, 'rgba(153, 51, 34, 0.15)');
          gradient.addColorStop(0.4, 'rgba(58, 50, 42, 0.1)');
          gradient.addColorStop(1, 'rgba(26, 23, 20, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      function animateSmoke() {
        if (smokeRevealed) return;
        ctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

        // Spawn new particles
        if (smokeParticles.length < 40) {
          const x = Math.random() * smokeCanvas.width;
          const y = smokeCanvas.height + 20;
          smokeParticles.push(new SmokeParticle(x, y));
        }

        smokeParticles.forEach(p => {
          p.update();
          p.draw(ctx);
        });
        smokeParticles = smokeParticles.filter(p => p.life > 0);
        smokeAnimFrame = requestAnimationFrame(animateSmoke);
      }

      // Start smoke when section is visible
      const smokeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !smokeRevealed) {
            animateSmoke();
            setTimeout(() => {
              smokeRevealed = true;
              cancelAnimationFrame(smokeAnimFrame);
              smokeCanvas.style.opacity = '0';
              smokeCanvas.style.transition = 'opacity 2s ease-out';
            }, 3000);
          }
        });
      }, { threshold: 0.2 });
      smokeObserver.observe(smokeCanvas.parentElement);
    }

    // ═══════════════════════════════════════════
    // 2. LIVE ROOM TRANSFORMATION
    // ═══════════════════════════════════════════
    const roomConfig = {
      birthday: {
        label: 'Birthday Party',
        icon: '🎂',
        lighting: 'linear-gradient(135deg, #3d1a2e 0%, #2a1520 40%, #0d0d0d 100%)',
        accent: '#e84ca0',
        glow: 'rgba(232, 76, 160, 0.15)',
        tables: 'round-scattered',
        centerpiece: 'Candles & floral arrangements',
        layout: 'Round tables with dance floor center',
        music: 'Upbeat playlist & celebration anthems',
        menu: 'Shared platters with custom cake station',
        capacity: '20–60 guests',
        vibe: 'Joyful, colorful, high-energy',
        wallTreatment: 'Festive string lights & balloon garland wall',
        zones: ['Welcome Bar', 'Dance Floor', 'Gift Table', 'Cake Station', 'Photo Booth']
      },
      rehearsal: {
        label: 'Rehearsal Dinner',
        icon: '💒',
        lighting: 'linear-gradient(135deg, #2a2a1a 0%, #1a1a14 40%, #14120e 100%)',
        accent: '#a0845c',
        glow: 'rgba(160, 132, 92, 0.15)',
        centerpiece: 'Low florals with taper candles',
        layout: 'Long family-style tables with head table',
        music: 'Soft jazz & acoustic strings',
        menu: 'Plated multi-course with wine pairing',
        capacity: '30–80 guests',
        vibe: 'Elegant, intimate, warmly emotional',
        wallTreatment: 'Warm uplighting with draped fabric',
        zones: ['Cocktail Lounge', 'Head Table', 'Guest Tables', 'Toast Stage', 'Photo Corner']
      },
      corporate: {
        label: 'Corporate Event',
        icon: '🏢',
        lighting: 'linear-gradient(135deg, #1a1e2a 0%, #141620 40%, #0e1014 100%)',
        accent: '#5a9fd4',
        glow: 'rgba(90, 159, 212, 0.15)',
        tables: 'classroom-rounds',
        centerpiece: 'Minimal arrangements with branded touches',
        layout: 'Rounds with presentation area & AV setup',
        music: 'Ambient background — presentation-ready',
        menu: 'Buffet stations with executive platter',
        capacity: '30–80 guests',
        vibe: 'Professional, polished, impressive',
        wallTreatment: 'Clean uplighting with projection wall',
        zones: ['Registration Desk', 'Presentation Area', 'Dining Section', 'Networking Bar', 'Breakout Zone']
      },
      graduation: {
        label: 'Graduation Party',
        icon: '🎓',
        lighting: 'linear-gradient(135deg, #1a2a1a 0%, #142014 40%, #0e140e 100%)',
        accent: '#4ade80',
        glow: 'rgba(74, 222, 128, 0.15)',
        tables: 'mixed-casual',
        centerpiece: 'Memory boards & achievement displays',
        layout: 'Mix of rounds and cocktail tables with open flow',
        music: 'High-energy mix — DJ-friendly setup',
        menu: 'BBQ buffet with build-your-own stations',
        capacity: '20–70 guests',
        vibe: 'Celebratory, proud, young energy',
        wallTreatment: 'School colors accent lighting & memory wall',
        zones: ['Photo Wall', 'Buffet Line', 'Open Dance Area', 'Memory Display', 'Dessert Bar']
      },
      holiday: {
        label: 'Holiday Celebration',
        icon: '🎄',
        lighting: 'linear-gradient(135deg, #2a1a1a 0%, #201414 40%, #140e0e 100%)',
        accent: '#e84a4a',
        glow: 'rgba(232, 74, 74, 0.12)',
        tables: 'banquet-long',
        centerpiece: 'Seasonal greenery with candlelight',
        layout: 'Long banquet tables with fireplace focal point',
        music: 'Holiday standards & warm jazz',
        menu: 'Family-style feast with seasonal specials',
        capacity: '30–80 guests',
        vibe: 'Warm, nostalgic, festive magic',
        wallTreatment: 'Warm amber uplighting with garland draping',
        zones: ['Welcome Hearth', 'Banquet Hall', 'Cocktail Nook', 'Dessert Table', 'Gift Exchange']
      },
      teambuilding: {
        label: 'Team Building',
        icon: '👥',
        lighting: 'linear-gradient(135deg, #1a2520 0%, #14201a 40%, #0e1410 100%)',
        accent: '#b53d2e',
        glow: 'rgba(181, 61, 46, 0.15)',
        tables: 'pods-cluster',
        centerpiece: 'Activity supplies & collaborative tools',
        layout: 'Team pods of 6–8 with central activity zone',
        music: 'Energetic background — activity soundtrack',
        menu: 'Shared platters & BBQ tastings',
        capacity: '20–60 guests',
        vibe: 'Collaborative, energizing, team spirit',
        wallTreatment: 'Dynamic color-wash lighting',
        zones: ['Icebreaker Circle', 'Team Pods', 'Activity Center', 'BBQ Tasting Bar', 'Awards Stage']
      }
    };

    const eventBtns = document.querySelectorAll('.hr-event-btn');
    const roomPreview = document.querySelector('.hr-room-preview');
    const roomCanvas = document.getElementById('hickory-room-canvas');

    if (eventBtns.length && roomPreview && roomCanvas) {
      const rctx = roomCanvas.getContext('2d');
      let currentEvent = 'birthday';
      let animating = false;

      function resizeRoomCanvas() {
        const rect = roomCanvas.parentElement.getBoundingClientRect();
        roomCanvas.width = rect.width;
        roomCanvas.height = rect.height;
      }
      resizeRoomCanvas();
      window.addEventListener('resize', resizeRoomCanvas);

      // Draw room layout
      function drawRoom(eventType, progress) {
        const config = roomConfig[eventType];
        const w = roomCanvas.width;
        const h = roomCanvas.height;
        rctx.clearRect(0, 0, w, h);

        // Room floor
        rctx.save();
        rctx.globalAlpha = progress;
        rctx.fillStyle = '#0d0d0d';
        rctx.fillRect(0, 0, w, h);

        // Room border glow
        rctx.strokeStyle = config.accent;
        rctx.lineWidth = 2;
        rctx.globalAlpha = progress * 0.6;
        rctx.strokeRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9);

        // Ambient glow from accent
        const centerGlow = rctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5);
        centerGlow.addColorStop(0, config.glow);
        centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
        rctx.globalAlpha = progress * 0.8;
        rctx.fillStyle = centerGlow;
        rctx.fillRect(0, 0, w, h);

        // Draw tables based on layout type
        rctx.globalAlpha = progress;
        drawTables(rctx, config.tables, w, h, config.accent);

        // Zone labels
        rctx.globalAlpha = progress * 0.7;
        rctx.font = `${Math.max(10, w * 0.022)}px "Oswald", sans-serif`;
        rctx.textAlign = 'center';
        rctx.fillStyle = config.accent;

        const zonePositions = [
          { x: w * 0.2, y: h * 0.15 },
          { x: w * 0.8, y: h * 0.15 },
          { x: w * 0.5, y: h * 0.5 },
          { x: w * 0.2, y: h * 0.85 },
          { x: w * 0.8, y: h * 0.85 }
        ];

        config.zones.forEach((zone, i) => {
          if (i < zonePositions.length) {
            rctx.fillText(zone.toUpperCase(), zonePositions[i].x, zonePositions[i].y);
            // Zone dot
            rctx.beginPath();
            rctx.arc(zonePositions[i].x, zonePositions[i].y + 8, 3, 0, Math.PI * 2);
            rctx.fill();
          }
        });

        rctx.restore();
      }

      function drawTables(ctx, type, w, h, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;

        switch (type) {
          case 'round-scattered':
            drawCircle(ctx, w * 0.25, h * 0.35, 18);
            drawCircle(ctx, w * 0.45, h * 0.3, 18);
            drawCircle(ctx, w * 0.65, h * 0.4, 18);
            drawCircle(ctx, w * 0.3, h * 0.65, 18);
            drawCircle(ctx, w * 0.55, h * 0.7, 18);
            drawCircle(ctx, w * 0.75, h * 0.6, 18);
            // Dance floor
            ctx.globalAlpha = 0.15;
            ctx.fillRect(w * 0.35, h * 0.45, w * 0.3, h * 0.15);
            break;
          case 'long-formal':
            drawRect(ctx, w * 0.15, h * 0.2, w * 0.7, h * 0.06);
            drawRect(ctx, w * 0.15, h * 0.35, w * 0.7, h * 0.06);
            drawRect(ctx, w * 0.15, h * 0.5, w * 0.7, h * 0.06);
            // Head table
            ctx.globalAlpha = 0.7;
            drawRect(ctx, w * 0.25, h * 0.75, w * 0.5, h * 0.07);
            break;
          case 'classroom-rounds':
            drawCircle(ctx, w * 0.25, h * 0.3, 16);
            drawCircle(ctx, w * 0.5, h * 0.3, 16);
            drawCircle(ctx, w * 0.75, h * 0.3, 16);
            drawCircle(ctx, w * 0.25, h * 0.6, 16);
            drawCircle(ctx, w * 0.5, h * 0.6, 16);
            drawCircle(ctx, w * 0.75, h * 0.6, 16);
            // Presentation area
            ctx.globalAlpha = 0.25;
            drawRect(ctx, w * 0.3, h * 0.82, w * 0.4, h * 0.05);
            break;
          case 'mixed-casual':
            drawCircle(ctx, w * 0.2, h * 0.3, 14);
            drawCircle(ctx, w * 0.45, h * 0.25, 14);
            drawRect(ctx, w * 0.6, h * 0.28, w * 0.15, h * 0.04);
            drawRect(ctx, w * 0.6, h * 0.38, w * 0.15, h * 0.04);
            drawCircle(ctx, w * 0.3, h * 0.6, 14);
            drawCircle(ctx, w * 0.55, h * 0.65, 14);
            // Buffet line
            ctx.globalAlpha = 0.3;
            drawRect(ctx, w * 0.1, h * 0.8, w * 0.8, h * 0.04);
            break;
          case 'banquet-long':
            drawRect(ctx, w * 0.1, h * 0.25, w * 0.8, h * 0.06);
            drawRect(ctx, w * 0.1, h * 0.4, w * 0.8, h * 0.06);
            drawRect(ctx, w * 0.1, h * 0.55, w * 0.8, h * 0.06);
            drawRect(ctx, w * 0.1, h * 0.7, w * 0.8, h * 0.06);
            break;
          case 'pods-cluster':
            drawRoundedRect(ctx, w * 0.12, h * 0.2, w * 0.2, h * 0.2, 8);
            drawRoundedRect(ctx, w * 0.4, h * 0.2, w * 0.2, h * 0.2, 8);
            drawRoundedRect(ctx, w * 0.68, h * 0.2, w * 0.2, h * 0.2, 8);
            drawRoundedRect(ctx, w * 0.12, h * 0.55, w * 0.2, h * 0.2, 8);
            drawRoundedRect(ctx, w * 0.4, h * 0.55, w * 0.2, h * 0.2, 8);
            drawRoundedRect(ctx, w * 0.68, h * 0.55, w * 0.2, h * 0.2, 8);
            // Activity center
            ctx.globalAlpha = 0.2;
            drawCircle(ctx, w * 0.5, h * 0.5, 25);
            break;
        }
      }

      function drawCircle(ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawRect(ctx, x, y, w, h) {
        ctx.fillRect(x, y, w, h);
      }

      function drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      }

      // Update room display
      function updateRoom(eventType) {
        if (animating || eventType === currentEvent) return;
        animating = true;
        currentEvent = eventType;
        const config = roomConfig[eventType];

        // Update button states
        eventBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.event === eventType);
        });

        // Animate room preview
        roomPreview.style.opacity = '0';
        roomPreview.style.transform = 'translateY(10px)';

        setTimeout(() => {
          // Update room styling
          roomPreview.style.background = config.lighting;
          roomPreview.style.boxShadow = `inset 0 0 80px ${config.glow}, 0 0 40px ${config.glow}`;

          // Update detail cards
          const details = roomPreview.querySelectorAll('.hr-detail-value');
          const detailData = [config.layout, config.centerpiece, config.music, config.menu, config.wallTreatment, config.capacity];
          details.forEach((el, i) => {
            if (detailData[i]) el.textContent = detailData[i];
          });

          // Update vibe badge
          const vibeBadge = roomPreview.querySelector('.hr-vibe-badge');
          if (vibeBadge) {
            vibeBadge.textContent = config.vibe;
            vibeBadge.style.borderColor = config.accent;
            vibeBadge.style.color = config.accent;
          }

          // Draw room canvas
          let progress = 0;
          function animateIn() {
            progress += 0.04;
            if (progress >= 1) {
              progress = 1;
              drawRoom(eventType, 1);
              animating = false;
              return;
            }
            drawRoom(eventType, progress);
            requestAnimationFrame(animateIn);
          }
          animateIn();

          roomPreview.style.opacity = '1';
          roomPreview.style.transform = 'translateY(0)';
        }, 400);
      }

      // Event button handlers
      eventBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          updateRoom(btn.dataset.event);
        });
        btn.addEventListener('mouseenter', () => {
          if (!isMobile()) {
            const config = roomConfig[btn.dataset.event];
            btn.style.borderColor = config.accent;
            btn.style.color = config.accent;
          }
        });
        btn.addEventListener('mouseleave', () => {
          if (!btn.classList.contains('active')) {
            btn.style.borderColor = '';
            btn.style.color = '';
          }
        });
      });

      // Initialize with birthday
      setTimeout(() => updateRoom('birthday'), 500);
    }

    // ═══════════════════════════════════════════
    // 3. BUILD MY NIGHT SIMULATOR
    // ═══════════════════════════════════════════
    const simulator = document.querySelector('.hr-simulator');
    if (simulator) {
      const steps = simulator.querySelectorAll('.hr-sim-step');
      const dots = simulator.querySelectorAll('.hr-sim-dot');
      const prevBtn = simulator.querySelector('.hr-sim-prev');
      const nextBtn = simulator.querySelector('.hr-sim-next');
      const resultsPanel = simulator.querySelector('.hr-sim-results');
      let simStep = 0;

      const simState = {
        guests: 40,
        eventStyle: 'celebration',
        foodStyle: 'family',
        serviceStyle: 'dedicated',
        seating: 'rounds'
      };

      // Packages and recommendations
      const packageTiers = {
        intimate: { name: 'The Ember Package', price: '$$', desc: 'Intimate gatherings with curated plates' },
        classic: { name: 'The Hickory Package', price: '$$$', desc: 'Full-service BBQ experience with dedicated staff' },
        premium: { name: 'The Pitmaster\'s Table', price: '$$$$', desc: 'Premium all-inclusive with live carving & pairings' }
      };

      function getRecommendation() {
        const g = simState.guests;
        const isLarge = g > 50;
        const isFormal = simState.eventStyle === 'formal' || simState.eventStyle === 'executive';
        const isBuffet = simState.foodStyle === 'buffet';

        let tier = 'classic';
        if (isFormal || simState.serviceStyle === 'premium') tier = 'premium';
        if (g <= 25 && !isFormal) tier = 'intimate';

        const pkg = packageTiers[tier];

        const layoutMap = {
          'rounds': isLarge ? '8 round tables of 6–8' : '5 round tables of 4–8',
          'long': isLarge ? '4 long banquet tables' : '2 long family-style tables',
          'mixed': 'Mix of rounds, cocktail tables, and lounge seating',
          'theater': 'Theater-style seating with front presentation area',
          'cocktail': 'Standing cocktail with scattered high-tops and lounge zones'
        };

        const menuMap = {
          'family': 'Shared platters — brisket, ribs, pulled pork with all the fixings',
          'plated': 'Plated service — choice of smoked protein with paired sides',
          'buffet': 'Full BBQ buffet line with carving station and sides bar',
          'stations': 'Interactive food stations — live smoking, build-your-own, dessert bar',
          'passed': 'Passed appetizers with mini-plates and cocktail bites'
        };

        const timelineMap = {
          'celebration': ['6:00 PM — Doors Open & Welcome Cocktails', '6:30 PM — Guests Seated', '7:00 PM — Dinner Service Begins', '8:00 PM — Toasts & Speeches', '8:30 PM — Dessert & Dancing', '10:00 PM — Evening Wraps'],
          'formal': ['6:30 PM — Cocktail Reception', '7:00 PM — Formal Seating', '7:15 PM — First Course', '7:45 PM — Main Course', '8:30 PM — Remarks & Toasts', '9:00 PM — Dessert Service', '10:00 PM — Close'],
          'executive': ['11:30 AM — Arrival & Coffee', '12:00 PM — Presentation Begins', '12:45 PM — Working Lunch', '1:30 PM — Breakout Sessions', '2:30 PM — Wrap & Networking', '3:00 PM — Close'],
          'casual': ['5:00 PM — Open House Begins', '5:30 PM — BBQ Buffet Opens', '6:30 PM — Open Mingling', '7:30 PM — Toasts (Optional)', '8:00 PM — Dessert', '9:00 PM — Wind Down'],
          'social': ['7:00 PM — Doors Open', '7:30 PM — Food & Drinks Flow', '8:00 PM — Live Music / DJ', '9:00 PM — Special Moment', '10:00 PM — Last Call', '10:30 PM — Close']
        };

        const feelMap = {
          'rounds': 'Conversational and connected — every guest has a great seat',
          'long': 'Grand and communal — the whole party feels like one table',
          'mixed': 'Relaxed and fluid — guests move between conversation zones',
          'theater': 'Focused and impactful — all eyes forward for your big moment',
          'cocktail': 'Electric and social — maximum mingling energy'
        };

        return {
          layout: layoutMap[simState.seating] || layoutMap['rounds'],
          feel: feelMap[simState.seating] || feelMap['rounds'],
          package: pkg,
          menu: menuMap[simState.foodStyle] || menuMap['family'],
          timeline: timelineMap[simState.eventStyle] || timelineMap['celebration']
        };
      }

      function showSimStep(step) {
        steps.forEach((s, i) => {
          s.classList.toggle('active', i === step);
        });
        dots.forEach((d, i) => {
          d.classList.toggle('active', i <= step);
        });
        if (prevBtn) prevBtn.style.visibility = step === 0 ? 'hidden' : 'visible';
        if (nextBtn) nextBtn.textContent = step === steps.length - 1 ? 'See My Night →' : 'Next Step →';
      }

      function showResults() {
        const rec = getRecommendation();
        if (!resultsPanel) return;

        resultsPanel.innerHTML = `
          <div class="hr-sim-results__inner">
            <div class="hr-sim-results__header">
              <span class="section-header__eyebrow">Your Night, Designed</span>
              <h3>Here's What We'd Build for You</h3>
            </div>

            <div class="hr-sim-results__grid">
              <div class="hr-sim-result-card">
                <div class="hr-sim-result-card__icon">🪑</div>
                <div class="hr-sim-result-card__label">Ideal Layout</div>
                <div class="hr-sim-result-card__value">${rec.layout}</div>
              </div>
              <div class="hr-sim-result-card">
                <div class="hr-sim-result-card__icon">✨</div>
                <div class="hr-sim-result-card__label">Room Feel</div>
                <div class="hr-sim-result-card__value">${rec.feel}</div>
              </div>
              <div class="hr-sim-result-card">
                <div class="hr-sim-result-card__icon">🔥</div>
                <div class="hr-sim-result-card__label">Recommended Package</div>
                <div class="hr-sim-result-card__value">${rec.package.name} <span class="hr-sim-price">${rec.package.price}</span></div>
                <div class="hr-sim-result-card__desc">${rec.package.desc}</div>
              </div>
              <div class="hr-sim-result-card">
                <div class="hr-sim-result-card__icon">🍖</div>
                <div class="hr-sim-result-card__label">Menu Pairing</div>
                <div class="hr-sim-result-card__value">${rec.menu}</div>
              </div>
            </div>

            <div class="hr-sim-timeline">
              <div class="hr-sim-timeline__label">Suggested Timeline</div>
              <div class="hr-sim-timeline__steps">
                ${rec.timeline.map(t => `<div class="hr-sim-timeline__step">${t}</div>`).join('')}
              </div>
            </div>

            <div class="hr-sim-results__cta">
              <a href="#hickory-inquiry" class="btn btn--primary btn--lg">Book This Night</a>
              <button class="btn btn--ghost btn--lg hr-sim-restart">Start Over</button>
            </div>
          </div>
        `;

        resultsPanel.classList.add('active');
        simulator.querySelector('.hr-sim-content').style.display = 'none';

        // Restart handler
        resultsPanel.querySelector('.hr-sim-restart').addEventListener('click', () => {
          resultsPanel.classList.remove('active');
          resultsPanel.innerHTML = '';
          simulator.querySelector('.hr-sim-content').style.display = '';
          simStep = 0;
          showSimStep(0);
        });
      }

      // Step navigation
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (simStep >= steps.length - 1) {
            showResults();
          } else {
            simStep++;
            showSimStep(simStep);
          }
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (simStep > 0) {
            simStep--;
            showSimStep(simStep);
          }
        });
      }

      // Option selectors within steps
      simulator.querySelectorAll('.hr-sim-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const group = opt.closest('.hr-sim-options');
          group.querySelectorAll('.hr-sim-option').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');

          const field = opt.dataset.field;
          const value = opt.dataset.value;
          if (field && value) simState[field] = value;
        });
      });

      // Guest count slider
      const guestSlider = simulator.querySelector('.hr-guest-slider');
      const guestDisplay = simulator.querySelector('.hr-guest-count');
      if (guestSlider) {
        guestSlider.addEventListener('input', () => {
          simState.guests = parseInt(guestSlider.value, 10);
          if (guestDisplay) guestDisplay.textContent = guestSlider.value;
        });
      }

      showSimStep(0);
    }

    // ═══════════════════════════════════════════
    // 4. HOST POV CINEMATIC WALKTHROUGH
    // ═══════════════════════════════════════════
    const walkthrough = document.querySelector('.hr-walkthrough');
    if (walkthrough) {
      const wtSteps = walkthrough.querySelectorAll('.hr-wt-step');
      const wtNav = walkthrough.querySelectorAll('.hr-wt-nav-dot');
      let wtCurrent = 0;

      function showWtStep(index) {
        wtSteps.forEach((s, i) => {
          s.classList.toggle('active', i === index);
        });
        wtNav.forEach((d, i) => {
          d.classList.toggle('active', i === index);
        });
        wtCurrent = index;
      }

      wtNav.forEach((dot, i) => {
        dot.addEventListener('click', () => showWtStep(i));
      });

      // Auto-advance
      let wtInterval = setInterval(() => {
        showWtStep((wtCurrent + 1) % wtSteps.length);
      }, 5000);

      // Pause on hover
      walkthrough.addEventListener('mouseenter', () => clearInterval(wtInterval));
      walkthrough.addEventListener('mouseleave', () => {
        wtInterval = setInterval(() => {
          showWtStep((wtCurrent + 1) % wtSteps.length);
        }, 5000);
      });

      showWtStep(0);
    }

    // ═══════════════════════════════════════════
    // 5. MOOD ARCHITECTURE
    // ═══════════════════════════════════════════
    const moodBtns = document.querySelectorAll('.hr-mood-btn');
    const moodPreview = document.querySelector('.hr-mood-preview');

    const moodConfig = {
      intimate: {
        label: 'Warm & Intimate',
        bg: 'linear-gradient(135deg, #2a1a0a 0%, #1a1208 50%, #0d0b06 100%)',
        glow: 'rgba(160, 132, 92, 0.2)',
        accent: '#a0845c',
        desc: 'Low candlelight, soft jazz, close tables. Every whisper carries warmth.',
        density: 'Close-set round tables, dim lighting, taper candles',
        sound: '♪ Soft jazz & acoustic'
      },
      southern: {
        label: 'Southern Celebration',
        bg: 'linear-gradient(135deg, #2a1510 0%, #201008 50%, #140a05 100%)',
        glow: 'rgba(153, 51, 34, 0.2)',
        accent: '#993322',
        desc: 'Big tables, warm laughter, comfort food abundance. The South at its best.',
        density: 'Long family tables, string lights, mason jar centerpieces',
        sound: '♪ Southern soul & country warmth'
      },
      executive: {
        label: 'Executive Dinner',
        bg: 'linear-gradient(135deg, #141820 0%, #0e1218 50%, #080a0e 100%)',
        glow: 'rgba(90, 140, 200, 0.15)',
        accent: '#5a8cc8',
        desc: 'Refined, precise, impressive. Every detail speaks authority.',
        density: 'Spaced rounds, minimal décor, clean lines, spot lighting',
        sound: '♪ Ambient & understated'
      },
      livemusic: {
        label: 'Live-Music Social',
        bg: 'linear-gradient(135deg, #201a2a 0%, #181420 50%, #0e0a14 100%)',
        glow: 'rgba(180, 100, 220, 0.15)',
        accent: '#b464dc',
        desc: 'Stage glow, cocktail flow, music that moves you. A night to remember.',
        density: 'Open floor with cocktail tables, stage front, bar-side lounge',
        sound: '♪ Live band & requests'
      },
      holiday: {
        label: 'Holiday Glow',
        bg: 'linear-gradient(135deg, #2a1a10 0%, #201510 50%, #140e08 100%)',
        glow: 'rgba(220, 180, 60, 0.2)',
        accent: '#dcb43c',
        desc: 'Golden warmth, seasonal magic, the kind of night that becomes tradition.',
        density: 'Banquet tables, greenery garland, warm amber uplighting',
        sound: '♪ Holiday classics & warm jazz'
      }
    };

    if (moodBtns.length && moodPreview) {
      moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const mood = btn.dataset.mood;
          const config = moodConfig[mood];
          if (!config) return;

          moodBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          moodPreview.style.background = config.bg;
          moodPreview.style.boxShadow = `inset 0 0 100px ${config.glow}`;

          const descEl = moodPreview.querySelector('.hr-mood-desc');
          const densityEl = moodPreview.querySelector('.hr-mood-density');
          const soundEl = moodPreview.querySelector('.hr-mood-sound');
          const accentBar = moodPreview.querySelector('.hr-mood-accent-bar');

          if (descEl) descEl.textContent = config.desc;
          if (densityEl) densityEl.textContent = config.density;
          if (soundEl) soundEl.textContent = config.sound;
          if (accentBar) accentBar.style.background = config.accent;

          // Pulse transition effect
          moodPreview.classList.remove('hr-mood-pulse');
          void moodPreview.offsetWidth;
          moodPreview.classList.add('hr-mood-pulse');
        });

        // Hover preview on desktop
        btn.addEventListener('mouseenter', () => {
          if (!isMobile() && !btn.classList.contains('active')) {
            const config = moodConfig[btn.dataset.mood];
            btn.style.borderColor = config.accent;
            btn.style.color = config.accent;
          }
        });
        btn.addEventListener('mouseleave', () => {
          if (!btn.classList.contains('active')) {
            btn.style.borderColor = '';
            btn.style.color = '';
          }
        });
      });
    }

    // ═══════════════════════════════════════════
    // 6. ENERGY MAP — Zone Hotspots
    // ═══════════════════════════════════════════
    const energyZones = document.querySelectorAll('.hr-energy-zone');
    const energyCanvas = document.getElementById('hickory-energy-canvas');

    if (energyZones.length && energyCanvas) {
      const ectx = energyCanvas.getContext('2d');

      function resizeEnergyCanvas() {
        const rect = energyCanvas.parentElement.getBoundingClientRect();
        energyCanvas.width = rect.width;
        energyCanvas.height = rect.height;
      }
      resizeEnergyCanvas();
      window.addEventListener('resize', resizeEnergyCanvas);

      // Draw base map
      function drawEnergyMap(highlightZone) {
        const w = energyCanvas.width;
        const h = energyCanvas.height;
        ectx.clearRect(0, 0, w, h);

        // Room outline
        ectx.strokeStyle = 'rgba(153, 51, 34, 0.3)';
        ectx.lineWidth = 1.5;
        ectx.strokeRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9);

        // Door
        ectx.fillStyle = 'rgba(153, 51, 34, 0.5)';
        ectx.fillRect(w * 0.43, h * 0.92, w * 0.14, h * 0.05);
        ectx.fillStyle = 'rgba(153, 51, 34, 0.7)';
        ectx.font = `${Math.max(9, w * 0.02)}px "Oswald", sans-serif`;
        ectx.textAlign = 'center';
        ectx.fillText('ENTRANCE', w * 0.5, h * 0.98);

        const zones = [
          { id: 'welcome', x: 0.5, y: 0.82, r: 0.08, label: 'Welcome Zone' },
          { id: 'photo', x: 0.15, y: 0.2, r: 0.07, label: 'Photo Moment' },
          { id: 'toast', x: 0.5, y: 0.2, r: 0.08, label: 'Toast Zone' },
          { id: 'buffet', x: 0.85, y: 0.5, r: 0.08, label: 'Buffet Flow' },
          { id: 'mingle', x: 0.15, y: 0.55, r: 0.09, label: 'Mingling Zone' },
          { id: 'music', x: 0.5, y: 0.5, r: 0.1, label: 'Stage / DJ' }
        ];

        zones.forEach(zone => {
          const isHighlighted = highlightZone === zone.id;
          const alpha = isHighlighted ? 0.5 : 0.12;
          const radius = zone.r * Math.min(w, h);

          // Glow circle
          const gradient = ectx.createRadialGradient(
            w * zone.x, h * zone.y, 0,
            w * zone.x, h * zone.y, radius
          );
          gradient.addColorStop(0, `rgba(153, 51, 34, ${alpha})`);
          gradient.addColorStop(1, 'rgba(153, 51, 34, 0)');
          ectx.fillStyle = gradient;
          ectx.beginPath();
          ectx.arc(w * zone.x, h * zone.y, radius, 0, Math.PI * 2);
          ectx.fill();

          // Label
          ectx.fillStyle = isHighlighted ? '#993322' : 'rgba(255, 255, 255, 0.5)';
          ectx.font = `${isHighlighted ? 'bold' : 'normal'} ${Math.max(10, w * 0.022)}px "Oswald", sans-serif`;
          ectx.textAlign = 'center';
          ectx.fillText(zone.label.toUpperCase(), w * zone.x, h * zone.y + 4);
        });
      }

      drawEnergyMap(null);

      energyZones.forEach(zone => {
        zone.addEventListener('mouseenter', () => {
          drawEnergyMap(zone.dataset.zone);
        });
        zone.addEventListener('mouseleave', () => {
          drawEnergyMap(null);
        });
      });
    }

    // ═══════════════════════════════════════════
    // 7. MEMORY WALL — Parallax Frames
    // ═══════════════════════════════════════════
    const memoryWall = document.querySelector('.hr-memory-wall');
    if (memoryWall && !isMobile()) {
      const frames = memoryWall.querySelectorAll('.hr-memory-frame');

      memoryWall.addEventListener('mousemove', (e) => {
        const rect = memoryWall.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        frames.forEach((frame, i) => {
          const depth = (i % 3 + 1) * 0.5;
          const moveX = x * depth * 20;
          const moveY = y * depth * 10;
          const glow = Math.abs(x) < 0.2 && Math.abs(y) < 0.2 ? 0.4 : 0.15;

          frame.style.transform = `translate(${moveX}px, ${moveY}px)`;
          frame.style.boxShadow = `0 0 ${20 + glow * 40}px rgba(153, 51, 34, ${glow})`;
        });
      });

      memoryWall.addEventListener('mouseleave', () => {
        frames.forEach(frame => {
          frame.style.transform = '';
          frame.style.boxShadow = '';
        });
      });
    }

    // ═══════════════════════════════════════════
    // 8. SIGNATURE HICKORY MOMENT
    // ═══════════════════════════════════════════
    const signatureInput = document.querySelector('.hr-signature-input');
    const signatureDisplay = document.querySelector('.hr-signature-display');
    const signatureBell = document.querySelector('.hr-signature-bell');

    if (signatureInput && signatureDisplay) {
      signatureInput.addEventListener('input', () => {
        const name = signatureInput.value.trim();
        signatureDisplay.textContent = name
          ? `Welcome to the ${name}`
          : 'Welcome to Your Evening at The Hickory Room';
        signatureDisplay.classList.toggle('hr-signature--custom', name.length > 0);
      });
    }

    if (signatureBell) {
      signatureBell.addEventListener('click', () => {
        signatureBell.classList.add('hr-bell-ring');
        // Create ring sound effect with visual
        const ring = document.createElement('div');
        ring.className = 'hr-bell-ripple';
        signatureBell.appendChild(ring);
        setTimeout(() => {
          signatureBell.classList.remove('hr-bell-ring');
          ring.remove();
        }, 1200);
      });
    }

    // ═══════════════════════════════════════════
    // 9. HICKORY ROOM INQUIRY FORM
    // ═══════════════════════════════════════════
    const hickoryForm = document.querySelector('.hr-inquiry-form');
    if (hickoryForm) {
      hickoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = hickoryForm.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Inquiry Sent! We\'ll Be in Touch.';
        btn.style.background = '#4ade80';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          hickoryForm.reset();
        }, 4000);
      });
    }

    // ═══════════════════════════════════════════
    // 10. AI EVENT CONCIERGE
    // ═══════════════════════════════════════════
    const conciergeInput = document.getElementById('hr-concierge-input');
    const conciergeSubmit = document.getElementById('hr-concierge-submit');
    const conciergeResponse = document.getElementById('hr-concierge-response');
    const conciergeExamples = document.querySelectorAll('.hr-concierge__example');

    if (conciergeInput && conciergeSubmit && conciergeResponse) {

      // Keyword-based NLP matching engine
      const keywords = {
        eventType: {
          birthday: ['birthday', 'bday', 'turning', 'celebration', 'party'],
          rehearsal: ['rehearsal', 'wedding', 'bride', 'groom', 'engaged', 'engagement'],
          corporate: ['corporate', 'company', 'business', 'team', 'office', 'meeting', 'professional', 'client'],
          graduation: ['graduation', 'grad', 'graduate', 'diploma', 'degree'],
          holiday: ['holiday', 'christmas', 'thanksgiving', 'new year', 'festive', 'seasonal'],
          teambuilding: ['team building', 'team-building', 'teambuilding', 'retreat', 'bonding', 'offsite']
        },
        mood: {
          intimate: ['intimate', 'quiet', 'romantic', 'candlelight', 'cozy', 'small', 'private', 'close'],
          southern: ['southern', 'bbq', 'barbecue', 'country', 'soul', 'family', 'casual', 'relaxed'],
          executive: ['executive', 'professional', 'formal', 'elegant', 'upscale', 'refined', 'classy', 'sophisticated'],
          livemusic: ['music', 'live', 'band', 'dj', 'dancing', 'dance', 'social', 'lively', 'energetic', 'fun'],
          holiday: ['holiday', 'festive', 'seasonal', 'warm', 'tradition']
        },
        food: {
          family: ['family', 'shared', 'family-style', 'platters', 'communal'],
          plated: ['plated', 'seated', 'courses', 'formal', 'wine pairing', 'elegant'],
          buffet: ['buffet', 'self-serve', 'spread', 'all-you-can'],
          stations: ['stations', 'interactive', 'carving', 'build-your-own', 'live'],
          passed: ['passed', 'appetizers', 'cocktail', 'hors d\'oeuvres', 'mingling', 'cocktail hour']
        },
        size: {
          small: ['small', 'intimate', 'few', '15', '20', '25'],
          medium: ['30', '35', '40', '45', '50'],
          large: ['60', '65', '70', '75', '80', 'large', 'big']
        }
      };

      function parsePrompt(text) {
        const lower = text.toLowerCase();
        const result = { eventType: null, mood: null, food: null, size: null, guests: null };

        // Extract guest count if explicit number
        const guestMatch = lower.match(/(\d{2,3})\s*[-–]?\s*(?:person|people|guests?|ppl)?/);
        if (guestMatch) {
          result.guests = Math.min(80, Math.max(20, parseInt(guestMatch[1], 10)));
          result.size = result.guests <= 30 ? 'small' : result.guests <= 55 ? 'medium' : 'large';
        }

        // Match each category
        for (const [category, patterns] of Object.entries(keywords)) {
          if (category === 'size' && result.size) continue;
          for (const [key, words] of Object.entries(patterns)) {
            if (words.some(w => lower.includes(w))) {
              result[category] = key;
              break;
            }
          }
        }

        // Defaults
        if (!result.eventType) result.eventType = 'birthday';
        if (!result.mood) result.mood = 'southern';
        if (!result.food) result.food = 'family';
        if (!result.guests) result.guests = result.size === 'large' ? 65 : result.size === 'small' ? 25 : 40;
        if (!result.size) result.size = 'medium';

        return result;
      }

      // Recommendation templates
      const conciergeRecs = {
        birthday: {
          layout: (g) => g > 50 ? 'Round tables with open dance floor and DJ area' : 'Scattered rounds with a gift table and cake station',
          package: 'The Hickory Package — shared platters, dedicated staff, custom cake display',
          timeline: '6 PM Arrival → 6:30 PM Dinner → 7:30 PM Toast & Cake → 8:30 PM Dancing → 10 PM Close',
          tip: 'We can set up a custom photo wall with your birthday theme. Just ask.'
        },
        rehearsal: {
          layout: (g) => g > 40 ? 'Long family-style tables with head table elevated' : 'One grand table with candle runners and florals',
          package: 'The Pitmaster\'s Table — plated multi-course with wine pairing',
          timeline: '6:30 PM Cocktails → 7 PM Seated → 7:15 PM First Course → 8:15 PM Toasts → 9 PM Dessert → 10 PM Close',
          tip: 'Our rehearsal dinner hosts love the warm amber uplighting with draped fabric — it photographs beautifully.'
        },
        corporate: {
          layout: (g) => g > 50 ? 'Classroom rounds with front presentation area and AV' : 'Boardroom-style long tables with screen access',
          package: 'The Hickory Package — buffet stations with executive platter',
          timeline: '11:30 AM Setup → 12 PM Welcome → 12:30 PM Working Lunch → 2 PM Breakout → 3 PM Close',
          tip: 'We provide full AV support including projection, microphones, and podium setup.'
        },
        graduation: {
          layout: (g) => g > 50 ? 'Mixed casual with buffet line and open mingling zones' : 'Round tables with memory board display and dessert bar',
          package: 'The Hickory Package — full BBQ buffet with build-your-own stations',
          timeline: '5 PM Doors → 5:30 PM Buffet → 6:30 PM Speeches → 7 PM Dessert & Music → 9 PM Close',
          tip: 'We can feature school colors in the accent lighting and set up a memory wall.'
        },
        holiday: {
          layout: (g) => g > 50 ? 'Long banquet tables with garland centerpieces' : 'Intimate rounds with seasonal greenery and taper candles',
          package: 'The Pitmaster\'s Table — family-style feast with seasonal specials',
          timeline: '6 PM Welcome Cocktails → 6:30 PM Seated Dinner → 7:30 PM Toasts → 8 PM Dessert → 9:30 PM Close',
          tip: 'Our holiday events include complimentary seasonal décor and a curated holiday playlist.'
        },
        teambuilding: {
          layout: (g) => g > 40 ? 'Team pods of 6–8 with central activity zone' : 'Activity clusters with icebreaker stations',
          package: 'The Ember Package — shared platters and BBQ tastings',
          timeline: '2 PM Arrival → 2:30 PM Icebreakers → 3 PM Team Challenge → 4 PM BBQ Tasting → 5 PM Awards → 5:30 PM Close',
          tip: 'We can coordinate team activities including BBQ trivia and smokehouse challenges.'
        }
      };

      const moodNames = {
        intimate: 'Warm & Intimate',
        southern: 'Southern Celebration',
        executive: 'Executive',
        livemusic: 'Live-Music Social',
        holiday: 'Holiday Glow'
      };

      const foodNames = {
        family: 'Family-Style Platters',
        plated: 'Plated Service',
        buffet: 'BBQ Buffet',
        stations: 'Interactive Stations',
        passed: 'Passed Appetizers'
      };

      function generateResponse(parsed) {
        const rec = conciergeRecs[parsed.eventType] || conciergeRecs['birthday'];
        const eventLabels = {
          birthday: 'Birthday Party', rehearsal: 'Rehearsal Dinner', corporate: 'Corporate Event',
          graduation: 'Graduation Party', holiday: 'Holiday Celebration', teambuilding: 'Team Building'
        };
        const eventLabel = eventLabels[parsed.eventType] || 'Special Event';

        return `
          <div class="hr-ai-card">
            <div class="hr-ai-card__header">
              <span class="hr-ai-card__spark">✦</span>
              <span class="hr-ai-card__title">Your Personalized Recommendation</span>
            </div>
            <div class="hr-ai-grid">
              <div class="hr-ai-item">
                <div class="hr-ai-item__label">Event Type</div>
                <div class="hr-ai-item__value">${eventLabel}</div>
              </div>
              <div class="hr-ai-item">
                <div class="hr-ai-item__label">Guest Count</div>
                <div class="hr-ai-item__value">${parsed.guests} guests</div>
              </div>
              <div class="hr-ai-item">
                <div class="hr-ai-item__label">Mood</div>
                <div class="hr-ai-item__value">${moodNames[parsed.mood] || 'Southern Celebration'}</div>
              </div>
              <div class="hr-ai-item">
                <div class="hr-ai-item__label">Food Style</div>
                <div class="hr-ai-item__value">${foodNames[parsed.food] || 'Family-Style Platters'}</div>
              </div>
              <div class="hr-ai-item">
                <div class="hr-ai-item__label">Recommended Layout</div>
                <div class="hr-ai-item__value">${rec.layout(parsed.guests)}</div>
              </div>
              <div class="hr-ai-item">
                <div class="hr-ai-item__label">Package</div>
                <div class="hr-ai-item__value">${rec.package}</div>
              </div>
            </div>
            <div class="hr-ai-item" style="margin-bottom: var(--space-md);">
              <div class="hr-ai-item__label">Suggested Timeline</div>
              <div class="hr-ai-item__value">${rec.timeline}</div>
            </div>
            <div class="hr-ai-quote">"${rec.tip}"</div>
            <div class="hr-ai-cta">
              <a href="#hickory-inquiry" class="btn btn--primary">Book This Experience</a>
            </div>
          </div>
        `;
      }

      function submitConcierge() {
        const text = conciergeInput.value.trim();
        if (!text) return;

        // Show typing indicator
        conciergeResponse.innerHTML = '<div class="hr-concierge__typing"><span></span><span></span><span></span></div>';

        // Simulate AI processing delay
        setTimeout(() => {
          const parsed = parsePrompt(text);
          conciergeResponse.innerHTML = generateResponse(parsed);
        }, 1200);
      }

      conciergeSubmit.addEventListener('click', submitConcierge);
      conciergeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitConcierge();
        }
      });

      // Example prompts
      conciergeExamples.forEach(ex => {
        ex.addEventListener('click', () => {
          conciergeInput.value = ex.dataset.prompt;
          submitConcierge();
        });
      });
    }

    // ═══════════════════════════════════════════
    // 11. AMBIENT SOUNDSCAPE — Web Audio API
    // ═══════════════════════════════════════════
    const soundBtns = document.querySelectorAll('.hr-sound-btn');
    if (soundBtns.length) {
      let audioCtx = null;
      let currentSource = null;
      let currentGain = null;
      let currentBtn = null;

      // Sound configurations using Web Audio oscillators
      const soundScapes = {
        warmjazz: {
          notes: [261.63, 329.63, 392.00, 440.00, 523.25],
          tempo: 0.8,
          type: 'sine',
          filterFreq: 800,
          volume: 0.08
        },
        southern: {
          notes: [220.00, 277.18, 329.63, 369.99, 440.00],
          tempo: 0.6,
          type: 'triangle',
          filterFreq: 1200,
          volume: 0.07
        },
        cocktail: {
          notes: [293.66, 349.23, 440.00, 523.25, 587.33],
          tempo: 1.0,
          type: 'sine',
          filterFreq: 1000,
          volume: 0.06
        },
        liveband: {
          notes: [196.00, 246.94, 293.66, 349.23, 392.00],
          tempo: 0.5,
          type: 'sawtooth',
          filterFreq: 600,
          volume: 0.04
        }
      };

      function stopCurrentSound() {
        if (currentGain) {
          currentGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
          setTimeout(() => {
            if (currentSource) {
              try { currentSource.stop(); } catch(e) { /* already stopped */ }
            }
          }, 600);
        }
        if (currentBtn) {
          currentBtn.classList.remove('playing');
        }
        currentSource = null;
        currentGain = null;
        currentBtn = null;
      }

      function playSoundscape(soundId, btn) {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        // If same button, toggle off
        if (currentBtn === btn) {
          stopCurrentSound();
          return;
        }

        stopCurrentSound();

        const config = soundScapes[soundId];
        if (!config) return;

        // Create a warm ambient pad using layered oscillators
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(config.volume, audioCtx.currentTime + 1);

        // Low-pass filter for warmth
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(config.filterFreq, audioCtx.currentTime);
        filter.Q.setValueAtTime(1, audioCtx.currentTime);

        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Create evolving pad with detuned oscillators
        const oscs = [];
        config.notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          osc.type = config.type;
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          // Slow LFO-like frequency modulation for organic feel
          osc.frequency.linearRampToValueAtTime(freq * 1.005, audioCtx.currentTime + 2);
          osc.frequency.linearRampToValueAtTime(freq * 0.995, audioCtx.currentTime + 4);
          osc.frequency.linearRampToValueAtTime(freq, audioCtx.currentTime + 6);

          const oscGain = audioCtx.createGain();
          oscGain.gain.setValueAtTime(0.15 / config.notes.length, audioCtx.currentTime);

          osc.connect(oscGain);
          oscGain.connect(filter);
          osc.start(audioCtx.currentTime + i * config.tempo * 0.3);
          oscs.push(osc);
        });

        // Store for cleanup
        currentGain = gainNode;
        currentSource = { stop: () => oscs.forEach(o => { try { o.stop(); } catch(e) { /* oscillator already stopped */ } }) };
        currentBtn = btn;
        btn.classList.add('playing');

        // Auto-stop after 12 seconds for preview
        setTimeout(() => {
          if (currentBtn === btn) {
            stopCurrentSound();
          }
        }, 12000);
      }

      soundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          playSoundscape(btn.dataset.sound, btn);
        });
      });
    }

    // ═══════════════════════════════════════════
    // 12. TABLE-LEVEL FOOD VISUALIZATION
    // ═══════════════════════════════════════════
    const foodBtns = document.querySelectorAll('.hr-food-btn');
    const foodPreview = document.querySelector('.hr-food-preview');

    const foodConfig = {
      passed: {
        label: 'Passed Appetizers',
        items: ['Mini brisket sliders', 'Smoked pimento cheese bites', 'BBQ shrimp skewers', 'Cornbread muffins with honey butter'],
        visual: '🍢',
        density: 'Light, flowing service — trays circulate every 4–5 minutes',
        pairing: 'Craft cocktails & chilled beer flights',
        feel: 'Elegant mingling — guests move freely while bites come to them'
      },
      family: {
        label: 'Family-Style Dinner',
        items: ['Brisket boards center-table', 'Rib platters per 8 guests', 'Mac & cheese in cast iron', 'Collard greens & baked beans', 'Cornbread baskets'],
        visual: '🍖',
        density: 'Abundant — large platters refresh every 15 minutes',
        pairing: 'Sweet tea, lemonade, and bourbon selections',
        feel: 'Communal and generous — the whole table shares the feast'
      },
      buffet: {
        label: 'Buffet Line',
        items: ['Live brisket carving station', 'Pulled pork & chicken', 'Full sides bar (6 options)', 'Rolls & sauces station', 'Dessert table'],
        visual: '🥘',
        density: 'Full spread — all items available continuously for 90 minutes',
        pairing: 'Self-serve beverage station with sweet tea, water, & soda',
        feel: 'Active and social — guests choose their own BBQ adventure'
      },
      plated: {
        label: 'Plated Service',
        items: ['Choice of smoked protein (brisket, salmon, or chicken)', 'Two chef-selected seasonal sides', 'House-baked roll with honey butter', 'Plated dessert to finish'],
        visual: '🍽️',
        density: 'Precise — each guest receives a curated plate',
        pairing: 'Wine pairing available — selected by our team',
        feel: 'Refined and intentional — white-glove service at every seat'
      },
      dessert: {
        label: 'Dessert Spread',
        items: ['Banana pudding shooters', 'Peach cobbler with vanilla cream', 'Smoked chocolate brownie bites', 'Seasonal pie slices', 'Coffee & espresso bar'],
        visual: '🍰',
        density: 'Indulgent finish — dessert station with self-serve and plated options',
        pairing: 'Coffee, espresso, bourbon nightcaps',
        feel: 'Sweet close — the perfect ending to the night'
      }
    };

    if (foodBtns.length && foodPreview) {
      foodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const style = btn.dataset.food;
          const config = foodConfig[style];
          if (!config) return;

          foodBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          foodPreview.classList.remove('hr-food-pulse');
          void foodPreview.offsetWidth;
          foodPreview.classList.add('hr-food-pulse');

          const visualEl = foodPreview.querySelector('.hr-food-visual');
          const itemsEl = foodPreview.querySelector('.hr-food-items');
          const densityEl = foodPreview.querySelector('.hr-food-density');
          const pairingEl = foodPreview.querySelector('.hr-food-pairing');
          const feelEl = foodPreview.querySelector('.hr-food-feel');

          if (visualEl) visualEl.textContent = config.visual;
          if (itemsEl) itemsEl.innerHTML = config.items.map(i => `<li>${i}</li>`).join('');
          if (densityEl) densityEl.textContent = config.density;
          if (pairingEl) pairingEl.textContent = config.pairing;
          if (feelEl) feelEl.textContent = config.feel;
        });
      });
    }

  });
})();
