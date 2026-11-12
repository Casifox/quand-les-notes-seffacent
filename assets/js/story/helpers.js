export const n = (text, extra = {}) => ({ who: "narr", text, ...extra });

export const noe = (text, extra = {}) => ({ who: "noe", text, ...extra });

export const e = (text, expr = "neutral", extra = {}) => ({
  who: "elise",
  text,
  expr,
  ...extra
});

export const m = (text, expr = "warm", extra = {}) => ({
  who: "margot",
  text,
  expr,
  ...extra
});

export const l = (text, extra = {}) => ({
  who: "luce",
  text,
  ...extra
});

export const ifFlag = (key, value = true) => (state) => state?.flags?.[key] === value;

export const hasMemory = (memoryId) => (state) =>
  Array.isArray(state?.memories) && state.memories.includes(memoryId);
