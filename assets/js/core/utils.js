export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatDate(timestamp, style = "long") {
  if (!timestamp) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: style === "short" ? "short" : "long",
      year: "numeric",
      hour: style === "short" ? undefined : "2-digit",
      minute: style === "short" ? undefined : "2-digit"
    }).format(new Date(timestamp));
  } catch {
    return "";
  }
}

export function formatPlayTime(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(total / 60);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours > 0) return `${hours} h ${String(rest).padStart(2, "0")}`;
  return `${minutes} min`;
}

export function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function isEditableTarget(target) {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return ["input", "textarea", "select", "button", "a"].includes(tag) || target.isContentEditable;
}

export function createId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export class Emitter {
  #listeners = new Map();

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.#listeners.get(event)?.delete(handler);
  }

  emit(event, detail) {
    this.#listeners.get(event)?.forEach((handler) => {
      try {
        handler(detail);
      } catch (error) {
        console.error(`Erreur dans l'événement ${event}`, error);
      }
    });
  }
}

export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
