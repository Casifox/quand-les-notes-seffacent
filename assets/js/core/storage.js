import { clamp } from "./utils.js";

export const SAVE_VERSION = 1;
export const SLOT_COUNT = 3;
const SAVE_PREFIX = "qlnse.save.v1.";
const SETTINGS_KEY = "qlnse.settings.v1";

export const DEFAULT_SETTINGS = {
  version: 1,
  music: 0.6,
  piano: 0.78,
  ambience: 0.38,
  muted: false,
  speed: "normal",
  reducedMotion: false,
  noteLabels: true
};

const VALID_SPEEDS = new Set(["slow", "normal", "fast", "instant"]);

class SafeStorage {
  constructor() {
    this.available = true;
    this.memory = new Map();
    try {
      const test = "__qlnse_test__";
      window.localStorage.setItem(test, "1");
      window.localStorage.removeItem(test);
    } catch {
      this.available = false;
      console.warn("Le stockage local est indisponible : la sauvegarde ne survivra pas à la fermeture de l'onglet.");
    }
  }

  getItem(key) {
    try {
      return this.available ? window.localStorage.getItem(key) : this.memory.get(key) ?? null;
    } catch {
      return this.memory.get(key) ?? null;
    }
  }

  setItem(key, value) {
    try {
      if (this.available) {
        window.localStorage.setItem(key, value);
      } else {
        this.memory.set(key, value);
      }
      return true;
    } catch (error) {
      this.memory.set(key, value);
      this.available = false;
      console.warn("Sauvegarde locale impossible.", error);
      return false;
    }
  }

  removeItem(key) {
    try {
      if (this.available) window.localStorage.removeItem(key);
    } catch {
      // silencieux
    }
    this.memory.delete(key);
  }

  keys() {
    const keys = new Set(this.memory.keys());
    if (this.available) {
      try {
        for (let index = 0; index < window.localStorage.length; index += 1) {
          const key = window.localStorage.key(index);
          if (key) keys.add(key);
        }
      } catch {
        // silencieux
      }
    }
    return [...keys];
  }
}

const safeStorage = new SafeStorage();

export class SaveStore {
  constructor() {
    this.lastError = null;
  }

  key(slot) {
    return `${SAVE_PREFIX}${slot}`;
  }

  createState(slot) {
    const now = Date.now();
    return {
      version: SAVE_VERSION,
      slot,
      createdAt: now,
      updatedAt: now,
      playTime: 0,
      chapterId: "prologue",
      pageIndex: 0,
      flags: {},
      memories: [],
      seenIntros: [],
      ending: null,
      finished: false,
      scene: null
    };
  }

  save(state) {
    if (!state || !Number.isInteger(state.slot) || state.slot < 0 || state.slot >= SLOT_COUNT) {
      this.lastError = "Carnet invalide.";
      return false;
    }
    const now = Date.now();
    state.updatedAt = now;
    const record = {
      ...state,
      version: SAVE_VERSION,
      updatedAt: now
    };
    const ok = safeStorage.setItem(this.key(state.slot), JSON.stringify(record));
    this.lastError = ok ? null : "Impossible d'écrire la sauvegarde dans ce navigateur.";
    return ok;
  }

  load(slot) {
    if (!Number.isInteger(slot)) return null;
    const raw = safeStorage.getItem(this.key(slot));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const state = this.#sanitize(parsed, slot);
      if (!state) {
        this.#quarantineCorrupt(slot, raw);
        return null;
      }
      return state;
    } catch (error) {
      this.#quarantineCorrupt(slot, raw);
      console.warn("Sauvegarde illisible : une copie de secours a été conservée.", error);
      return null;
    }
  }

  #quarantineCorrupt(slot, raw) {
    if (!raw) return;
    const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
    const backupKey = `${SAVE_PREFIX}${slot}.corrupt.${stamp}`;
    const saved = safeStorage.setItem(backupKey, raw);
    if (saved) {
      safeStorage.removeItem(this.key(slot));
      this.lastError = "Cette sauvegarde était illisible. Une copie de secours a été conservée.";
      console.warn("Sauvegarde invalide : copie de secours conservée dans localStorage.");
    } else {
      this.lastError = "Cette sauvegarde est illisible et n'a pas pu être copiée.";
    }
  }

  #sanitize(state, slot) {
    if (!state || typeof state !== "object" || Array.isArray(state)) return null;
    if (state.version !== SAVE_VERSION) return null;
    if (typeof state.chapterId !== "string" || !state.chapterId) return null;
    const base = this.createState(slot);
    return {
      version: SAVE_VERSION,
      slot,
      createdAt: Number.isFinite(state.createdAt) ? Number(state.createdAt) : base.createdAt,
      updatedAt: Number.isFinite(state.updatedAt) ? Number(state.updatedAt) : base.updatedAt,
      playTime: Math.max(0, Number(state.playTime) || 0),
      chapterId: state.chapterId,
      pageIndex: Math.max(0, Math.floor(Number(state.pageIndex) || 0)),
      flags: state.flags && typeof state.flags === "object" && !Array.isArray(state.flags) ? state.flags : {},
      memories: Array.isArray(state.memories) ? state.memories.filter((id) => typeof id === "string") : [],
      seenIntros: Array.isArray(state.seenIntros) ? state.seenIntros.filter((id) => typeof id === "string") : [],
      ending: typeof state.ending === "string" ? state.ending : null,
      finished: Boolean(state.finished),
      scene: this.#sanitizeScene(state.scene)
    };
  }

  #sanitizeScene(scene) {
    if (!scene || typeof scene !== "object" || Array.isArray(scene)) return null;
    const text = (value) => (typeof value === "string" ? value : null);
    return {
      chapterId: text(scene.chapterId),
      bg: text(scene.bg),
      tone: text(scene.tone),
      weather: text(scene.weather),
      fx: text(scene.fx),
      location: text(scene.location),
      music: text(scene.music),
      ambience: text(scene.ambience)
    };
  }

  delete(slot) {
    safeStorage.removeItem(this.key(slot));
  }

  clearAll() {
    for (let slot = 0; slot < SLOT_COUNT; slot += 1) this.delete(slot);
    safeStorage.keys()
      .filter((key) => key.startsWith(SAVE_PREFIX) && key.includes(".corrupt."))
      .forEach((key) => safeStorage.removeItem(key));
  }

  list() {
    return Array.from({ length: SLOT_COUNT }, (_, slot) => {
      const state = this.load(slot);
      return {
        slot,
        state,
        occupied: Boolean(state)
      };
    });
  }

  latest() {
    const states = this.list()
      .map(({ state }) => state)
      .filter(Boolean)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return states[0] ?? null;
  }

  hasAny() {
    return this.list().some((entry) => entry.occupied);
  }

  firstAvailableSlot() {
    const empty = this.list().find((entry) => !entry.occupied);
    return empty ? empty.slot : 0;
  }

  get storageAvailable() {
    return safeStorage.available;
  }
}

export class SettingsStore {
  load() {
    const raw = safeStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    try {
      return this.#sanitize(JSON.parse(raw));
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  #sanitize(value) {
    const settings = { ...DEFAULT_SETTINGS, ...(value && typeof value === "object" ? value : {}) };
    return {
      version: 1,
      music: clamp(Number(settings.music) || 0, 0, 1),
      piano: clamp(Number(settings.piano) || 0, 0, 1),
      ambience: clamp(Number(settings.ambience) || 0, 0, 1),
      muted: Boolean(settings.muted),
      speed: VALID_SPEEDS.has(settings.speed) ? settings.speed : "normal",
      reducedMotion: Boolean(settings.reducedMotion),
      noteLabels: settings.noteLabels !== false
    };
  }

  save(settings) {
    const sanitized = this.#sanitize(settings);
    safeStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitized));
    return sanitized;
  }

  reset() {
    safeStorage.removeItem(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS };
  }
}

export const saveStore = new SaveStore();
export const settingsStore = new SettingsStore();
