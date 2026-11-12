import { clamp } from "./utils.js";

const MODES = {
  motes: { count: 34, speed: 0.16, drift: 0.12, size: [0.7, 2.1], alpha: [0.08, 0.38], colour: "228, 206, 166", kind: "mote" },
  dust: { count: 42, speed: 0.09, drift: 0.08, size: [0.7, 2.4], alpha: [0.06, 0.3], colour: "231, 211, 172", kind: "mote" },
  sea: { count: 26, speed: 0.1, drift: 0.35, size: [0.7, 2.3], alpha: [0.04, 0.22], colour: "210, 224, 219", kind: "spray" },
  rain: { count: 105, speed: 10.5, drift: 2.5, size: [0.6, 1.1], alpha: [0.08, 0.26], colour: "195, 212, 211", kind: "rain" },
  storm: { count: 155, speed: 15, drift: 4.2, size: [0.7, 1.3], alpha: [0.09, 0.3], colour: "192, 210, 209", kind: "rain" },
  none: { count: 0 },
  fireflies: { count: 20, speed: 0.12, drift: 0.25, size: [1, 2.4], alpha: [0.08, 0.5], colour: "235, 204, 132", kind: "mote" }
};

export class Atmosphere {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d", { alpha: true });
    this.particles = [];
    this.mode = "none";
    this.reducedMotion = false;
    this.running = false;
    this.lastFrame = 0;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.raf = null;
    this.resizeObserver = null;

    if (!canvas || !this.ctx) return;

    this.#resize();
    this.resizeObserver = new ResizeObserver(() => this.#resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.onVisibility = () => {
      if (document.hidden) this.stop();
      else if (this.mode !== "none") this.start();
    };
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  setMode(mode = "none") {
    if (!this.ctx) return;
    const next = MODES[mode] ? mode : "none";
    if (next === this.mode && this.running) return;
    this.mode = next;
    this.#buildParticles();
    if (this.reducedMotion) {
      this.stop();
      this.#drawStatic();
      return;
    }
    if (next === "none") {
      this.stop();
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }
    this.start();
  }

  setReducedMotion(reduced) {
    this.reducedMotion = Boolean(reduced);
    if (this.reducedMotion) {
      this.stop();
      this.#drawStatic();
    } else if (this.mode !== "none") {
      this.#buildParticles();
      this.start();
    }
  }

  start() {
    if (!this.ctx || this.running || this.reducedMotion || this.mode === "none") return;
    this.running = true;
    this.lastFrame = 0;
    this.raf = requestAnimationFrame((time) => this.#tick(time));
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  clear() {
    this.setMode("none");
  }

  #resize() {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width || window.innerWidth);
    this.height = Math.max(1, rect.height || window.innerHeight);
    this.dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.#buildParticles();
    if (this.reducedMotion) this.#drawStatic();
  }

  #buildParticles() {
    const config = MODES[this.mode];
    this.particles = [];
    if (!config || !config.count) return;
    const count = Math.round(config.count * clamp(this.width / 1400, 0.55, 1.45));
    for (let i = 0; i < count; i += 1) {
      this.particles.push(this.#makeParticle(config, true));
    }
  }

  #makeParticle(config, initial = false) {
    const [minSize, maxSize] = config.size;
    const [minAlpha, maxAlpha] = config.alpha;
    const random = (a, b) => a + Math.random() * (b - a);
    const particle = {
      x: Math.random() * this.width,
      y: initial ? Math.random() * this.height : random(-this.height * 0.2, -10),
      size: random(minSize, maxSize),
      alpha: random(minAlpha, maxAlpha),
      baseAlpha: random(minAlpha, maxAlpha),
      speed: random(config.speed * 0.55, config.speed * 1.4),
      drift: random(-config.drift, config.drift),
      phase: random(0, Math.PI * 2),
      wobble: random(0.2, 1.2),
      length: random(8, 23)
    };
    if (config.kind === "mote") {
      particle.y = Math.random() * this.height;
      particle.speed = random(4, 15);
      particle.drift = random(-8, 8);
    }
    if (config.kind === "spray") {
      particle.y = Math.random() * this.height * 0.65 + this.height * 0.15;
      particle.speed = random(5, 14);
      particle.drift = random(8, 28);
    }
    return particle;
  }

  #tick(time) {
    if (!this.running) return;
    if (!this.lastFrame) this.lastFrame = time;
    const delta = clamp((time - this.lastFrame) / 1000, 0, 0.05);
    this.lastFrame = time;
    const config = MODES[this.mode];
    if (!config || this.mode === "none") {
      this.stop();
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const particle of this.particles) {
      this.#updateParticle(particle, delta, config);
      this.#drawParticle(particle, config);
    }
    this.raf = requestAnimationFrame((nextTime) => this.#tick(nextTime));
  }

  #updateParticle(particle, delta, config) {
    particle.phase += delta * particle.wobble;
    switch (config.kind) {
      case "rain":
        particle.x += particle.drift * delta * 28 + Math.sin(particle.phase) * 0.12;
        particle.y += particle.speed * delta * 60;
        if (particle.y > this.height + 30) {
          Object.assign(particle, this.#makeParticle(config, false));
          particle.x = Math.random() * this.width;
          particle.y = -20;
        }
        if (particle.x > this.width + 20) particle.x = -20;
        break;
      case "spray":
        particle.x += particle.speed * delta * 4 + Math.sin(particle.phase) * 0.14;
        particle.y += Math.sin(particle.phase * 0.8) * delta * 2;
        if (particle.x > this.width + 20) {
          Object.assign(particle, this.#makeParticle(config, false));
          particle.x = -10;
          particle.y = this.height * (0.15 + Math.random() * 0.65);
        }
        break;
      case "mote":
      default:
        particle.x += particle.drift * delta + Math.sin(particle.phase) * 0.08;
        particle.y -= particle.speed * delta;
        if (particle.y < -15 || particle.x < -20 || particle.x > this.width + 20) {
          Object.assign(particle, this.#makeParticle(config, false));
          particle.y = this.height + 10;
          particle.x = Math.random() * this.width;
        }
        break;
    }
  }

  #drawParticle(particle, config) {
    const { ctx } = this;
    const flicker = 0.72 + Math.sin(particle.phase * 0.75) * 0.28;
    const alpha = particle.baseAlpha * flicker;
    ctx.save();
    ctx.fillStyle = `rgba(${config.colour}, ${alpha})`;
    if (config.kind === "rain") {
      ctx.strokeStyle = `rgba(${config.colour}, ${alpha})`;
      ctx.lineWidth = particle.size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x - particle.drift * 2.2, particle.y + particle.length);
      ctx.stroke();
    } else if (config.kind === "spray") {
      ctx.beginPath();
      ctx.ellipse(particle.x, particle.y, particle.size * 1.6, particle.size * 0.65, 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3);
      gradient.addColorStop(0, `rgba(${config.colour}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${config.colour}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  #drawStatic() {
    if (!this.ctx) return;
    const config = MODES[this.mode];
    if (!config || !this.particles.length) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const particle of this.particles) {
      this.#drawParticle(particle, config);
    }
  }

  destroy() {
    this.stop();
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
}
