/* ============================================
   CUE BARBECUE — Ember Particle System
   Sound-reactive ember particles for hero section
   ============================================ */

class EmberParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 60;
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
  }

  createParticle() {
    const x = Math.random() * this.canvas.width;
    const y = this.canvas.height + 10;
    const size = Math.random() * 3 + 1;
    const speedY = -(Math.random() * 1.5 + 0.3);
    const speedX = (Math.random() - 0.5) * 0.8;
    const life = Math.random() * 200 + 100;
    const maxLife = life;
    const hue = Math.random() * 30 + 15; // Orange range
    const brightness = Math.random() * 30 + 60;

    return { x, y, size, speedY, speedX, life, maxLife, hue, brightness, wobble: Math.random() * Math.PI * 2 };
  }

  update() {
    // Add new particles
    if (this.particles.length < this.maxParticles && Math.random() > 0.85) {
      this.particles.push(this.createParticle());
    }

    // Update existing
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.wobble) * 0.3;
      p.wobble += 0.02;
      p.size *= 0.998;

      if (p.life <= 0 || p.y < -10) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      const alpha = (p.life / p.maxLife) * 0.8;

      // Glow
      this.ctx.save();
      this.ctx.globalAlpha = alpha * 0.3;
      this.ctx.fillStyle = `hsl(${p.hue}, 90%, ${p.brightness}%)`;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Core
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = `hsl(${p.hue}, 95%, ${p.brightness + 15}%)`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  animate() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (!this.animationId) {
      this.animate();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Export for use
window.EmberParticleSystem = EmberParticleSystem;
