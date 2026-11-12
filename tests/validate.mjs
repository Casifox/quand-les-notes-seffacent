#!/usr/bin/env node
/**
 * Validation statique du projet, sans dépendance.
 * Exécution (Node.js 20+) :
 *   npm test
 *   node tests/validate.mjs
 */
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CHAPTERS, EPILOGUES, ENDING_CHAPTER, getChapter, resolveLines } from "../assets/js/story/index.js";
import { PUZZLES } from "../assets/js/data/puzzles.js";
import { MEMORIES, MEMORY_ICONS } from "../assets/js/data/memories.js";
import { ENDINGS } from "../assets/js/data/endings.js";
import { TRACKS } from "../assets/js/data/music.js";
import { parseNote } from "../assets/js/core/notes.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
let checks = 0;

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const ok = (condition, message) => {
  checks += 1;
  if (!condition) fail(message);
};
const pathExists = async (relative) => {
  try {
    await access(path.join(ROOT, relative), constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const backgrounds = new Set();
const pageIds = new Set();
const chapterIds = new Set();
const usedPuzzles = new Map();
const speakers = new Set(["narr", "noe", "elise", "margot", "luce"]);
const ambiences = new Set(["room", "sea", "rain", "storm", "hall", "wind"]);
const tones = new Set(["day", "dawn", "dusk", "warm", "night", "storm"]);
const expressions = {
  elise: new Set(["neutral", "soft", "smile", "laugh", "sad", "distant", "worried", "angry", "tired", "surprised", "afraid", "determined", "relieved"]),
  margot: new Set(["neutral", "warm", "playful", "worried", "sad", "soft", "surprised"])
};

for (const chapter of CHAPTERS) {
  ok(Boolean(chapter.id), "Chapitre sans identifiant.");
  ok(!chapterIds.has(chapter.id), `Identifiant de chapitre dupliqué : ${chapter.id}`);
  chapterIds.add(chapter.id);
  ok(Array.isArray(chapter.pages) && chapter.pages.length > 0, `Chapitre vide : ${chapter.id}`);
  ok(tones.has(chapter.tone ?? "day"), `Tonalité inconnue dans ${chapter.id} : ${chapter.tone}`);
  if (chapter.music) ok(Boolean(TRACKS[chapter.music]), `Musique inconnue dans ${chapter.id} : ${chapter.music}`);
  if (chapter.ambience) ok(ambiences.has(chapter.ambience), `Ambiance inconnue dans ${chapter.id} : ${chapter.ambience}`);
  if (chapter.bg) backgrounds.add(chapter.bg);

  let pianoPages = 0;
  chapter.pages.forEach((page, index) => {
    const where = `${chapter.id}[${index}]`;
    ok(Boolean(page.id), `Page sans identifiant dans ${where}.`);
    ok(!pageIds.has(page.id), `Identifiant de page dupliqué : ${page.id}`);
    pageIds.add(page.id);
    if (page.bg) backgrounds.add(page.bg);
    if (page.music !== undefined && page.music !== null) {
      ok(Boolean(TRACKS[page.music]), `Musique inconnue dans ${where} : ${page.music}`);
    }
    if (page.ambience) ok(ambiences.has(page.ambience), `Ambiance inconnue dans ${where} : ${page.ambience}`);
    if (page.tone) ok(tones.has(page.tone), `Tonalité inconnue dans ${where} : ${page.tone}`);

    if (page.kind === "piano") {
      pianoPages += 1;
      ok(Boolean(page.puzzleId), `Page piano sans puzzle : ${where}`);
      const puzzle = PUZZLES[page.puzzleId];
      ok(Boolean(puzzle), `Puzzle inconnu dans ${where} : ${page.puzzleId}`);
      if (puzzle) {
        usedPuzzles.set(puzzle.id, (usedPuzzles.get(puzzle.id) ?? 0) + 1);
        ok(Boolean(MEMORIES.find((memory) => memory.id === puzzle.memoryId)), `Souvenir inconnu pour le puzzle ${puzzle.id}.`);
      }
      return;
    }

    const lines = resolveLines(page, { flags: {}, memories: [] });
    ok(Array.isArray(page.lines) && page.lines.length > 0, `Page sans dialogue : ${where}`);
    ok(lines.length > 0, `Toutes les répliques sont conditionnelles et fausses : ${where}`);
    lines.forEach((line, lineIndex) => {
      ok(speakers.has(line.who), `Locuteur inconnu dans ${where}, ligne ${lineIndex} : ${line.who}`);
      ok(typeof line.text === "string" && line.text.trim().length > 0, `Réplique vide dans ${where}, ligne ${lineIndex}.`);
      if (line.expr) {
        const who = line.who === "margot" ? "margot" : "elise";
        ok(expressions[who].has(line.expr), `Expression inconnue dans ${where} : ${line.expr}`);
      }
    });
    if (page.choices) {
      ok(Array.isArray(page.choices) && page.choices.length > 0, `Choix vides dans ${where}.`);
      page.choices.forEach((choice, choiceIndex) => {
        ok(typeof choice.text === "string" && choice.text.trim().length > 0, `Choix sans texte dans ${where}[${choiceIndex}].`);
        ok(choice.set === undefined || (choice.set && typeof choice.set === "object"), `Choix sans effets valides dans ${where}[${choiceIndex}].`);
        if (choice.ending) {
          ok(Boolean(ENDINGS[choice.ending]), `Fin inconnue dans ${where} : ${choice.ending}`);
          ok(Boolean(ENDING_CHAPTER[choice.ending]), `Chapitre de fin manquant : ${choice.ending}`);
          ok(Boolean(getChapter(ENDING_CHAPTER[choice.ending])?.epilogue), `Le chapitre ${ENDING_CHAPTER[choice.ending]} doit être un épilogue.`);
        }
      });
    }
  });
  const expected = chapter.id.startsWith("day") ? 1 : 0;
  ok(pianoPages === expected, `${chapter.id} devrait contenir ${expected} page(s) de piano, en contient ${pianoPages}.`);
  if (chapter.id.startsWith("day")) {
    ok(chapter.pages.some((page) => page.kind === "piano"), `Aucun piano dans ${chapter.id}.`);
  }
}

for (const chapter of EPILOGUES) {
  ok(Boolean(chapter.id), "Épilogue sans identifiant.");
  ok(!chapterIds.has(chapter.id), `Identifiant d'épilogue dupliqué : ${chapter.id}`);
  chapterIds.add(chapter.id);
  ok(chapter.epilogue === true, `L'épilogue ${chapter.id} n'est pas marqué epilogue.`);
  ok(Array.isArray(chapter.pages) && chapter.pages.length > 1, `Épilogue trop court : ${chapter.id}`);
  if (chapter.bg) backgrounds.add(chapter.bg);
  chapter.pages.forEach((page, index) => {
    const where = `${chapter.id}[${index}]`;
    ok(Boolean(page.id), `Page sans identifiant dans ${where}.`);
    ok(!pageIds.has(page.id), `Identifiant de page dupliqué : ${page.id}`);
    pageIds.add(page.id);
    if (page.bg) backgrounds.add(page.bg);
    if (page.music !== undefined && page.music !== null) {
      ok(Boolean(TRACKS[page.music]), `Musique inconnue dans ${where} : ${page.music}`);
    }
    if (page.ambience) ok(ambiences.has(page.ambience), `Ambiance inconnue dans ${where} : ${page.ambience}`);
    if (page.tone) ok(tones.has(page.tone), `Tonalité inconnue dans ${where} : ${page.tone}`);
    ok(Array.isArray(page.lines) && page.lines.length > 0, `Page sans texte dans ${where}.`);
    if (page.lines) {
      page.lines.forEach((line, lineIndex) => {
        ok(speakers.has(line.who), `Locuteur inconnu dans ${where}, ligne ${lineIndex}.`);
        ok(typeof line.text === "string" && line.text.trim().length > 0, `Réplique vide dans ${where}, ligne ${lineIndex}.`);
      });
    }
  });
}

ok(CHAPTERS.length === 8, `Le récit doit contenir 8 chapitres (prologue + 7 jours), il en contient ${CHAPTERS.length}.`);
ok(Object.keys(PUZZLES).length === 7, `Le récit doit contenir 7 puzzles, il en contient ${Object.keys(PUZZLES).length}.`);
for (const puzzleId of Object.keys(PUZZLES)) {
  ok(usedPuzzles.get(puzzleId) === 1, `Le puzzle ${puzzleId} doit être utilisé exactement une fois (utilisé ${usedPuzzles.get(puzzleId) ?? 0} fois).`);
  const puzzle = PUZZLES[puzzleId];
  ok(["echo", "fill", "compose", "duet"].includes(puzzle.mode), `Mode de puzzle inconnu : ${puzzle.mode}`);
  ok(Boolean(MEMORIES.find((memory) => memory.id === puzzle.memoryId)), `Souvenir introuvable : ${puzzle.memoryId}`);
  if (puzzle.notes) {
    puzzle.notes.forEach((note) => {
      try { parseNote(note); } catch { fail(`Note invalide dans ${puzzleId} : ${note}`); }
    });
  }
  if (puzzle.missing) {
    puzzle.missing.forEach((index) => ok(index >= 0 && index < puzzle.notes.length, `Indice manquant hors partition dans ${puzzleId} : ${index}`));
  }
  if (puzzle.mode === "compose") {
    ok(Array.isArray(puzzle.allowedNotes) && puzzle.allowedNotes.length >= 2, `Composition sans notes autorisées dans ${puzzleId}.`);
    ok(Boolean(puzzle.firstNote) && Boolean(puzzle.lastNote), `Composition sans bornes dans ${puzzleId}.`);
    ok(puzzle.allowedNotes.includes(puzzle.firstNote), `Première note interdite dans ${puzzleId}.`);
    ok(puzzle.allowedNotes.includes(puzzle.lastNote), `Dernière note interdite dans ${puzzleId}.`);
  }
  if (puzzle.mode === "duet" && typeof puzzle.buildSequence === "function") {
    const sequence = puzzle.buildSequence({ flags: { coda: ["E4", "G4", "E5", "A4"] }, memories: [] });
    ok(Array.isArray(sequence) && sequence.length > 0, `Séquence de duo vide dans ${puzzleId}.`);
    sequence.forEach((entry) => {
      ok(["elise", "you"].includes(entry.who), `Interprète inconnu dans le duo ${puzzleId}.`);
      try { parseNote(entry.note); } catch { fail(`Note de duo invalide dans ${puzzleId} : ${entry.note}`); }
    });
  }
}

for (const endingId of Object.keys(ENDINGS)) {
  ok(Boolean(ENDING_CHAPTER[endingId]), `Chapitre manquant pour la fin ${endingId}.`);
  const endChapter = getChapter(ENDING_CHAPTER[endingId]);
  ok(Boolean(endChapter?.epilogue), `La fin ${endingId} ne mène pas à un épilogue.`);
}

const memoriesIds = new Set();
ok(MEMORIES.length === 8, `Le carnet doit contenir 8 souvenirs, il en contient ${MEMORIES.length}.`);
MEMORIES.forEach((memory) => {
  ok(Boolean(memory.id) && !memoriesIds.has(memory.id), `Identifiant de souvenir dupliqué : ${memory.id}`);
  memoriesIds.add(memory.id);
  ok(Boolean(MEMORY_ICONS[memory.icon]), `Icône inconnue pour ${memory.id} : ${memory.icon}`);
  ok(typeof memory.text === "string" && memory.text.length > 80, `Texte de souvenir trop court : ${memory.id}`);
  if (memory.puzzleId) ok(Boolean(PUZZLES[memory.puzzleId]), `Puzzle inconnu dans le souvenir ${memory.id}.`);
});

const finalChapter = CHAPTERS[CHAPTERS.length - 1];
const finalPage = finalChapter.pages[finalChapter.pages.length - 1];
ok(Array.isArray(finalPage.choices), "La dernière page du récit doit proposer un choix.");
ok(finalPage.choices?.some((choice) => choice.ending === "held"), "La fin « held » n'est pas accessible.");
ok(finalPage.choices?.some((choice) => choice.ending === "silence"), "La fin « silence » n'est pas accessible.");

for (const background of backgrounds) {
  if (!(await pathExists(`assets/art/backgrounds/${background}.svg`))) {
    fail(`Décor manquant : assets/art/backgrounds/${background}.svg`);
  }
}

const html = await readFile(path.join(ROOT, "index.html"), "utf8");
const requiredIds = [
  "screen-title", "screen-game", "screen-end", "scene", "scene-bg-a", "scene-bg-b",
  "dialogue-shell", "dialogue-text", "choice-list", "btn-next", "chapter-card",
  "piano-stage", "piano-keyboard", "piano-score", "piano-success", "slots-dialog",
  "menu-dialog", "settings-dialog", "credits-dialog", "journal-dialog", "confirm-dialog"
];
requiredIds.forEach((id) => ok(html.includes(`id="${id}"`), `Identifiant HTML requis manquant : ${id}`));
const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateHtmlIds = htmlIds.filter((id, index) => htmlIds.indexOf(id) !== index);
ok(duplicateHtmlIds.length === 0, `Identifiants HTML dupliqués : ${[...new Set(duplicateHtmlIds)].join(", ")}`);
ok(!/(src|href)="https?:\/\//i.test(html), "Une ressource externe est référencée dans index.html.");
ok(!/file:\/\//i.test(html), "Un chemin file:// est présent dans index.html.");

for (const relative of [
  "index.html", "README.md", "LICENSE", ".nojekyll", ".gitignore",
  "assets/art/favicon.svg", "assets/art/social-card.png",
  "assets/css/base.css", "assets/css/screens.css", "assets/css/game.css",
  "assets/css/piano.css", "assets/css/responsive.css",
  "assets/js/main.js", "assets/js/game/engine.js", "assets/js/game/piano.js",
  "assets/js/core/audio.js", "assets/js/core/storage.js", "assets/js/core/notes.js"
]) {
  if (!(await pathExists(relative))) fail(`Fichier requis manquant : ${relative}`);
}

const htmlLocalRefs = [...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map((match) => match[1].replace("./", ""));
for (const relative of htmlLocalRefs) {
  if (!(await pathExists(relative))) fail(`Ressource HTML introuvable : ${relative}`);
}

const cssFiles = ["base.css", "screens.css", "game.css", "piano.css", "responsive.css"];
for (const cssFile of cssFiles) {
  const css = await readFile(path.join(ROOT, "assets/css", cssFile), "utf8");
  const urls = [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => match[1]);
  for (const url of urls) {
    if (url.startsWith("data:") || url.startsWith("#") || url.startsWith("%23")) continue;
    if (!(await pathExists(url.replace(/^\.\//, "")))) fail(`Ressource CSS introuvable dans ${cssFile} : ${url}`);
  }
}

const jsFiles = [
  "main.js", "game/engine.js", "game/piano.js",
  "core/audio.js", "core/storage.js", "core/atmosphere.js", "core/notes.js",
  "core/utils.js", "data/music.js", "data/memories.js", "data/puzzles.js", "data/endings.js",
  "ui/portrait.js", "ui/staff.js",
  "story/index.js", "story/helpers.js", "story/prologue.js",
  "story/day1.js", "story/day2.js", "story/day3.js", "story/day4.js",
  "story/day5.js", "story/day6.js", "story/day7.js", "story/epilogues.js"
];
for (const jsFile of jsFiles) {
  const source = await readFile(path.join(ROOT, "assets/js", jsFile), "utf8");
  ok(!/https?:\/\//.test(source), `URL externe dans assets/js/${jsFile}.`);
  for (const match of source.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
    const imported = path.resolve(path.dirname(path.join(ROOT, "assets/js", jsFile)), match[1]);
    try {
      await access(imported, constants.F_OK);
    } catch {
      fail(`Import introuvable dans assets/js/${jsFile} : ${match[1]}`);
    }
  }
}

if (!errors.length) {
  console.log(`OK — ${checks} vérifications réussies.`);
  if (warnings.length) {
    console.log(`${warnings.length} avertissement(s) :`);
    warnings.forEach((message) => console.log(`  - ${message}`));
  }
  process.exit(0);
} else {
  console.error(`ÉCHEC — ${errors.length} erreur(s) sur ${checks} vérifications :`);
  errors.forEach((message) => console.error(`  - ${message}`));
  process.exit(1);
}
