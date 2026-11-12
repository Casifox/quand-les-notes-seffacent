import { audio } from "../core/audio.js";
import { getPuzzle } from "../data/puzzles.js";
import { getMemory } from "../data/memories.js";
import {
  CHAPTERS,
  ENDING_CHAPTER,
  getChapter,
  getNextChapterId,
  resolveLines
} from "../story/index.js";
import { portraitHTML } from "../ui/portrait.js";
import { PianoGame } from "./piano.js";

const SPEAKER_NAMES = {
  narr: "Récit",
  noe: "Noé",
  elise: "Élise",
  margot: "Margot",
  luce: "La voix de Luce"
};

const BG_BASE = "./assets/art/backgrounds/";

export class StoryEngine {
  constructor({
    saveStore,
    atmosphere,
    getTextSpeed,
    getNoteLabels,
    onStateChange,
    onFinish,
    onNotify
  }) {
    this.saveStore = saveStore;
    this.atmosphere = atmosphere;
    this.getTextSpeed = getTextSpeed ?? (() => 25);
    this.getNoteLabels = getNoteLabels ?? (() => true);
    this.onStateChange = onStateChange ?? (() => {});
    this.onFinish = onFinish ?? (() => {});
    this.onNotify = onNotify ?? (() => {});

    this.screenGame = document.getElementById("screen-game");
    this.scene = document.getElementById("scene");
    this.hudDay = document.getElementById("hud-day");
    this.hudChapterTitle = document.getElementById("hud-chapter-title");
    this.location = document.getElementById("scene-location");
    this.journalCount = document.getElementById("journal-count");
    this.bgA = document.getElementById("scene-bg-a");
    this.bgB = document.getElementById("scene-bg-b");
    this.portraitStage = document.getElementById("portrait-stage");
    this.chapterCard = document.getElementById("chapter-card");
    this.chapterCardInner = this.chapterCard.querySelector(".chapter-card-inner");
    this.cardLabel = document.getElementById("chapter-card-label");
    this.cardTitle = document.getElementById("chapter-card-title");
    this.cardDate = document.getElementById("chapter-card-date");
    this.cardQuote = document.getElementById("chapter-card-quote");
    this.chapterStart = document.getElementById("btn-chapter-start");
    this.dialogueShell = document.getElementById("dialogue-shell");
    this.dialogueInner = this.dialogueShell.querySelector(".dialogue-inner");
    this.speakerName = document.getElementById("speaker-name");
    this.dialogueText = document.getElementById("dialogue-text");
    this.dialogueLive = document.getElementById("dialogue-live");
    this.dialogueHint = document.getElementById("dialogue-hint");
    this.choiceList = document.getElementById("choice-list");
    this.nextButton = document.getElementById("btn-next");
    this.nextLabel = document.getElementById("btn-next-label");
    this.saveIndicator = document.getElementById("save-indicator");
    this.saveText = document.getElementById("save-text");

    this.active = false;
    this.state = null;
    this.chapter = null;
    this.page = null;
    this.sceneState = null;
    this.lines = [];
    this.lineIndex = 0;
    this.typing = false;
    this.typeTimer = null;
    this.fullText = "";
    this.choicesVisible = false;
    this.chapterCardOpen = false;
    this.currentPortrait = { who: null, expression: null };
    this.currentBg = "";
    this.activeBg = 0;
    this.bgToken = 0;
    this.saveFlashTimer = null;
    this.lastMusic = undefined;
    this.lastAmbience = undefined;

    this.piano = new PianoGame({
      onSolved: (result) => this.#onPianoSolved(result),
      onContinue: (result) => this.#onPianoContinue(result),
      getNoteLabels: this.getNoteLabels
    });

    this.#bindEvents();
  }

  #bindEvents() {
    this.nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.advance();
    });
    this.chapterStart.addEventListener("click", () => this.#dismissChapterCard());
    this.dialogueShell.addEventListener("click", (event) => {
      if (event.target.closest("button, a, .choice-list")) return;
      if (window.getSelection()?.toString()) return;
      this.advance();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Cycle de vie                                                       */
  /* ------------------------------------------------------------------ */

  start(state) {
    this.active = true;
    this.state = state;
    this.#clearTypewriter();
    this.#hideChoices();
    this.chapterCard.hidden = true;
    this.chapterCardOpen = false;
    this.dialogueShell.hidden = false;
    this.currentPortrait = { who: null, expression: null };
    this.portraitStage.classList.remove("is-visible");
    this.portraitStage.innerHTML = "";
    this.currentBg = "";
    this.lastMusic = undefined;
    this.lastAmbience = undefined;
    this.activeBg = 0;
    this.bgA.classList.remove("is-active");
    this.bgB.classList.remove("is-active");
    this.bgA.removeAttribute("src");
    this.bgB.removeAttribute("src");
    this.screenGame.inert = false;

    const chapterId = getChapter(state.chapterId) ? state.chapterId : CHAPTERS[0].id;
    this.chapter = getChapter(chapterId);
    this.state.chapterId = chapterId;
    this.state.pageIndex = Math.min(
      Math.max(0, Number(state.pageIndex) || 0),
      Math.max(0, this.chapter.pages.length - 1)
    );

    if (this.chapter.epilogue) this.#unlockLetter();
    this.#updateHud();
    this.#updateJournalCount();

    const savedScene = this.state.scene?.chapterId === this.chapter.id ? this.state.scene : null;
    this.sceneState = { ...this.#chapterScene(this.chapter), ...(savedScene ?? {}) };
    const showCard = this.state.pageIndex === 0 && !this.state.seenIntros.includes(this.chapter.id);
    if (showCard) {
      this.#prepareChapterScene();
      this.#showChapterCard();
    } else {
      this.#saveState({ quiet: true });
      this.#renderPage();
    }
  }

  stop() {
    this.active = false;
    this.#clearTypewriter();
    this.#stopSaveFlash();
    this.piano.close();
    this.screenGame.inert = false;
    this.#hideChoices();
    this.dialogueShell.classList.remove("is-silent");
    this.dialogueShell.hidden = true;
    this.chapterCard.hidden = true;
    this.chapterCardOpen = false;
    audio.stopPhrase();
  }

  #chapterScene(chapter) {
    return {
      chapterId: chapter.id,
      bg: chapter.bg,
      tone: chapter.tone,
      weather: chapter.weather ?? null,
      fx: chapter.fx,
      location: chapter.location,
      music: chapter.music ?? null,
      ambience: chapter.ambience ?? null
    };
  }

  #prepareChapterScene() {
    this.#applyScene(this.#chapterScene(this.chapter));
    this.#saveState({ quiet: true });
  }

  #showChapterCard() {
    const chapter = this.chapter;
    this.chapterCardOpen = true;
    this.dialogueShell.hidden = true;
    this.chapterCard.hidden = false;
    this.cardLabel.textContent = chapter.label ?? `Jour ${chapter.number}`;
    this.cardTitle.textContent = chapter.title;
    this.cardDate.textContent = chapter.date;
    this.cardQuote.textContent = chapter.quote;
    this.chapterCardInner.dataset.day = chapter.number ? String(chapter.number).padStart(2, "0") : "P";
    this.#updateHud();
    window.setTimeout(() => this.chapterStart.focus(), 80);
  }

  #dismissChapterCard() {
    if (!this.chapterCardOpen) return;
    this.chapterCardOpen = false;
    this.chapterCard.hidden = true;
    this.dialogueShell.hidden = false;
    if (!this.state.seenIntros.includes(this.chapter.id)) {
      this.state.seenIntros.push(this.chapter.id);
    }
    this.#saveState({ quiet: true });
    this.#renderPage();
    window.setTimeout(() => this.nextButton.focus({ preventScroll: true }), 120);
  }

  #startChapter(chapterId, pageIndex = 0) {
    const chapter = getChapter(chapterId);
    if (!chapter) {
      this.#finishStory();
      return;
    }
    this.#clearTypewriter();
    this.#hideChoices();
    this.dialogueShell.hidden = true;
    this.chapterCard.hidden = true;
    this.portraitStage.classList.remove("is-visible");
    this.portraitStage.innerHTML = "";
    this.currentPortrait = { who: null, expression: null };
    this.chapter = chapter;
    this.state.chapterId = chapterId;
    this.state.pageIndex = Math.max(0, Math.min(pageIndex, chapter.pages.length - 1));
    this.sceneState = this.#chapterScene(chapter);
    if (chapter.epilogue) this.#unlockLetter();
    this.#updateHud();
    this.#saveState({ quiet: true });
    if (this.state.pageIndex === 0 && !this.state.seenIntros.includes(chapter.id)) {
      this.#prepareChapterScene();
      this.#showChapterCard();
    } else {
      this.#renderPage();
    }
  }

  #renderPage() {
    const chapter = this.chapter;
    if (!chapter) return;
    const page = chapter.pages[this.state.pageIndex];
    if (!page) {
      this.#finishStory();
      return;
    }
    this.page = page;
    this.#clearTypewriter();
    this.#hideChoices();
    this.chapterCard.hidden = true;
    this.dialogueShell.hidden = page.kind === "piano";
    this.dialogueInner.dataset.page = `${String(this.state.pageIndex + 1).padStart(2, "0")} / ${String(chapter.pages.length).padStart(2, "0")}`;

    const previous = this.sceneState ?? this.#chapterScene(chapter);
    const has = (key) => Object.prototype.hasOwnProperty.call(page, key);
    this.#applyScene({
      chapterId: chapter.id,
      bg: page.bg ?? previous.bg ?? chapter.bg,
      tone: page.tone ?? previous.tone ?? chapter.tone,
      weather: has("weather") ? page.weather : previous.weather,
      fx: page.fx ?? previous.fx ?? chapter.fx,
      location: page.location ?? previous.location ?? chapter.location,
      music: has("music") ? page.music : previous.music,
      ambience: has("ambience") ? page.ambience : previous.ambience
    });
    this.#updateHud();
    this.#updateJournalCount();
    this.#saveState({ quiet: true });

    if (page.playCoda) {
      const coda = Array.isArray(this.state.flags.coda) && this.state.flags.coda.length === 4
        ? this.state.flags.coda
        : ["E4", "G4", "E5", "A4"];
      window.setTimeout(() => {
        if (!this.active) return;
        audio.playPhrase(coda, { noteMs: 820, velocity: 0.5, duration: 2.8 });
      }, 650);
    }

    if (page.kind === "piano") {
      this.#openPiano(page);
      return;
    }

    this.lines = resolveLines(page, this.state);
    this.lineIndex = 0;
    if (!this.lines.length) {
      this.nextButton.hidden = false;
      this.#goNextPage();
      return;
    }

    if (page.portrait === false) {
      this.#hidePortrait();
    }
    this.dialogueShell.classList.remove("is-silent");
    this.dialogueShell.hidden = false;
    this.#renderLine();
  }

  /* ------------------------------------------------------------------ */
  /* Dialogue                                                           */
  /* ------------------------------------------------------------------ */

  #renderLine() {
    const line = this.lines[this.lineIndex];
    if (!line) {
      this.#goNextPage();
      return;
    }
    const who = line.who ?? "narr";
    const name = SPEAKER_NAMES[who] ?? "";
    this.speakerName.textContent = name;
    this.speakerName.classList.toggle("is-narration", who === "narr");
    this.dialogueShell.dataset.speaker = who;
    this.dialogueShell.hidden = false;
    this.dialogueHint.textContent = "Espace ou entrée";

    if (line.portrait === "none") this.#hidePortrait();
    else if (who === "elise" || who === "margot") {
      this.#setPortrait(who, line.expr ?? (who === "margot" ? "warm" : "neutral"));
    }

    const atLastLine = this.lineIndex >= this.lines.length - 1;
    this.nextButton.hidden = false;
    this.nextLabel.textContent = atLastLine && this.page.choices?.length ? "Choisir" : "Continuer";
    this.#hideChoices(false);
    this.#typeLine(line.text ?? "");
  }

  #typeLine(text) {
    this.#clearTypewriter();
    this.fullText = String(text);
    this.dialogueLive.textContent = this.fullText;
    this.dialogueText.textContent = "";
    this.dialogueText.classList.add("is-typing");
    this.typing = true;

    const speed = Math.max(0, Number(this.getTextSpeed()) || 0);
    if (speed === 0) {
      this.dialogueText.textContent = this.fullText;
      this.#finishTyping();
      return;
    }

    const characters = Array.from(this.fullText);
    let index = 0;
    const step = () => {
      if (!this.typing) return;
      index += 1;
      this.dialogueText.textContent = characters.slice(0, index).join("");
      if (index >= characters.length) {
        this.#finishTyping();
        return;
      }
      const char = characters[index - 1];
      let delay = speed;
      if ([".", "!", "?", "…"].includes(char)) delay += speed * 5;
      else if ([",", ";", ":"].includes(char)) delay += speed * 2.5;
      else if (char === "\n") delay += speed * 4;
      this.typeTimer = window.setTimeout(step, delay);
    };
    this.typeTimer = window.setTimeout(step, speed);
  }

  #finishTyping() {
    if (!this.typing) return;
    this.typing = false;
    if (this.typeTimer) {
      window.clearTimeout(this.typeTimer);
      this.typeTimer = null;
    }
    this.dialogueText.textContent = this.fullText;
    this.dialogueText.classList.remove("is-typing");
  }

  #clearTypewriter() {
    if (this.typeTimer) {
      window.clearTimeout(this.typeTimer);
      this.typeTimer = null;
    }
    this.typing = false;
    this.dialogueText.classList.remove("is-typing");
  }

  advance() {
    if (!this.active || this.chapterCardOpen || this.piano.isOpen) return;
    if (this.choicesVisible) return;
    if (this.typing) {
      this.#finishTyping();
      return;
    }
    const atLastLine = this.lineIndex >= this.lines.length - 1;
    if (!atLastLine) {
      this.lineIndex += 1;
      this.#renderLine();
      return;
    }
    if (this.page?.choices?.length) {
      this.#showChoices();
      return;
    }
    this.#goNextPage();
  }

  #goNextPage() {
    if (!this.active) return;
    const chapter = this.chapter;
    if (!chapter) return;
    if (this.state.pageIndex < chapter.pages.length - 1) {
      this.state.pageIndex += 1;
      this.#renderPage();
      return;
    }
    if (chapter.epilogue) {
      this.#finishStory();
      return;
    }
    const next = getNextChapterId(chapter.id);
    if (next) {
      this.#startChapter(next);
      return;
    }
    this.#finishStory();
  }

  #showChoices() {
    if (!this.page?.choices?.length) return;
    this.choicesVisible = true;
    const count = this.page.choices.length;
    this.dialogueHint.textContent = count > 1
      ? `Choisis avec les touches 1 à ${count}`
      : "Choisis avec la touche 1";
    this.nextButton.hidden = true;
    this.choiceList.innerHTML = "";
    const intro = document.createElement("p");
    intro.className = "choice-intro";
    intro.textContent = "Que réponds-tu ?";
    this.choiceList.appendChild(intro);

    this.page.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-btn";
      button.dataset.index = String(index + 1);
      button.textContent = choice.text;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this.#choose(choice);
      });
      this.choiceList.appendChild(button);
    });
    this.choiceList.hidden = false;
    window.setTimeout(() => {
      this.choiceList.querySelector(".choice-btn")?.focus({ preventScroll: true });
    }, 40);
  }

  #hideChoices(hideList = true) {
    this.choicesVisible = false;
    if (hideList) {
      this.choiceList.hidden = true;
      this.choiceList.innerHTML = "";
    }
    this.nextButton.hidden = false;
  }

  #choose(choice) {
    if (!this.choicesVisible) return;
    this.choicesVisible = false;
    this.choiceList.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
    if (choice.set && typeof choice.set === "object") {
      Object.assign(this.state.flags, choice.set);
    }
    if (choice.ending) {
      this.state.ending = choice.ending;
      this.state.finished = false;
      const nextChapter = ENDING_CHAPTER[choice.ending];
      if (!nextChapter) {
        this.#finishStory();
        return;
      }
      this.#saveState({ quiet: false });
      this.#startChapter(nextChapter, 0);
      return;
    }
    this.#goNextPage();
  }

  selectChoice(index) {
    if (!this.choicesVisible) return false;
    const button = this.choiceList.querySelectorAll(".choice-btn")[index];
    if (!button || button.disabled) return false;
    button.click();
    return true;
  }

  handleKeyDown(event) {
    if (!this.active || this.chapterCardOpen || this.piano.isOpen) return false;
    if (document.querySelector("dialog[open]")) return false;
    const target = event.target;
    if (target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return false;
    if (this.choicesVisible) {
      if (/^Digit[1-4]$/.test(event.code)) {
        const index = Number(event.code.replace("Digit", "")) - 1;
        if (this.selectChoice(index)) {
          event.preventDefault();
          return true;
        }
      }
      return false;
    }
    if (event.code === "Space" || event.code === "Enter") {
      if (target instanceof HTMLElement && target.closest("button, a")) return false;
      event.preventDefault();
      this.advance();
      return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ */
  /* Piano                                                              */
  /* ------------------------------------------------------------------ */

  #openPiano(page) {
    const puzzle = getPuzzle(page.puzzleId);
    if (!puzzle) {
      console.warn(`Énigme inconnue : ${page.puzzleId}`);
      this.#goNextPage();
      return;
    }
    if (this.state.memories.includes(puzzle.memoryId)) {
      this.#goNextPage();
      return;
    }
    this.dialogueShell.hidden = true;
    this.#hideChoices();
    this.#clearTypewriter();
    this.screenGame.inert = true;
    if (puzzle.stopMusic) {
      audio.stopMusic(2.6);
      this.lastMusic = null;
    }
    this.piano.open(puzzle, this.state);
  }

  #onPianoSolved(result) {
    if (!this.piano.puzzle) return;
    const puzzle = this.piano.puzzle;
    if (result.coda) {
      this.state.flags.coda = [...result.coda];
    }
    if (!this.state.memories.includes(puzzle.memoryId)) {
      this.state.memories.push(puzzle.memoryId);
    }
    this.#updateJournalCount();
    this.#saveState({ quiet: true });
    this.#updateHud();
  }

  #onPianoContinue() {
    this.piano.close();
    this.screenGame.inert = false;
    this.#saveState({ quiet: true });
    this.#goNextPage();
    window.setTimeout(() => this.nextButton.focus({ preventScroll: true }), 100);
  }

  /* ------------------------------------------------------------------ */
  /* Fin                                                                */
  /* ------------------------------------------------------------------ */

  #finishStory() {
    if (!this.state) return;
    if (!this.state.memories.includes("lettre-finale")) {
      this.state.memories.push("lettre-finale");
    }
    this.state.finished = true;
    this.state.ending = this.state.ending || "held";
    this.#saveState({ quiet: true });
    this.#updateJournalCount();
    this.active = false;
    audio.stopPhrase();
    this.onFinish(this.state);
  }

  #unlockLetter() {
    if (!this.state.memories.includes("lettre-finale")) {
      this.state.memories.push("lettre-finale");
      this.#updateJournalCount();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Visuel & audio                                                     */
  /* ------------------------------------------------------------------ */

  #applyScene(scene) {
    const {
      chapterId = this.chapter?.id,
      bg,
      tone,
      weather,
      fx,
      location,
      music,
      ambience
    } = scene;
    this.sceneState = { chapterId, bg, tone, weather: weather ?? null, fx, location, music: music ?? null, ambience: ambience ?? null };
    if (this.state) this.state.scene = this.sceneState;
    this.#setBackground(bg ?? "atelier");
    this.scene.dataset.tone = tone ?? "day";
    if (weather) this.scene.dataset.weather = weather;
    else delete this.scene.dataset.weather;
    this.atmosphere.setMode(fx ?? "motes");
    this.location.textContent = location ?? "Kerlann";
    if (music !== this.lastMusic) {
      this.lastMusic = music;
      if (music) audio.playMusic(music);
      else audio.stopMusic(2.2);
    }
    if (ambience !== this.lastAmbience) {
      this.lastAmbience = ambience;
      audio.setAmbience(ambience ?? null);
    }
  }

  #setBackground(bgId) {
    const path = `${BG_BASE}${bgId}.svg`;
    if (path === this.currentBg) return;
    this.currentBg = path;
    const token = ++this.bgToken;
    const incoming = this.activeBg === 0 ? this.bgB : this.bgA;
    const outgoing = this.activeBg === 0 ? this.bgA : this.bgB;

    const reveal = () => {
      if (token !== this.bgToken) return;
      incoming.classList.add("is-active");
      outgoing.classList.remove("is-active");
      this.activeBg = this.activeBg === 0 ? 1 : 0;
    };

    if (!outgoing.src) {
      incoming.src = path;
      incoming.classList.add("is-active");
      this.activeBg = this.activeBg === 0 ? 1 : 0;
      return;
    }
    incoming.onload = reveal;
    incoming.onerror = () => {
      console.warn(`Décor introuvable : ${path}`);
      reveal();
    };
    incoming.src = path;
  }

  #updateHud() {
    if (!this.chapter) return;
    this.hudDay.textContent = this.chapter.label ?? "";
    this.hudChapterTitle.textContent = this.chapter.title;
  }

  #updateJournalCount() {
    const count = this.state?.memories?.length ?? 0;
    if (this.journalCount) this.journalCount.textContent = String(count);
  }

  #setPortrait(who, expression) {
    if (!this.portraitStage) return;
    if (this.currentPortrait.who === who && this.currentPortrait.expression === expression) {
      this.portraitStage.classList.add("is-visible");
      return;
    }
    this.currentPortrait = { who, expression };
    this.portraitStage.innerHTML = portraitHTML(who, expression);
    this.portraitStage.classList.add("is-visible");
  }

  #hidePortrait() {
    if (!this.portraitStage) return;
    this.currentPortrait = { who: null, expression: null };
    this.portraitStage.classList.remove("is-visible");
    window.setTimeout(() => {
      if (!this.currentPortrait.who) this.portraitStage.innerHTML = "";
    }, 500);
  }

  /* ------------------------------------------------------------------ */
  /* Sauvegarde                                                         */
  /* ------------------------------------------------------------------ */

  #saveState({ quiet = true } = {}) {
    if (!this.state) return false;
    const ok = this.saveStore.save(this.state);
    if (!ok) {
      this.onNotify?.(this.saveStore.lastError ?? "Sauvegarde impossible.", "error");
      return false;
    }
    this.#updateJournalCount();
    this.#flashSave(quiet);
    this.onStateChange?.(this.state, { quiet });
    return true;
  }

  saveNow({ manual = false } = {}) {
    const ok = this.#saveState({ quiet: !manual });
    if (manual) {
      this.onNotify?.(ok ? "Carnet sauvegardé." : "La sauvegarde a échoué.", ok ? "success" : "error");
    }
    return ok;
  }

  #flashSave(quiet) {
    if (!this.saveIndicator) return;
    this.saveText.textContent = quiet ? "Sauvegardé" : "Carnet à jour";
    this.saveIndicator.classList.add("is-visible");
    if (this.saveFlashTimer) window.clearTimeout(this.saveFlashTimer);
    this.saveFlashTimer = window.setTimeout(() => {
      this.saveIndicator.classList.remove("is-visible");
    }, quiet ? 1400 : 2400);
  }

  #stopSaveFlash() {
    if (this.saveFlashTimer) window.clearTimeout(this.saveFlashTimer);
    this.saveFlashTimer = null;
    this.saveIndicator?.classList.remove("is-visible");
  }

  tickPlaytime(seconds) {
    if (!this.state || !this.active) return;
    this.state.playTime = Math.max(0, Number(this.state.playTime) || 0) + seconds;
    this.saveStore.save(this.state);
    this.onStateChange?.(this.state, { quiet: true });
  }

  /* ------------------------------------------------------------------ */
  /* Accesseurs                                                         */
  /* ------------------------------------------------------------------ */

  get currentChapter() {
    return this.chapter;
  }

  get currentPage() {
    return this.page;
  }

  get isActive() {
    return this.active;
  }

  get isPianoOpen() {
    return this.piano.isOpen;
  }

  getState() {
    return this.state;
  }

  pausePiano() {
    if (this.piano.isOpen) this.piano.pause();
  }

  resumePiano() {
    if (this.piano.isOpen) this.piano.resume();
  }

  setNoteLabels(value) {
    this.piano.setNoteLabels(value);
  }

  refreshAudio() {
    if (!this.active) return;
    const page = this.page;
    const chapter = this.chapter;
    if (!page || !chapter) return;
    const music = Object.prototype.hasOwnProperty.call(page, "music") ? page.music : chapter.music;
    if (music) audio.playMusic(music);
    const ambience = Object.prototype.hasOwnProperty.call(page, "ambience") ? page.ambience : chapter.ambience;
    audio.setAmbience(ambience ?? null);
  }
}
