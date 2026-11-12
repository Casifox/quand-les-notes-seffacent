import { noteToDiatonicStep, shortFrenchName, frenchNoteName, midiFromNote } from "../core/notes.js";

const STAFF_TOP = 52;
const STAFF_BOTTOM = 132;
const STAFF_GAP = 20;
const E4_STEP = noteToDiatonicStep(64);
const BASE_Y = STAFF_BOTTOM;

function noteY(noteName) {
  const step = noteToDiatonicStep(midiFromNote(noteName));
  return BASE_Y - (step - E4_STEP) * (STAFF_GAP / 2);
}

function normalizeNote(item) {
  if (!item || typeof item !== "object") {
    return { note: item, who: "you", ghost: !item, hidden: false, done: false };
  }
  return {
    note: item.note ?? null,
    who: item.who ?? "you",
    ghost: Boolean(item.ghost || !item.note),
    hidden: Boolean(item.hidden),
    done: Boolean(item.done),
    missing: Boolean(item.missing),
    locked: Boolean(item.locked),
    index: item.index
  };
}

/**
 * Construit la partition visuelle d'une phrase.
 * options :
 *  - showLabels, hidden, currentIndex, completedCount, label, className, noteData
 */
export function staffSVG(notes, options = {}) {
  const {
    showLabels = true,
    hidden = false,
    currentIndex = -1,
    completedCount = 0,
    label = "",
    className = "",
    mini = false
  } = options;

  const items = (notes ?? []).map(normalizeNote);
  const count = Math.max(items.length, 1);
  const available = 740;
  const spacing = count > 1 ? Math.min(94, available / (count - 1)) : 0;
  const startX = 120 + (available - spacing * (count - 1)) / 2;
  const lineStart = 84;
  const lineEnd = 866;

  const lines = Array.from({ length: 5 }, (_, i) => {
    const y = STAFF_TOP + i * STAFF_GAP;
    return `<line class="staff-line" x1="${lineStart}" y1="${y}" x2="${lineEnd}" y2="${y}"/>`;
  }).join("");

  const stems = [];
  const ledgerLines = [];
  const heads = [];
  const labels = [];
  const accents = [];

  items.forEach((item, index) => {
    const x = startX + index * spacing;
    if (item.ghost || !item.note) {
      const y = 92;
      heads.push(`
        <g class="staff-note" data-index="${index}" data-who="${item.who}">
          <circle class="staff-note-head is-ghost${index === currentIndex ? " is-current" : ""}" cx="${x}" cy="${y}" r="8.6"/>
          <text class="staff-note-label${index === currentIndex ? " is-current" : ""}" x="${x}" y="174">?</text>
        </g>`);
      return;
    }

    const y = noteY(item.note);
    if (y > STAFF_BOTTOM + 1) {
      for (let ledgerY = STAFF_BOTTOM + 20; ledgerY <= y + 1; ledgerY += 20) {
        ledgerLines.push(`<line class="staff-ledger" x1="${x - 14}" y1="${ledgerY}" x2="${x + 14}" y2="${ledgerY}"/>`);
      }
    } else if (y < STAFF_TOP - 1) {
      for (let ledgerY = STAFF_TOP - 20; ledgerY >= y - 1; ledgerY -= 20) {
        ledgerLines.push(`<line class="staff-ledger" x1="${x - 14}" y1="${ledgerY}" x2="${x + 14}" y2="${ledgerY}"/>`);
      }
    }

    const stemUp = y >= 92;
    const stemX = stemUp ? x + 8.2 : x - 8.2;
    const stemY2 = stemUp ? y - 36 : y + 36;
    stems.push(`<line x1="${stemX}" y1="${y}" x2="${stemX}" y2="${stemY2}" stroke="currentColor" stroke-width="1.2" opacity=".48"/>`);

    const done = index < completedCount || item.done;
    const current = index === currentIndex;
    const classes = [
      "staff-note-head",
      done ? "is-done" : "",
      current ? "is-current" : "",
      item.who === "elise" ? "is-elise" : "is-you",
      item.missing && !done ? "is-ghost" : "",
      item.hidden ? "is-faded" : ""
    ].filter(Boolean).join(" ");

    heads.push(`
      <g class="staff-note" data-index="${index}" data-who="${item.who}">
        <ellipse class="${classes}" cx="${x}" cy="${y}" rx="8.4" ry="6.1" transform="rotate(-18 ${x} ${y})"/>
        ${!hidden && showLabels ? `<text class="staff-note-label${current ? " is-current" : ""}" x="${x}" y="174">${item.missing && !done ? "?" : shortFrenchName(item.note)}</text>` : ""}
      </g>`);
    if (current) {
      accents.push(`<circle cx="${x}" cy="${Math.max(11, y - 24)}" r="2.1" fill="var(--gold-bright)" opacity=".9"/>`);
    }
    labels.push(`${frenchNoteName(item.note)}${item.who === "elise" ? " par Élise" : ""}`);
  });

  if (!items.length) {
    heads.push(`<text class="staff-empty" x="470" y="97">La partition attend…</text>`);
  }

  const ariaLabel = hidden
    ? "Partition masquée : écoute la mélodie."
    : label
      ? `${label} : ${labels.join(", ")}`
      : `Partition : ${labels.join(", ")}`;

  return `
    <svg class="staff-svg ${className}" viewBox="0 0 900 184" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeAttr(ariaLabel)}">
      <text class="staff-clef" x="34" y="139">𝄞</text>
      <text class="staff-label" x="${lineEnd}" y="28" text-anchor="end">${escapeText(label || (hidden ? "À L'OREILLE" : "PARTITION"))}</text>
      ${lines}
      ${ledgerLines.join("")}
      <line class="staff-divider" x1="${lineEnd}" y1="${STAFF_TOP}" x2="${lineEnd}" y2="${STAFF_BOTTOM}"/>
      ${stems.join("")}
      ${heads.join("")}
      ${accents.join("")}
      ${!hidden && showLabels ? `${""}` : ""}
    </svg>`;
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeText(value).replaceAll('"', "&quot;");
}

export function memoryIcon(iconName, iconMap) {
  return iconMap[iconName] ?? iconMap.letter ?? "";
}
