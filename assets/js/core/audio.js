import { TRACKS } from "../data/music.js";
import { frequencyFromNote } from "./notes.js";
import { clamp } from "./utils.js";

const AMBIENCE_LEVELS = {
  room: 0.18,
  sea: 0.52,
  rain: 0.55,
  storm: 0.76,
  hall: 0.3,
  wind: 0.46
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.failed = false;
    this.settings = {
      music: 0.55,
      piano: 0.78,
      ambience: 0.38,
      muted: false
    };
    this.pendingMusic = null;
    this.pendingAmbience = null;
    this.currentMusic = null;
    this.currentAmbience = null;
    this.phraseToken = 0;
    this.noiseBuffer = null;
    this.startPromise = null;
    this.masterTarget = 1;
  }

  async start() {
    if (this.failed) return false;
    if (this.ready) {
      if (this.ctx?.state === "suspended") {
        try { await this.ctx.resume(); } catch { /* silent */ }
      }
      return true;
    }
    if (this.startPromise) return this.startPromise;

    this.startPromise = this.#createContext();
    const result = await this.startPromise;
    this.startPromise = null;
    return result;
  }

  async #createContext() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      this.failed = true;
      console.warn("Web Audio API indisponible : le jeu continuera sans son.");
      return false;
    }
    try {
      this.ctx = new Context({ latencyHint: "interactive" });
      await this.ctx.resume();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0001;
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 20;
      this.compressor.ratio.value = 3.5;
      this.compressor.attack.value = 0.004;
      this.compressor.release.value = 0.28;
      this.master.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      this.musicBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.ambienceBus = this.ctx.createGain();
      this.musicBus.connect(this.master);
      this.sfxBus.connect(this.master);
      this.ambienceBus.connect(this.master);

      this.musicReverb = this.ctx.createConvolver();
      this.musicReverb.buffer = this.#createImpulse(2.9, 3.4);
      this.musicReverbSend = this.ctx.createGain();
      this.musicReverbReturn = this.ctx.createGain();
      this.musicReverbSend.gain.value = 0.36;
      this.musicReverbReturn.gain.value = 0.32;
      this.musicReverbSend.connect(this.musicReverb);
      this.musicReverb.connect(this.musicReverbReturn);
      this.musicReverbReturn.connect(this.master);

      this.sfxReverb = this.ctx.createConvolver();
      this.sfxReverb.buffer = this.#createImpulse(2.4, 2.8);
      this.sfxReverbSend = this.ctx.createGain();
      this.sfxReverbReturn = this.ctx.createGain();
      this.sfxReverbSend.gain.value = 0.3;
      this.sfxReverbReturn.gain.value = 0.27;
      this.sfxReverbSend.connect(this.sfxReverb);
      this.sfxReverb.connect(this.sfxReverbReturn);
      this.sfxReverbReturn.connect(this.master);

      this.noiseBuffer = this.#createNoiseBuffer(4, true);
      this.ready = true;
      this.#applyVolumes(true);

      if (this.pendingMusic) {
        const id = this.pendingMusic;
        this.pendingMusic = null;
        this.playMusic(id, { fade: 1.5 });
      }
      if (this.pendingAmbience) {
        const id = this.pendingAmbience;
        this.pendingAmbience = null;
        this.setAmbience(id);
      }
      return true;
    } catch (error) {
      this.failed = true;
      console.warn("Impossible de démarrer l'audio.", error);
      return false;
    }
  }

  #createImpulse(seconds, decay) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const impulse = this.ctx.createBuffer(2, length, rate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = impulse.getChannelData(channel);
      let previous = 0;
      for (let i = 0; i < length; i += 1) {
        const noise = Math.random() * 2 - 1;
        previous = previous * 0.62 + noise * 0.38;
        data[i] = previous * (1 - i / length) ** decay;
      }
    }
    return impulse;
  }

  #createNoiseBuffer(seconds, stereo = false) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const buffer = this.ctx.createBuffer(stereo ? 2 : 1, length, rate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      let previous = 0;
      for (let i = 0; i < length; i += 1) {
        const white = Math.random() * 2 - 1;
        previous = previous * 0.32 + white * 0.68;
        data[i] = previous;
      }
    }
    return buffer;
  }

  #applyVolumes(immediate = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const time = immediate ? 0.015 : 0.15;
    const set = (param, value) => {
      param.cancelScheduledValues(now);
      param.setTargetAtTime(Math.max(0.0001, value), now, time);
    };
    set(this.musicBus.gain, this.settings.music * 1.25);
    set(this.sfxBus.gain, this.settings.piano * 1.15);
    set(this.ambienceBus.gain, this.settings.ambience * 0.7);
    set(this.musicReverbSend.gain, this.settings.music * 0.7);
    set(this.sfxReverbSend.gain, this.settings.piano * 0.55);
    set(this.master.gain, this.settings.muted ? 0.0001 : this.masterTarget);
  }

  updateSettings(settings) {
    const wasMuted = this.settings.muted;
    this.settings = { ...this.settings, ...settings };
    if (this.ready) this.#applyVolumes(false);
    if (wasMuted && !this.settings.muted) this.start();
  }

  async toggleMuted() {
    this.settings.muted = !this.settings.muted;
    if (!this.settings.muted) await this.start();
    if (this.ready) this.#applyVolumes(false);
    if (!this.settings.muted && this.pendingMusic && this.ready) {
      const id = this.pendingMusic;
      this.pendingMusic = null;
      this.playMusic(id, { fade: 1.4 });
    }
    return this.settings.muted;
  }

  async setMuted(muted) {
    this.settings.muted = Boolean(muted);
    if (!this.settings.muted) await this.start();
    if (this.ready) this.#applyVolumes(false);
    if (!this.settings.muted && this.pendingMusic && this.ready) {
      const id = this.pendingMusic;
      this.pendingMusic = null;
      this.playMusic(id, { fade: 1.4 });
    }
    return this.settings.muted;
  }

  /* ------------------------------------------------------------------ */
  /* Piano interactif                                                   */
  /* ------------------------------------------------------------------ */

  playNote(note, options = {}) {
    if (!this.ready || this.settings.muted) return;
    const {
      velocity = 0.64,
      duration = 2.3,
      when = this.ctx.currentTime + 0.012,
      pan
    } = options;
    const voice = this.ctx.createGain();
    voice.gain.value = 1;
    const panner = this.#makePanner(pan ?? this.#panForNote(note));
    voice.connect(panner);
    panner.connect(this.sfxBus);
    const send = this.ctx.createGain();
    send.gain.value = 0.42;
    panner.connect(send);
    send.connect(this.sfxReverbSend);
    this.#schedulePianoVoice(note, when, duration, velocity, voice);
  }

  playChord(notes, options = {}) {
    const { spread = 0.03, velocity = 0.5, duration = 2.8 } = options;
    const now = this.ctx?.currentTime ?? 0;
    notes.forEach((note, index) => {
      this.playNote(note, {
        velocity,
        duration,
        when: now + 0.015 + index * spread
      });
    });
  }

  /**
   * Joue une phrase et renvoie une promesse. Le jeton permet d'interrompre
   * proprement l'écoute lorsqu'on quitte la scène.
   */
  playPhrase(notes, options = {}) {
    if (!this.ready || this.settings.muted) return Promise.resolve();
    const {
      noteMs = 560,
      velocity = 0.55,
      duration = 1.9,
      onNote,
      onEnd
    } = options;
    this.phraseToken += 1;
    const token = this.phraseToken;
    const timers = [];

    return new Promise((resolve) => {
      notes.forEach((note, index) => {
        const timer = window.setTimeout(() => {
          if (this.phraseToken !== token) return;
          this.playNote(note, { velocity, duration });
          onNote?.(note, index);
        }, index * noteMs);
        timers.push(timer);
      });
      const endTimer = window.setTimeout(() => {
        if (this.phraseToken !== token) return;
        onEnd?.();
        resolve();
      }, Math.max(180, notes.length * noteMs));
      timers.push(endTimer);
      this.currentPhraseTimers = timers;
    });
  }

  stopPhrase() {
    this.phraseToken += 1;
    if (this.currentPhraseTimers) {
      this.currentPhraseTimers.forEach((timer) => clearTimeout(timer));
      this.currentPhraseTimers = null;
    }
  }

  playMemoryChime() {
    if (!this.ready || this.settings.muted) return;
    const now = this.ctx.currentTime + 0.02;
    ["A4", "C5", "E5", "A5"].forEach((note, index) => {
      this.playNote(note, {
        velocity: 0.22 + index * 0.025,
        duration: 2.5,
        when: now + index * 0.16,
        pan: 0.05
      });
    });
  }

  #panForNote(note) {
    const match = /-?\d+$/.exec(note);
    const octave = match ? Number(match[0]) : 4;
    return clamp((octave - 4.5) * 0.12, -0.35, 0.35);
  }

  #makePanner(pan = 0) {
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = clamp(pan, -1, 1);
      return panner;
    }
    return this.ctx.createGain();
  }

  #schedulePianoVoice(note, when, duration, velocity, output) {
    if (!this.ctx) return;
    const frequency = frequencyFromNote(note);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(clamp(frequency * 8 + 1300, 1600, 12500), when);
    filter.Q.value = 0.35;

    const envelope = this.ctx.createGain();
    const peak = Math.max(0.002, velocity * 0.42);
    const sustain = Math.max(0.36, Math.min(duration, 5.2));
    envelope.gain.setValueAtTime(0.0001, when);
    envelope.gain.linearRampToValueAtTime(peak, when + 0.006);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * 0.34), when + 0.15);
    envelope.gain.exponentialRampToValueAtTime(0.0001, when + sustain);

    filter.connect(envelope);
    envelope.connect(output);

    const partialCount = frequency < 220 ? 6 : frequency < 640 ? 5 : 3;
    const amplitudes = [1, 0.43, 0.24, 0.12, 0.065, 0.032];
    for (let partial = 1; partial <= partialCount; partial += 1) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const inharmonicity = 0.00045;
      const ratio = partial * Math.sqrt(1 + inharmonicity * partial * partial);
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency * ratio, when);
      gain.gain.value = amplitudes[partial - 1] * 0.26;
      osc.connect(gain);
      gain.connect(filter);
      osc.start(when);
      osc.stop(when + sustain + 0.08);
    }

    if (this.noiseBuffer) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;
      source.loop = false;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = clamp(frequency * 2.1, 1100, 4200);
      noiseFilter.Q.value = 1.1;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.028 * velocity, when);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
      source.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(filter);
      source.start(when, Math.random() * 2, 0.09);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Musique                                                            */
  /* ------------------------------------------------------------------ */

  playMusic(trackId, options = {}) {
    const { fade = 2.3 } = options;
    if (!trackId) {
      this.stopMusic(fade);
      return;
    }
    if (!this.ready) {
      this.pendingMusic = trackId;
      return;
    }
    if (this.currentMusic?.id === trackId) return;

    const track = TRACKS[trackId];
    if (!track) {
      console.warn(`Piste inconnue : ${trackId}`);
      return;
    }

    this.stopMusic(fade * 0.75);

    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    const wet = this.ctx.createGain();
    wet.gain.value = 0.26;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(track.volume ?? 0.8, now + fade);
    gain.connect(this.musicBus);
    gain.connect(wet);
    wet.connect(this.musicReverbSend);

    const state = {
      id: trackId,
      track,
      gain,
      wet,
      beatDuration: 60 / track.bpm,
      loopDuration: track.beats * (60 / track.bpm),
      nextLoopTime: now + 0.25,
      eventIndex: 0,
      events: [...track.events].sort((a, b) => a.beat - b.beat),
      timer: null,
      stopped: false
    };

    this.currentMusic = state;
    this.#tickMusic();
    state.timer = window.setInterval(() => this.#tickMusic(), 240);
  }

  #tickMusic() {
    const state = this.currentMusic;
    if (!state || state.stopped || !this.ready) return;
    const now = this.ctx.currentTime;
    const lookahead = 1.4;

    // Rattrapage après un onglet en arrière-plan ou une longue pause.
    if (state.nextLoopTime + state.loopDuration < now - 0.5) {
      state.nextLoopTime = now + 0.12;
      state.eventIndex = 0;
    }

    const events = state.events;
    let guard = 0;
    while (guard < 500) {
      guard += 1;
      if (state.eventIndex >= events.length) {
        state.nextLoopTime += state.loopDuration;
        state.eventIndex = 0;
        if (state.nextLoopTime > now + 2.5) break;
        continue;
      }
      const event = events[state.eventIndex];
      const when = state.nextLoopTime + event.beat * state.beatDuration;
      if (when > now + lookahead) break;
      if (when >= now - 0.25) {
        this.#scheduleMusicEvent(event, when, state);
      }
      state.eventIndex += 1;
    }
  }

  #scheduleMusicEvent(event, when, state) {
    const duration = Math.max(0.12, event.duration * state.beatDuration);
    const velocity = event.velocity ?? 0.2;
    switch (event.instrument) {
      case "piano":
        this.#scheduleMusicPiano(event.note, when, duration, velocity, state.gain);
        break;
      case "pad":
        this.#schedulePadVoice(event.note, when, duration, velocity, state.gain);
        break;
      case "bass":
        this.#scheduleBassVoice(event.note, when, duration, velocity, state.gain);
        break;
      case "bell":
        this.#scheduleBellVoice(event.note, when, duration, velocity, state.gain);
        break;
      default:
        break;
    }
  }

  #scheduleMusicPiano(note, when, duration, velocity, destination) {
    const voice = this.ctx.createGain();
    voice.gain.value = 1;
    const panner = this.#makePanner(this.#panForNote(note) * 0.45);
    voice.connect(panner);
    panner.connect(destination);
    this.#schedulePianoVoice(note, when, Math.min(duration + 0.8, 5.6), velocity, voice);
  }

  #schedulePadVoice(note, when, duration, velocity, destination) {
    const frequency = frequencyFromNote(note);
    const output = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(clamp(frequency * 5, 420, 1800), when);
    filter.Q.value = 0.25;
    const panner = this.#makePanner(clamp((frequency - 220) / 1500, -0.45, 0.45));
    const peak = Math.max(0.002, velocity * 0.22);
    const attack = Math.min(1.8, Math.max(0.6, duration * 0.28));
    const release = Math.min(4, Math.max(1, duration * 0.45));
    output.gain.setValueAtTime(0.0001, when);
    output.gain.linearRampToValueAtTime(peak, when + attack);
    output.gain.setTargetAtTime(0.0001, when + Math.max(attack + 0.2, duration - release), Math.max(0.4, release * 0.3));
    output.connect(filter);
    filter.connect(panner);
    panner.connect(destination);

    const variants = [
      { type: "sine", detune: -4, level: 0.6 },
      { type: "triangle", detune: 4, level: 0.25 }
    ];
    variants.forEach(({ type, detune, level }) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, when);
      osc.detune.setValueAtTime(detune, when);
      g.gain.value = level;
      osc.connect(g);
      g.connect(output);
      osc.start(when);
      osc.stop(when + duration + release + 0.2);
    });
  }

  #scheduleBassVoice(note, when, duration, velocity, destination) {
    const frequency = frequencyFromNote(note);
    const output = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(clamp(frequency * 6, 150, 600), when);
    filter.Q.value = 0.2;
    const peak = Math.max(0.003, velocity * 0.34);
    output.gain.setValueAtTime(0.0001, when);
    output.gain.linearRampToValueAtTime(peak, when + 0.07);
    output.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(0.8, duration));
    output.connect(filter);
    filter.connect(destination);

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    osc2.type = "triangle";
    osc2.frequency.value = frequency;
    gain2.gain.value = 0.2;
    osc.connect(output);
    osc2.connect(gain2);
    gain2.connect(output);
    osc.start(when);
    osc2.start(when);
    osc.stop(when + duration + 0.15);
    osc2.stop(when + duration + 0.15);
  }

  #scheduleBellVoice(note, when, duration, velocity, destination) {
    const frequency = frequencyFromNote(note);
    const output = this.ctx.createGain();
    const panner = this.#makePanner(0.25);
    output.connect(panner);
    panner.connect(destination);
    const peak = Math.max(0.0018, velocity * 0.24);
    output.gain.setValueAtTime(0.0001, when);
    output.gain.linearRampToValueAtTime(peak, when + 0.01);
    output.gain.exponentialRampToValueAtTime(0.0001, when + Math.min(3.5, Math.max(1, duration)));
    [1, 2.01, 3.02].forEach((ratio, index) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency * ratio;
      g.gain.value = [1, 0.35, 0.17][index];
      osc.connect(g);
      g.connect(output);
      osc.start(when);
      osc.stop(when + Math.min(3.6, Math.max(1.1, duration)) + 0.1);
    });
  }

  stopMusic(fade = 1.6) {
    const current = this.currentMusic;
    this.currentMusic = null;
    if (!current || !this.ctx) return;
    current.stopped = true;
    window.clearInterval(current.timer);
    const now = this.ctx.currentTime;
    const end = now + fade;
    try {
      current.gain.gain.cancelScheduledValues(now);
      current.gain.gain.setValueAtTime(current.gain.gain.value, now);
      current.gain.gain.exponentialRampToValueAtTime(0.0001, end);
      current.wet.gain.cancelScheduledValues(now);
      current.wet.gain.setValueAtTime(current.wet.gain.value, now);
      current.wet.gain.exponentialRampToValueAtTime(0.0001, end);
    } catch {
      // Le contexte peut être fermé par le navigateur.
    }
    window.setTimeout(() => {
      try {
        current.gain.disconnect();
        current.wet.disconnect();
      } catch { /* déjà déconnecté */ }
    }, Math.ceil((fade + 0.2) * 1000));
  }

  /* ------------------------------------------------------------------ */
  /* Ambiances                                                          */
  /* ------------------------------------------------------------------ */

  setAmbience(type) {
    const next = type || null;
    if (!this.ready) {
      this.pendingAmbience = next;
      return;
    }
    if (this.currentAmbience?.type === next) return;
    this.#fadeOutAmbience(this.currentAmbience, 1.6);
    this.currentAmbience = null;
    if (!next) return;
    this.currentAmbience = this.#createAmbience(next);
  }

  #fadeOutAmbience(ambience, time = 1.4) {
    if (!ambience || !this.ctx) return;
    ambience.stopped = true;
    const now = this.ctx.currentTime;
    try {
      ambience.gain.gain.cancelScheduledValues(now);
      ambience.gain.gain.setValueAtTime(ambience.gain.gain.value, now);
      ambience.gain.gain.linearRampToValueAtTime(0.0001, now + time);
    } catch { /* silent */ }
    window.setTimeout(() => {
      ambience.sources.forEach((source) => {
        try { source.stop(); } catch { /* already stopped */ }
      });
      try { ambience.gain.disconnect(); } catch { /* silent */ }
    }, Math.ceil(time * 1000) + 120);
  }

  #createAmbience(type) {
    const level = AMBIENCE_LEVELS[type] ?? 0.25;
    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(level, now + 2.2);
    gain.connect(this.ambienceBus);
    const sources = [];

    const addNoiseLayer = (filterType, frequency, q, layerGain, lfoRate = 0, lfoDepth = 0) => {
      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;
      source.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = frequency;
      filter.Q.value = q;
      const layer = this.ctx.createGain();
      layer.gain.value = layerGain;
      source.connect(filter);
      filter.connect(layer);
      layer.connect(gain);
      if (lfoRate && lfoDepth) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.value = lfoRate;
        lfoGain.gain.value = lfoDepth;
        lfo.connect(lfoGain);
        lfoGain.connect(layer.gain);
        lfo.start(now);
        sources.push(lfo);
      }
      source.start(now, Math.random() * 3);
      sources.push(source);
    };

    switch (type) {
      case "sea":
        addNoiseLayer("lowpass", 620, 0.45, 0.45, 0.075, 0.22);
        addNoiseLayer("lowpass", 280, 0.4, 0.24, 0.042, 0.13);
        break;
      case "rain":
        addNoiseLayer("highpass", 900, 0.4, 0.27, 0.29, 0.025);
        addNoiseLayer("lowpass", 520, 0.25, 0.18);
        break;
      case "storm":
        addNoiseLayer("lowpass", 360, 0.6, 0.43, 0.06, 0.22);
        addNoiseLayer("highpass", 1000, 0.35, 0.27, 0.31, 0.03);
        break;
      case "hall":
        addNoiseLayer("lowpass", 1200, 0.2, 0.12, 0.11, 0.05);
        break;
      case "wind":
        addNoiseLayer("bandpass", 560, 0.55, 0.35, 0.11, 0.26);
        break;
      case "room":
      default:
        addNoiseLayer("lowpass", 190, 0.4, 0.08, 0.05, 0.02);
        break;
    }

    return { type, gain, sources, stopped: false };
  }

  stopAmbience(fade = 1.2) {
    this.#fadeOutAmbience(this.currentAmbience, fade);
    this.currentAmbience = null;
    this.pendingAmbience = null;
  }

  get isMuted() {
    return this.settings.muted;
  }

  get available() {
    return !this.failed;
  }
}

export const audio = new AudioEngine();
