import { audio } from "../core/audio.js";
import {
  BLACK_NOTES,
  WHITE_NOTES,
  KEYBOARD_MAP,
  frenchNoteName,
  shortFrenchName
} from "../core/notes.js";
import { getMemory } from "../data/memories.js";
import { MEMORY_ICONS } from "../data/memories.js";
import { portraitHTML } from "../ui/portrait.js";
import { staffSVG } from "../ui/staff.js";

const PORTRAIT_EXPRESSION = {
  j1: "soft",
  j2: "smile",
  j3: "determined",
  j4: "soft",
  j5: "worried",
  j6: "smile",
  j7: "determined"
};

const PIANO_BACKGROUND = {
  j5: "tempete",
  j7: "phare"
};

export class PianoGame {
  constructor({ onSolved, onContinue, getNoteLabels }) {
    this.onSolved = onSolved;
    this.onContinue = onContinue;
    this.getNoteLabels = getNoteLabels ?? (() => true);

    this.stage = document.getElementById("piano-stage");
    this.bg = this.stage.querySelector(".piano-bg");
    this.day = document.getElementById("piano-day");
    this.title = document.getElementById("piano-title");
    this.brief = document.getElementById("piano-brief");
    this.score = document.getElementById("piano-score");
    this.feedback = document.getElementById("piano-feedback");
    this.progress = document.getElementById("piano-progress");
    this.listenButton = document.getElementById("piano-listen");
    this.listenLabel = this.listenButton.querySelector("span");
    this.hintButton = document.getElementById("piano-hint");
    this.resetButton = document.getElementById("piano-reset");
    this.submitButton = document.getElementById("piano-submit");
    this.instruction = document.getElementById("piano-instruction");
    this.quote = document.getElementById("piano-quote");
    this.portrait = document.getElementById("piano-portrait");
    this.success = document.getElementById("piano-success");
    this.successIcon = document.getElementById("piano-success-icon");
    this.successTitle = document.getElementById("piano-success-title");
    this.successText = document.getElementById("piano-success-text");
    this.successNotes = document.getElementById("piano-success-notes");
    this.continueButton = document.getElementById("piano-continue");
    this.keysWhite = document.getElementById("keys-white");
    this.keysBlack = document.getElementById("keys-black");
    this.keyboard = document.getElementById("piano-keyboard");
    this.labelsButton = document.getElementById("piano-labels");
    this.layout = this.stage.querySelector(".piano-layout");
    this.footer = this.stage.querySelector(".piano-footer");
    this.top = this.stage.querySelector(".piano-top");

    this.isOpen = false;
    this.paused = false;
    this.puzzle = null;
    this.state = null;
    this.mode = "echo";
    this.sequence = [];
    this.progressIndex = 0;
    this.missingIndices = [];
    this.solvedMissing = new Set();
    this.userNotes = [];
    this.duetSequence = [];
    this.duetIndex = 0;
    this.duetStarted = false;
    this.duetWaiting = false;
    this.errors = 0;
    this.listening = false;
    this.revealScore = false;
    this.successShown = false;
    this.locked = false;
    this.timers = new Set();
    this.hintTimer = null;
    this.result = null;
    this.keyElements = new Map();

    this.#buildKeyboard();
    this.#bindEvents();
  }

  #buildKeyboard() {
    const whiteWrapper = document.createDocumentFragment();
    const blackWrapper = document.createDocumentFragment();

    for (const note of WHITE_NOTES) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "key-white";
      button.dataset.note = note;
      button.setAttribute("aria-label", `${frenchNoteName(note, { octave: true })} — ${this.#keyboardHint(note) || "clavier"}`);
      button.innerHTML = `<span class="key-note">${shortFrenchName(note)}<small>${this.#keyboardHint(note) ?? ""}</small></span><span class="key-board">${this.#keyboardHint(note) ?? ""}</span>`;
      whiteWrapper.appendChild(button);
      this.keyElements.set(note, button);
    }

    const blackAfterWhite = ["C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5"];
    BLACK_NOTES.forEach((note, index) => {
      const previousWhite = blackAfterWhite[index];
      const whiteIndex = WHITE_NOTES.indexOf(previousWhite);
      const boundary = ((whiteIndex + 1) / WHITE_NOTES.length) * 100;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "key-black";
      button.dataset.note = note;
      button.style.left = `calc(${boundary}% - 2.05%)`;
      button.setAttribute("aria-label", `${frenchNoteName(note, { octave: true })} — ${this.#keyboardHint(note) || "clavier"}`);
      button.innerHTML = `<span class="key-note">${shortFrenchName(note)}<small>${this.#keyboardHint(note) ?? ""}</small></span>`;
      blackWrapper.appendChild(button);
      this.keyElements.set(note, button);
    });

    this.keysWhite.appendChild(whiteWrapper);
    this.keysBlack.appendChild(blackWrapper);
  }

  #keyboardHint(note) {
    const entry = Object.entries(KEYBOARD_MAP).find(([, value]) => value === note);
    if (!entry) return "";
    return entry[0]
      .replace("Key", "")
      .replace("Digit", "");
  }

  #bindEvents() {
    this.keysWhite.addEventListener("click", (event) => {
      const button = event.target.closest("[data-note]");
      if (button) this.pressNote(button.dataset.note);
    });
    this.keysBlack.addEventListener("click", (event) => {
      const button = event.target.closest("[data-note]");
      if (button) this.pressNote(button.dataset.note);
    });

    this.listenButton.addEventListener("click", () => this.listen());
    this.hintButton.addEventListener("click", () => this.hint());
    this.resetButton.addEventListener("click", () => this.reset(false));
    this.submitButton.addEventListener("click", () => this.submitComposition());
    this.continueButton.addEventListener("click", () => this.#continueAfterSuccess());
  }

  open(puzzle, state) {
    this.#clearTimers();
    audio.stopPhrase();
    this.isOpen = true;
    this.paused = false;
    this.puzzle = puzzle;
    this.state = state;
    this.mode = puzzle.mode;
    this.errors = 0;
    this.listening = false;
    this.revealScore = false;
    this.successShown = false;
    this.locked = false;
    this.result = null;
    this.progressIndex = 0;
    this.solvedMissing = new Set();
    this.missingIndices = [...(puzzle.missing ?? [])];
    this.userNotes = [];
    this.duetIndex = 0;
    this.duetStarted = false;
    this.duetWaiting = false;
    this.timers = new Set();

    if (this.mode === "echo") {
      this.sequence = [...puzzle.notes];
    } else if (this.mode === "fill") {
      this.sequence = [...puzzle.notes];
    } else if (this.mode === "compose") {
      this.sequence = [puzzle.firstNote, null, null, puzzle.lastNote];
    } else if (this.mode === "duet") {
      this.duetSequence = puzzle.buildSequence(state);
      this.sequence = this.duetSequence.map((entry) => entry.note);
    }

    this.stage.hidden = false;
    this.stage.classList.toggle("show-labels", this.getNoteLabels());
    this.labelsButton?.setAttribute("aria-pressed", String(this.getNoteLabels()));
    this.labelsButton.textContent = this.getNoteLabels() ? "Noms des notes" : "Notes masquées";
    this.bg.src = `./assets/art/backgrounds/${PIANO_BACKGROUND[puzzle.id] ?? "atelier"}.svg`;
    this.day.textContent = puzzle.dayLabel;
    this.title.textContent = puzzle.title;
    this.brief.textContent = puzzle.brief;
    this.quote.textContent = puzzle.quote;
    this.instruction.textContent = puzzle.instruction;
    this.portrait.innerHTML = portraitHTML("elise", PORTRAIT_EXPRESSION[puzzle.id] ?? "soft");
    this.success.hidden = true;
    this.#setSuccessInert(false);
    this.#configureControls();
    this.#setFeedback(this.#initialFeedback());
    this.#renderStaff();
    this.#updateProgress();
    this.#focusStart();
    window.requestAnimationFrame(() => this.#focusKeyboardRange());

    document.body.classList.add("piano-open");
  }

  close() {
    this.#clearTimers();
    audio.stopPhrase();
    this.isOpen = false;
    this.paused = false;
    this.stage.hidden = true;
    this.success.hidden = true;
    this.#setSuccessInert(false);
    this.#clearKeyStates();
    document.body.classList.remove("piano-open");
    this.puzzle = null;
    this.state = null;
  }

  pause() {
    if (!this.isOpen) return;
    this.paused = true;
    this.#clearTimers();
    audio.stopPhrase();
    if (this.listening) {
      this.listening = false;
      this.#setFeedback("Pause. Tu peux reprendre quand tu veux.");
      this.#configureControls();
    }
  }

  resume() {
    if (!this.isOpen || !this.paused) return;
    this.paused = false;
    if (this.mode === "duet" && this.duetStarted && !this.successShown) {
      this.#setFeedback("On reprend.");
      this.#defer(() => this.#advanceDuet(), 500);
    }
  }

  setNoteLabels(show) {
    this.stage.classList.toggle("show-labels", Boolean(show));
    this.labelsButton?.setAttribute("aria-pressed", String(Boolean(show)));
    this.labelsButton.textContent = show ? "Noms des notes" : "Notes masquées";
    if (this.isOpen) this.#renderStaff();
  }

  #configureControls() {
    const blocked = this.successShown || this.locked;
    this.listenButton.hidden = false;
    this.listenButton.disabled = this.listening || blocked;
    this.submitButton.hidden = this.mode !== "compose";
    this.submitButton.disabled = this.userNotes.length < 2 || blocked;
    this.hintButton.disabled = blocked;
    this.resetButton.disabled = blocked;

    if (this.mode === "duet") {
      this.listenLabel.textContent = this.duetStarted ? "Duo en cours" : "Commencer le duo";
      this.listenButton.disabled = this.duetStarted || this.successShown;
    } else if (this.mode === "compose") {
      this.listenLabel.textContent = "Écouter";
    } else {
      this.listenLabel.textContent = this.listening ? "Écoute…" : "Écouter";
    }
  }

  #initialFeedback() {
    switch (this.mode) {
      case "fill":
        return "Écoute la phrase à trous, puis retrouve les notes manquantes.";
      case "compose":
        return "Choisis deux notes entre le mi et le la. Elles formeront la coda.";
      case "duet":
        return "Quand Élise commence, suis les notes claires. Prends ton temps.";
      default:
        return "Écoute la phrase, puis rends-la-moi.";
    }
  }

  #focusStart() {
    window.setTimeout(() => {
      if (!this.isOpen) return;
      if (this.mode === "duet" && !this.duetStarted) this.listenButton.focus();
      else if (this.mode === "duet") this.stage.querySelector(".piano-instruction")?.focus?.();
      else this.listenButton.focus();
    }, 80);
  }

  #focusKeyboardRange() {
    if (!this.isOpen || !this.keyboard) return;
    if (!window.matchMedia("(max-width: 640px)").matches) {
      this.keyboard.scrollLeft = 0;
      return;
    }
    const notes = this.sequence.filter(Boolean);
    const elements = notes.map((note) => this.keyElements.get(note)).filter(Boolean);
    if (!elements.length) return;
    const keyboardRect = this.keyboard.getBoundingClientRect();
    const rects = elements.map((element) => element.getBoundingClientRect());
    const left = Math.min(...rects.map((rect) => rect.left - keyboardRect.left + this.keyboard.scrollLeft));
    const right = Math.max(...rects.map((rect) => rect.right - keyboardRect.left + this.keyboard.scrollLeft));
    const max = Math.max(0, this.keyboard.scrollWidth - this.keyboard.clientWidth);
    const target = (left + right) / 2 - this.keyboard.clientWidth / 2;
    this.keyboard.scrollLeft = Math.max(0, Math.min(max, target));
  }

  /* ------------------------------------------------------------------ */
  /* Jeu                                                                */
  /* ------------------------------------------------------------------ */

  pressNote(note) {
    if (!this.isOpen || this.successShown || this.locked || this.listening) return;
    audio.playNote(note, { velocity: 0.64 });
    this.#flashKey(note, "is-pressed");
    const handler = this[`press_${this.mode}`];
    if (typeof handler === "function") handler.call(this, note);
  }

  press_echo(note) {
    const target = this.sequence[this.progressIndex];
    if (!target) return false;
    if (note === target) {
      this.progressIndex += 1;
      this.errors = 0;
      this.#flashKey(note, "is-correct");
      if (this.progressIndex >= this.sequence.length) {
        this.#renderStaff();
        this.#updateProgress();
        this.#completePuzzle(this.sequence, "echo");
        return true;
      }
      this.#setFeedback(this.#encouragement());
      this.#renderStaff();
      this.#updateProgress();
      return true;
    }
    this.#registerError(note, target);
    return true;
  }

  press_fill(note) {
    const missingList = this.missingIndices.filter((index) => !this.solvedMissing.has(index));
    const targetIndex = missingList[0];
    const target = targetIndex !== undefined ? this.sequence[targetIndex] : null;
    if (!target) return false;
    if (note === target) {
      this.solvedMissing.add(targetIndex);
      this.errors = 0;
      this.#flashKey(note, "is-correct");
      if (this.solvedMissing.size >= this.missingIndices.length) {
        this.#renderStaff();
        this.#updateProgress();
        this.locked = true;
        this.#configureControls();
        this.#setFeedback("Toutes les notes sont revenues. Écoute la phrase entière.");
        this.#defer(() => {
          audio.playPhrase(this.sequence, {
            noteMs: this.puzzle.listenNoteMs ?? 560,
            velocity: 0.48
          }).then(() => {
            this.#completePuzzle(this.sequence, "fill");
          });
        }, 420);
      } else {
        this.#setFeedback(this.#encouragement());
        this.#renderStaff();
        this.#updateProgress();
      }
      return true;
    }
    this.#registerError(note, target);
    return true;
  }

  press_compose(note) {
    if (this.userNotes.length >= 2) return false;
    const allowed = this.puzzle.allowedNotes ?? [];
    if (!allowed.includes(note)) {
      this.#setFeedback("Cette note s'éloigne de la maison. Reste sur les touches dorées.", "error");
      this.#flashKey(note, "is-wrong");
      return true;
    }
    this.userNotes.push(note);
    this.#flashKey(note, "is-correct");
    if (this.userNotes.length < 2) {
      this.#setFeedback("Une note de trouvée. La seconde est encore à toi.");
    } else {
      this.#setFeedback("Ta coda est complète. Écoute-la, puis grave-la.", "success");
    }
    this.#renderStaff();
    this.#updateProgress();
    this.#configureControls();
    return true;
  }

  press_duet(note) {
    if (!this.duetStarted || this.successShown) return false;
    const entry = this.duetSequence[this.duetIndex];
    if (!entry || entry.who !== "you") return false;
    if (note === entry.note) {
      this.errors = 0;
      this.#flashKey(note, "is-correct");
      this.duetIndex += 1;
      this.duetWaiting = false;
      this.#renderStaff();
      this.#updateProgress();
      if (entry.cue) this.#setFeedback(entry.cue);
      if (this.duetIndex >= this.duetSequence.length) {
        this.#completePuzzle(this.sequence, "duet");
        return true;
      }
      this.#defer(() => this.#advanceDuet(), 420);
      return true;
    }
    this.#registerError(note, entry.note);
    return true;
  }

  #registerError(played, target) {
    this.errors += 1;
    this.#flashKey(played, "is-wrong");
    if (this.errors >= 2) {
      this.#setFeedback(this.#hintMessage(target), "error");
      this.#highlightKey(target);
    } else {
      this.#setFeedback("Ce n'est pas celle-là. Écoute encore, puis réessaie.", "error");
    }
  }

  #encouragement() {
    const options = ["Bien.", "Oui.", "C'est ça.", "Elle tient.", "Continue."];
    return options[Math.min(this.errors, options.length - 1)] ?? options[0];
  }

  listen() {
    if (!this.isOpen || this.successShown || this.locked) return;
    if (this.mode === "duet") {
      this.#startDuet();
      return;
    }
    if (this.mode === "compose") {
      this.#listenComposition();
      return;
    }
    if (this.listening) return;
    this.#clearTimers();
    audio.stopPhrase();
    this.listening = true;
    this.errors = 0;
    this.#configureControls();
    this.#setFeedback("Écoute…");
    this.#clearKeyStates();

    if (this.mode === "fill") {
      this.#playGappedPhrase();
      return;
    }

    // Echo
    this.progressIndex = 0;
    this.#renderStaff();
    this.#updateProgress();
    this.#setScorePlayhead(0);
    audio.playPhrase(this.sequence, {
      noteMs: this.puzzle.listenNoteMs ?? 560,
      velocity: 0.5,
      onNote: (_note, index) => {
        this.#setScorePlayhead(index, true);
      }
    }).then(() => {
      if (!this.isOpen) return;
      this.listening = false;
      this.#clearScorePlayhead();
      this.#setFeedback(this.#initialFeedback());
      this.#configureControls();
      this.#renderStaff();
    }).catch(() => {
      this.listening = false;
      this.#configureControls();
    });
  }

  #playGappedPhrase() {
    const noteMs = this.puzzle.listenNoteMs ?? 560;
    const audioReady = audio.ready;
    this.#clearTimers();
    this.solvedMissing.clear();
    this.#renderStaff();
    this.#updateProgress();
    this.sequence.forEach((note, index) => {
      this.#defer(() => {
        if (!this.isOpen || !this.listening) return;
        this.#setScorePlayhead(index, true);
        if (!this.missingIndices.includes(index) && audioReady) {
          audio.playNote(note, { velocity: 0.45, duration: 1.8 });
        }
      }, index * noteMs);
    });
    this.#defer(() => {
      if (!this.isOpen) return;
      this.listening = false;
      this.#clearScorePlayhead();
      this.#setFeedback("À toi. Retrouve la première note manquante.");
      this.#configureControls();
      this.#renderStaff();
    }, this.sequence.length * noteMs + 120);
  }

  #listenComposition() {
    const notes = [
      this.puzzle.firstNote,
      ...this.userNotes,
      this.puzzle.lastNote
    ].filter(Boolean);
    if (!notes.length) return;
    this.listening = true;
    this.#configureControls();
    this.#setFeedback("Écoute ta coda.");
    audio.playPhrase(notes, {
      noteMs: this.puzzle.listenNoteMs ?? 620,
      velocity: 0.5
    }).then(() => {
      this.listening = false;
      this.#configureControls();
    });
  }

  #startDuet() {
    if (this.duetStarted) return;
    this.duetStarted = true;
    this.duetIndex = 0;
    this.duetWaiting = false;
    this.#clearTimers();
    this.#setFeedback("Élise commence.");
    this.#configureControls();
    this.#renderStaff();
    this.#defer(() => this.#advanceDuet(), 500);
  }

  #advanceDuet() {
    if (!this.isOpen || this.paused || !this.duetStarted || this.successShown) return;
    const entry = this.duetSequence[this.duetIndex];
    if (!entry) {
      this.#completePuzzle(this.sequence, "duet");
      return;
    }
    this.#renderStaff();
    this.#updateProgress();
    if (entry.who === "elise") {
      this.duetWaiting = false;
      this.#setFeedback(entry.cue || "Élise joue.");
      audio.playNote(entry.note, { velocity: 0.48, duration: 2.2 });
      this.#flashKey(entry.note, "is-pressed");
      this.#defer(() => {
        if (!this.isOpen || this.paused) return;
        this.duetIndex += 1;
        this.#renderStaff();
        this.#updateProgress();
        this.#defer(() => this.#advanceDuet(), 280);
      }, 760);
    } else {
      this.duetWaiting = true;
      const cue = entry.cue ? `${entry.cue} À toi.` : "À toi. Prends ton temps.";
      this.#setFeedback(cue, "success");
      this.#highlightKey(entry.note, 5000);
      this.#renderStaff();
      this.#updateProgress();
    }
  }

  submitComposition() {
    if (!this.isOpen || this.locked || this.mode !== "compose" || this.userNotes.length < 2) return;
    const coda = [this.puzzle.firstNote, ...this.userNotes, this.puzzle.lastNote];
    this.#completePuzzle(coda, "compose");
  }

  hint() {
    if (!this.isOpen || this.successShown || this.locked) return;
    if (this.mode === "compose") {
      this.#setFeedback("Reste sur les touches dorées. Choisis deux notes, sans te presser.", "error");
      const allowed = this.puzzle.allowedNotes ?? [];
      this.#highlightKeys(allowed, 2400);
      return;
    }
    if (this.mode === "duet" && !this.duetStarted) {
      this.#setFeedback("Commence le duo avec Élise. L'indice suivra ta première note.", "error");
      return;
    }
    let target = null;
    if (this.mode === "duet") {
      const entry = this.duetSequence[this.duetIndex];
      if (entry?.who === "you") target = entry.note;
    } else if (this.mode === "fill") {
      const remaining = this.missingIndices.filter((index) => !this.solvedMissing.has(index));
      target = this.sequence[remaining[0]];
    } else {
      target = this.sequence[this.progressIndex];
    }
    if (!target) {
      this.#setFeedback("La phrase est complète. Il ne reste qu'à l'écouter.", "success");
      return;
    }
    if (this.puzzle.hiddenScore) {
      this.revealScore = true;
      this.#renderStaff();
    }
    this.#setFeedback(this.#hintMessage(target), "error");
    this.#highlightKey(target, 4200);
  }

  #hintMessage(note) {
    return `Indice : la prochaine note est ${frenchNoteName(note, { octave: true })}.`;
  }

  reset(fromMenu = false) {
    if (!this.isOpen || this.successShown || this.locked) return;
    this.#clearTimers();
    audio.stopPhrase();
    this.listening = false;
    this.locked = false;
    this.errors = 0;
    this.progressIndex = 0;
    this.solvedMissing.clear();
    this.userNotes = [];
    this.duetIndex = 0;
    this.duetStarted = false;
    this.duetWaiting = false;
    this.revealScore = false;
    this.#clearKeyStates();
    this.#setFeedback(this.#initialFeedback());
    this.#renderStaff();
    this.#updateProgress();
    this.#configureControls();
    if (!fromMenu) this.listenButton.focus();
  }

  #completePuzzle(notes, mode) {
    if (this.successShown) return;
    this.locked = true;
    this.listening = false;
    this.#clearTimers();
    const result = {
      puzzleId: this.puzzle.id,
      mode,
      notes: [...notes],
      coda: mode === "compose" ? [...notes] : null
    };
    this.result = result;
    this.onSolved?.(result);
    audio.playMemoryChime();
    this.#showSuccess(result);
  }

  #showSuccess(result) {
    const memory = getMemory(this.puzzle.memoryId);
    this.successShown = true;
    this.#clearTimers();
    this.#setFeedback(this.puzzle.successText, "success");
    this.#renderStaff();
    this.#updateProgress();
    this.#configureControls();
    this.successIcon.innerHTML = MEMORY_ICONS[memory?.icon] ?? MEMORY_ICONS.letter;
    this.successTitle.textContent = memory?.title ?? "Fragment retrouvé";
    this.successText.textContent = this.puzzle.successText;
    this.successNotes.innerHTML = result.notes
      .map((note) => `<span class="success-note">${shortFrenchName(note)}</span>`)
      .join("");
    this.success.hidden = false;
    this.#setSuccessInert(true);
    window.setTimeout(() => this.continueButton.focus(), 80);
  }

  #continueAfterSuccess() {
    if (!this.successShown) return;
    const result = this.result;
    this.success.hidden = true;
    this.#setSuccessInert(false);
    this.onContinue?.(result);
  }

  #setSuccessInert(inert) {
    [this.top, this.layout, this.footer].forEach((element) => {
      if (!element) return;
      if (inert) element.setAttribute("inert", "");
      else element.removeAttribute("inert");
    });
  }

  #setFeedback(message, state = "") {
    this.feedback.textContent = message;
    this.feedback.classList.toggle("is-error", state === "error");
    this.feedback.classList.toggle("is-success", state === "success");
  }

  #updateProgress() {
    if (this.mode === "compose") {
      const slots = [
        this.puzzle.firstNote,
        this.userNotes[0] ?? null,
        this.userNotes[1] ?? null,
        this.puzzle.lastNote
      ];
      this.progress.innerHTML = `<span class="compose-slots" aria-label="Coda">${slots
        .map((note, index) => {
          const classes = ["compose-slot", note ? "is-filled" : "", index === 0 || index === 3 ? "is-locked" : ""].filter(Boolean).join(" ");
          return `<span class="${classes}">${note ? shortFrenchName(note) : "·"}</span>`;
        })
        .join("")}</span>`;
      return;
    }
    if (this.mode === "duet") {
      const entry = this.duetSequence[this.duetIndex];
      if (!this.duetStarted) this.progress.textContent = "prêt";
      else if (this.duetIndex >= this.duetSequence.length) this.progress.textContent = "fin";
      else this.progress.textContent = entry?.who === "you" ? "à toi" : "Élise";
      return;
    }
    if (this.mode === "fill") {
      this.progress.textContent = `${this.solvedMissing.size} / ${this.missingIndices.length} notes`;
      return;
    }
    this.progress.textContent = `${this.progressIndex} / ${this.sequence.length}`;
  }

  #renderStaff() {
    let items = [];
    let currentIndex = -1;
    let completedCount = 0;
    if (this.mode === "compose") {
      items = [
        { note: this.puzzle.firstNote, locked: true, who: "you" },
        { note: this.userNotes[0] ?? null, ghost: !this.userNotes[0], who: "you" },
        { note: this.userNotes[1] ?? null, ghost: !this.userNotes[1], who: "you" },
        { note: this.puzzle.lastNote, locked: true, who: "you" }
      ];
      currentIndex = this.userNotes.length < 2 ? this.userNotes.length + 1 : -1;
    } else if (this.mode === "fill") {
      const missingList = this.missingIndices.filter((index) => !this.solvedMissing.has(index));
      items = this.sequence.map((note, index) => {
        const isMissing = this.missingIndices.includes(index);
        const solved = this.solvedMissing.has(index);
        return {
          note: isMissing && !solved ? null : note,
          ghost: isMissing && !solved,
          done: solved,
          missing: isMissing,
          who: "you"
        };
      });
      currentIndex = missingList[0] ?? -1;
      completedCount = this.solvedMissing.size;
    } else if (this.mode === "duet") {
      items = this.duetSequence.map((entry, index) => ({
        note: entry.note,
        who: entry.who,
        done: index < this.duetIndex,
        hidden: Boolean(entry.fading && index < this.duetIndex)
      }));
      currentIndex = this.duetStarted && this.duetIndex < this.duetSequence.length ? this.duetIndex : -1;
      completedCount = this.duetIndex;
    } else {
      items = this.sequence.map((note, index) => ({
        note,
        done: index < this.progressIndex,
        who: "you"
      }));
      currentIndex = this.progressIndex < this.sequence.length ? this.progressIndex : -1;
      completedCount = this.progressIndex;
    }

    const hidden = Boolean(this.puzzle?.hiddenScore && !this.revealScore);
    this.score.classList.toggle("is-hidden-score", hidden);
    this.score.innerHTML = staffSVG(items, {
      showLabels: this.getNoteLabels(),
      hidden,
      currentIndex,
      completedCount,
      label: this.puzzle?.staffLabel ?? "Partition"
    });
  }

  #setScorePlayhead(index, show = true) {
    const notes = this.score.querySelectorAll(".staff-note");
    notes.forEach((note, i) => {
      note.classList.toggle("is-playhead", show && i === index);
    });
  }

  #clearScorePlayhead() {
    this.score.querySelectorAll(".is-playhead").forEach((note) => note.classList.remove("is-playhead"));
  }

  #flashKey(note, className) {
    const key = this.keyElements.get(note);
    if (!key) return;
    this.#clearKeyStates();
    key.classList.add(className);
    this.#defer(() => key.classList.remove(className), 360);
  }

  #highlightKey(note, duration = 3000) {
    const key = this.keyElements.get(note);
    if (!key) return;
    key.classList.add("is-hinted");
    if (this.hintTimer) window.clearTimeout(this.hintTimer);
    this.hintTimer = window.setTimeout(() => {
      key.classList.remove("is-hinted");
    }, duration);
  }

  #highlightKeys(notes, duration = 3000) {
    const keys = notes.map((note) => this.keyElements.get(note)).filter(Boolean);
    keys.forEach((key) => key.classList.add("is-hinted"));
    if (this.hintTimer) window.clearTimeout(this.hintTimer);
    this.hintTimer = window.setTimeout(() => {
      keys.forEach((key) => key.classList.remove("is-hinted"));
      this.hintTimer = null;
    }, duration);
  }

  #clearKeyStates() {
    this.keyElements.forEach((key) => {
      key.classList.remove("is-pressed", "is-wrong", "is-correct", "is-hinted");
    });
  }

  #defer(fn, delay) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      try { fn(); } catch (error) { console.error(error); }
    }, delay);
    this.timers.add(timer);
    return timer;
  }

  #clearTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
    if (this.hintTimer) {
      window.clearTimeout(this.hintTimer);
      this.hintTimer = null;
    }
  }

  handleKeyDown(event) {
    if (!this.isOpen || this.successShown) return false;
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return false;
    if (document.querySelector("dialog[open]")) return false;
    const target = event.target;
    if (target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return false;
    const note = KEYBOARD_MAP[event.code];
    if (!note) return false;
    event.preventDefault();
    if (this.listening) return true;
    this.pressNote(note, { fromKeyboard: true });
    return true;
  }
}
