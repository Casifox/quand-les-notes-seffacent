import { Atmosphere } from "./core/atmosphere.js";
import { audio } from "./core/audio.js";
import { frenchNoteName } from "./core/notes.js";
import { saveStore, settingsStore } from "./core/storage.js";
import { escapeHTML, formatDate, formatPlayTime } from "./core/utils.js";
import { getEnding } from "./data/endings.js";
import { MEMORIES, MEMORY_ICONS, MEMORY_TOTAL, getMemory } from "./data/memories.js";
import { PUZZLES } from "./data/puzzles.js";
import { StoryEngine } from "./game/engine.js";
import { CHAPTERS, getChapter } from "./story/index.js";
import { staffSVG } from "./ui/staff.js";

const $ = (selector, root = document) => root.querySelector(selector);
const TITLE_SCREEN = "title";
const GAME_SCREEN = "game";
const END_SCREEN = "end";
const BACKGROUNDS = [
  "gare", "arrivee", "atelier", "cuisine", "plage", "grenier",
  "tempete", "phare", "epilogue"
];

const TEXT_SPEEDS = {
  slow: 55,
  normal: 24,
  fast: 9,
  instant: 0
};

class App {
  constructor() {
    this.settings = settingsStore.load();
    this.currentScreen = TITLE_SCREEN;
    this.currentState = null;
    this.lastEndState = null;
    this.engine = null;
    this.slotsMode = "new";
    this.slots = [];
    this.dialogOpeners = new WeakMap();
    this.suppressDialogFocus = false;
    this.menuPausedPiano = false;
    this.confirmResolver = null;
    this.audioFailureNotified = false;
    this.currentMemoryId = null;
    this.playtimeTimer = null;
  }

  async init() {
    this.#cacheDom();
    this.titleAtmosphere = new Atmosphere(this.dom.titleCanvas);
    this.sceneAtmosphere = new Atmosphere(this.dom.sceneCanvas);
    this.engine = new StoryEngine({
      saveStore,
      atmosphere: this.sceneAtmosphere,
      getTextSpeed: () => this.#textSpeed(),
      getNoteLabels: () => Boolean(this.settings.noteLabels),
      onStateChange: (state) => {
        this.currentState = state;
        if (this.dom.menuDialog.open) this.#updateMenuInfo();
      },
      onFinish: (state) => this.showEndScreen(state),
      onNotify: (message, type) => this.toast(message, type)
    });

    this.#prepareDialogs();
    this.#bindEvents();
    this.#applyRuntimeSettings();
    this.#updateTitleContinue();
    this.#updateSoundUI();
    this.#updateFullscreenLabel();
    this.titleAtmosphere.setMode("motes");
    this.currentScreen = TITLE_SCREEN;
    this.#showScreen(TITLE_SCREEN);
    this.#setupDebug();
    this.#startPlaytimeClock();
    await this.#finishBoot();
  }

  #cacheDom() {
    this.dom = {
      boot: $("#boot"),
      bootStatus: $(".boot-status"),
      app: $("#app"),
      skipLink: $("#skip-link"),
      titleScreen: $("#screen-title"),
      gameScreen: $("#screen-game"),
      endScreen: $("#screen-end"),
      titleCanvas: $("#atmosphere"),
      sceneCanvas: $("#scene-atmosphere"),
      titleSound: $("#btn-title-sound"),
      gameSound: $("#btn-game-sound"),
      pianoSound: $("#piano-sound"),
      pianoLabels: $("#piano-labels"),
      titleSettings: $("#btn-title-settings"),
      titleCredits: $("#btn-title-credits"),
      titleSlots: $("#btn-title-slots"),
      titleFullscreen: $("#btn-title-fullscreen"),
      newGame: $("#btn-new-game"),
      continueGame: $("#btn-continue"),
      continueMeta: $("#continue-meta"),
      gameJournal: $("#btn-journal"),
      dialogueJournal: $("#btn-dialogue-journal"),
      dialogueSave: $("#btn-dialogue-save"),
      menuButton: $("#btn-menu"),
      pianoMenu: $("#piano-menu"),
      slotsDialog: $("#slots-dialog"),
      slotsTitle: $("#slots-title"),
      slotsLead: $("#slots-dialog .modal-lead"),
      slotsList: $("#slots-list"),
      slotNote: $("#slot-mode-note"),
      menuDialog: $("#menu-dialog"),
      menuContext: $("#menu-context"),
      menuResume: $("#menu-resume"),
      menuSave: $("#menu-save"),
      menuSaveMeta: $("#menu-save-meta"),
      menuJournal: $("#menu-journal"),
      menuJournalCount: $("#menu-journal-count"),
      menuSettings: $("#menu-settings"),
      menuCredits: $("#menu-credits"),
      menuTitle: $("#btn-menu-title"),
      settingsDialog: $("#settings-dialog"),
      creditsDialog: $("#credits-dialog"),
      journalDialog: $("#journal-dialog"),
      journalList: $("#journal-list"),
      journalDetail: $("#journal-detail"),
      journalProgress: $("#journal-progress"),
      confirmDialog: $("#confirm-dialog"),
      confirmTitle: $("#confirm-title"),
      confirmText: $("#confirm-text"),
      confirmOk: $("#confirm-ok"),
      confirmCancel: $("#confirm-cancel"),
      rangeMusic: $("#range-music"),
      rangePiano: $("#range-piano"),
      rangeAmbience: $("#range-ambience"),
      outMusic: $("#out-music"),
      outPiano: $("#out-piano"),
      outAmbience: $("#out-ambience"),
      speedOptions: $("#speed-options"),
      toggleMotion: $("#toggle-motion"),
      toggleLabels: $("#toggle-labels"),
      toggleSound: $("#toggle-sound"),
      clearSaves: $("#btn-clear-saves"),
      endKicker: $("#end-kicker"),
      endTitle: $("#end-title"),
      endQuote: $("#end-quote"),
      endSummary: $("#end-summary"),
      endMemoryCount: $("#end-memory-count"),
      endCoda: $("#end-coda"),
      endCredit: $("#end-credit"),
      endJournal: $("#btn-end-journal"),
      endTitleButton: $("#btn-end-title"),
      endReplay: $("#btn-end-replay")
    };
  }

  #bindEvents() {
    this.dom.newGame.addEventListener("click", () => this.openSlots("new"));
    this.dom.continueGame.addEventListener("click", () => this.continueLatest());
    this.dom.titleSlots.addEventListener("click", () => this.openSlots("load"));
    this.dom.titleSettings.addEventListener("click", () => this.openSettings());
    this.dom.titleCredits.addEventListener("click", () => this.openCredits());
    this.dom.titleFullscreen.addEventListener("click", () => this.toggleFullscreen());
    [this.dom.titleSound, this.dom.gameSound, this.dom.pianoSound].forEach((button) => {
      button?.addEventListener("click", () => this.toggleSound());
    });
    this.dom.pianoLabels.addEventListener("click", () => {
      this.settings.noteLabels = !this.settings.noteLabels;
      this.#applyRuntimeSettings(true);
      if (this.dom.journalDialog.open && this.currentMemoryId) {
        this.#renderJournalDetail(this.currentMemoryId);
      }
    });

    this.dom.gameJournal.addEventListener("click", () => this.openJournal());
    this.dom.dialogueJournal.addEventListener("click", () => this.openJournal());
    this.dom.dialogueSave.addEventListener("click", () => {
      if (!this.engine?.getState()) return;
      this.engine.saveNow({ manual: true });
    });
    this.dom.menuButton.addEventListener("click", () => this.openMenu());
    this.dom.pianoMenu.addEventListener("click", () => this.openMenu());

    this.dom.menuResume.addEventListener("click", () => this.dom.menuDialog.close());
    this.dom.menuSave.addEventListener("click", () => {
      if (!this.engine?.getState()) return;
      this.engine.saveNow({ manual: true });
      this.#updateMenuInfo();
    });
    this.dom.menuJournal.addEventListener("click", () => this.openJournal());
    this.dom.menuSettings.addEventListener("click", () => this.openSettings());
    this.dom.menuCredits.addEventListener("click", () => this.openCredits());
    this.dom.menuTitle.addEventListener("click", () => {
      this.engine?.saveNow();
      this.#closeAllDialogs(true);
      this.returnToTitle();
    });

    this.dom.endJournal.addEventListener("click", () => {
      this.currentState = this.lastEndState ?? this.currentState;
      this.openJournal();
    });
    this.dom.endTitleButton.addEventListener("click", () => this.returnToTitle());
    this.dom.endReplay.addEventListener("click", () => {
      this.returnToTitle();
      this.openSlots("new");
    });

    this.dom.rangeMusic.addEventListener("input", () => this.#setVolume("music"));
    this.dom.rangePiano.addEventListener("input", () => this.#setVolume("piano"));
    this.dom.rangeAmbience.addEventListener("input", () => this.#setVolume("ambience"));

    this.dom.speedOptions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-speed]");
      if (!button) return;
      this.settings.speed = button.dataset.speed;
      this.#applyRuntimeSettings(true);
    });
    this.dom.toggleMotion.addEventListener("change", () => {
      this.settings.reducedMotion = this.dom.toggleMotion.checked;
      this.#applyRuntimeSettings(true);
    });
    this.dom.toggleLabels.addEventListener("change", () => {
      this.settings.noteLabels = this.dom.toggleLabels.checked;
      this.#applyRuntimeSettings(true);
      if (this.dom.journalDialog.open && this.currentMemoryId) {
        this.#renderJournalDetail(this.currentMemoryId);
      }
    });
    this.dom.toggleSound.addEventListener("change", async () => {
      const shouldUnmute = this.dom.toggleSound.checked;
      this.settings.muted = !shouldUnmute;
      if (shouldUnmute) await this.ensureAudio();
      await this.audioApplyMute();
      this.#applyRuntimeSettings(true);
      if (shouldUnmute) this.#refreshAudioForScreen();
    });
    this.dom.clearSaves.addEventListener("click", () => this.clearAllSaves());

    this.dom.slotsList.addEventListener("click", (event) => this.#handleSlotClick(event));
    this.dom.journalList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-memory]");
      if (!button || button.disabled) return;
      this.#renderJournalDetail(button.dataset.memory);
    });
    this.dom.journalDetail.addEventListener("click", (event) => {
      const button = event.target.closest("[data-play-memory]");
      if (button) this.#playMemoryFragment(button.dataset.playMemory, button);
    });

    this.dom.confirmOk.addEventListener("click", () => {
      const resolve = this.confirmResolver;
      this.confirmResolver = null;
      this.dom.confirmDialog.close();
      resolve?.(true);
    });
    this.dom.confirmCancel.addEventListener("click", () => {
      const resolve = this.confirmResolver;
      this.confirmResolver = null;
      this.dom.confirmDialog.close();
      resolve?.(false);
    });
    this.dom.confirmDialog.addEventListener("close", () => {
      if (this.confirmResolver) {
        const resolve = this.confirmResolver;
        this.confirmResolver = null;
        resolve(false);
      }
    });

    document.addEventListener("keydown", (event) => this.#handleGlobalKey(event), true);
    document.addEventListener("fullscreenchange", () => this.#updateFullscreenLabel());
    window.addEventListener("beforeunload", () => {
      if (this.currentScreen === GAME_SCREEN && this.engine?.isActive) {
        this.engine.saveNow();
      }
    });

    this.dom.menuDialog.addEventListener("close", () => {
      if (this.menuPausedPiano && this.currentScreen === GAME_SCREEN) {
        this.menuPausedPiano = false;
        window.setTimeout(() => this.engine?.resumePiano(), 60);
      } else {
        this.menuPausedPiano = false;
      }
    });

    this.#installFirstGesture();
  }

  #prepareDialogs() {
    document.querySelectorAll("dialog.modal").forEach((dialog) => {
      dialog.addEventListener("close", () => {
        this.#syncDialogState();
        const opener = this.dialogOpeners.get(dialog);
        if (!this.suppressDialogFocus && opener?.isConnected) {
          window.setTimeout(() => opener.focus({ preventScroll: true }), 20);
        }
      });
      dialog.querySelectorAll("[data-close]").forEach((button) => {
        button.addEventListener("click", () => dialog.close());
      });
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
        if (outside) dialog.close();
      });
    });
    this.#syncDialogState();
  }

  #installFirstGesture() {
    const gesture = () => {
      document.removeEventListener("pointerdown", gesture, true);
      document.removeEventListener("keydown", gesture, true);
      if (this.settings.muted) return;
      this.ensureAudio().then((ok) => {
        if (!ok) return;
        if (this.currentScreen === TITLE_SCREEN) {
          audio.playMusic("title");
          audio.setAmbience("sea");
        }
      });
    };
    document.addEventListener("pointerdown", gesture, true);
    document.addEventListener("keydown", gesture, true);
  }

  /* ------------------------------------------------------------------ */
  /* Écrans                                                             */
  /* ------------------------------------------------------------------ */

  #showScreen(name) {
    this.currentScreen = name;
    this.dom.app.dataset.screen = name;
    if (this.dom.skipLink) this.dom.skipLink.hidden = name !== GAME_SCREEN;
    const screens = {
      [TITLE_SCREEN]: this.dom.titleScreen,
      [GAME_SCREEN]: this.dom.gameScreen,
      [END_SCREEN]: this.dom.endScreen
    };
    Object.entries(screens).forEach(([key, element]) => {
      const active = key === name;
      element.hidden = !active;
      element.classList.toggle("is-active", active);
    });
    if (name === TITLE_SCREEN) {
      this.titleAtmosphere?.setMode("motes");
      this.sceneAtmosphere?.setMode("none");
    } else if (name === GAME_SCREEN) {
      this.titleAtmosphere?.setMode("none");
    } else {
      this.titleAtmosphere?.setMode("none");
      this.sceneAtmosphere?.setMode("none");
    }
  }

  returnToTitle() {
    if (this.engine?.isActive) this.engine.saveNow();
    this.#closeAllDialogs(true);
    this.engine?.stop();
    this.currentState = null;
    this.#showScreen(TITLE_SCREEN);
    this.#updateTitleContinue();
    this.#updateSoundUI();
    if (audio.ready && !this.settings.muted) {
      audio.playMusic("title");
      audio.setAmbience("sea");
    }
    window.setTimeout(() => this.dom.newGame.focus({ preventScroll: true }), 100);
  }

  async enterGame(state) {
    this.currentState = state;
    this.#closeAllDialogs(true);
    this.#showScreen(GAME_SCREEN);
    this.dom.gameScreen.scrollTop = 0;
    this.engine.start(state);
    this.#updateSoundUI();
    this.#updateTitleContinue();
    window.setTimeout(() => {
      if (!this.engine?.isActive || this.engine.chapterCardOpen) return;
      if (this.engine.isPianoOpen) return;
      const next = document.getElementById("btn-next");
      if (next && !next.hidden) next.focus({ preventScroll: true });
    }, 140);
  }

  showEndScreen(state) {
    if (!state) return;
    this.lastEndState = state;
    this.currentState = state;
    this.#closeAllDialogs(true);
    this.engine?.stop();
    this.#showScreen(END_SCREEN);
    const ending = getEnding(state.ending);
    this.dom.endKicker.textContent = ending.kicker;
    this.dom.endTitle.textContent = ending.title;
    this.dom.endQuote.textContent = ending.quote;
    this.dom.endSummary.textContent = ending.summary;
    this.dom.endCredit.textContent = ending.credit;
    this.dom.endMemoryCount.textContent = String(state.memories?.length ?? 0);
    const coda = scoreCoda(state);
    this.dom.endCoda.textContent = coda.length ? String(coda.length) : "—";
    if (audio.ready && !this.settings.muted) {
      audio.playMusic("epilogue");
      audio.setAmbience("sea");
    }
    this.#updateTitleContinue();
    window.setTimeout(() => this.dom.endJournal.focus({ preventScroll: true }), 120);
  }

  /* ------------------------------------------------------------------ */
  /* Audio & réglages                                                   */
  /* ------------------------------------------------------------------ */

  async ensureAudio() {
    if (audio.failed) return false;
    const ok = await audio.start();
    if (!ok && !this.audioFailureNotified) {
      this.audioFailureNotified = true;
      this.toast("Le son n'a pas pu démarrer. Le jeu reste jouable.", "error");
    }
    return ok;
  }

  async toggleSound() {
    this.settings.muted = !this.settings.muted;
    settingsStore.save(this.settings);
    if (!this.settings.muted) {
      const ok = await this.ensureAudio();
      if (!ok) this.settings.muted = true;
    }
    await this.audioApplyMute();
    this.#applyRuntimeSettings();
    if (!this.settings.muted) {
      this.#refreshAudioForScreen();
      this.toast("Son activé.");
    } else {
      this.toast("Son coupé.");
    }
  }

  async audioApplyMute() {
    await audio.setMuted(this.settings.muted);
    this.#updateSoundUI();
  }

  #refreshAudioForScreen() {
    if (!audio.ready || this.settings.muted) return;
    if (this.currentScreen === TITLE_SCREEN) {
      audio.playMusic("title");
      audio.setAmbience("sea");
    } else if (this.currentScreen === GAME_SCREEN) {
      if (!this.engine?.isPianoOpen) this.engine?.refreshAudio();
    } else if (this.currentScreen === END_SCREEN) {
      audio.playMusic("epilogue");
      audio.setAmbience("sea");
    }
  }

  #setVolume(name) {
    const map = {
      music: { input: this.dom.rangeMusic, output: this.dom.outMusic },
      piano: { input: this.dom.rangePiano, output: this.dom.outPiano },
      ambience: { input: this.dom.rangeAmbience, output: this.dom.outAmbience }
    };
    const { input, output } = map[name];
    const value = Number(input.value);
    this.settings[name] = value / 100;
    output.textContent = String(value);
    const values = {
      music: this.settings.music,
      piano: this.settings.piano,
      ambience: this.settings.ambience,
      muted: this.settings.muted
    };
    audio.updateSettings(values);
    settingsStore.save(this.settings);
  }

  #applyRuntimeSettings(persist = false) {
    document.documentElement.dataset.textSpeed = this.settings.speed;
    document.documentElement.dataset.motion = this.settings.reducedMotion ? "reduced" : "normal";
    document.documentElement.classList.toggle("is-muted", this.settings.muted);
    audio.updateSettings({
      music: this.settings.music,
      piano: this.settings.piano,
      ambience: this.settings.ambience,
      muted: this.settings.muted
    });
    this.titleAtmosphere?.setReducedMotion(this.settings.reducedMotion);
    this.sceneAtmosphere?.setReducedMotion(this.settings.reducedMotion);
    this.engine?.setNoteLabels(Boolean(this.settings.noteLabels));
    if (persist) settingsStore.save(this.settings);
    this.#reflectSettingsControls();
    this.#updateSoundUI();
  }

  #reflectSettingsControls() {
    if (!this.dom) return;
    const setRange = (input, output, value) => {
      if (!input) return;
      input.value = String(Math.round(value * 100));
      output.textContent = String(Math.round(value * 100));
    };
    setRange(this.dom.rangeMusic, this.dom.outMusic, this.settings.music);
    setRange(this.dom.rangePiano, this.dom.outPiano, this.settings.piano);
    setRange(this.dom.rangeAmbience, this.dom.outAmbience, this.settings.ambience);
    this.dom.speedOptions.querySelectorAll("[data-speed]").forEach((button) => {
      const active = button.dataset.speed === this.settings.speed;
      button.setAttribute("aria-pressed", String(active));
    });
    this.dom.toggleMotion.checked = this.settings.reducedMotion;
    this.dom.toggleLabels.checked = this.settings.noteLabels;
    this.dom.toggleSound.checked = !this.settings.muted;
  }

  #updateSoundUI() {
    if (!this.dom) return;
    const muted = this.settings.muted;
    document.documentElement.classList.toggle("is-muted", muted);
    [this.dom.titleSound, this.dom.gameSound, this.dom.pianoSound].forEach((button) => {
      if (!button) return;
      button.classList.toggle("is-muted", muted);
      button.setAttribute("aria-label", muted ? "Activer le son" : "Couper le son");
      button.setAttribute("title", muted ? "Activer le son" : "Couper le son");
      button.removeAttribute("aria-pressed");
    });
    if (this.dom.toggleSound) this.dom.toggleSound.checked = !muted;
    const labelsButton = this.dom.pianoLabels ?? document.getElementById("piano-labels");
    if (labelsButton) {
      labelsButton.setAttribute("aria-pressed", String(Boolean(this.settings.noteLabels)));
      labelsButton.textContent = this.settings.noteLabels ? "Noms des notes" : "Notes masquées";
    }
  }

  #textSpeed() {
    return TEXT_SPEEDS[this.settings.speed] ?? TEXT_SPEEDS.normal;
  }

  /* ------------------------------------------------------------------ */
  /* Carnets                                                            */
  /* ------------------------------------------------------------------ */

  updateSlots() {
    this.slots = saveStore.list();
  }

  #updateTitleContinue() {
    if (!this.dom) return;
    const latest = saveStore.latest();
    this.dom.continueGame.disabled = !latest;
    if (!latest) {
      this.dom.continueMeta.textContent = "Aucun carnet ouvert.";
      return;
    }
    const chapter = getChapter(latest.chapterId);
    const slotLabel = `Carnet ${String(latest.slot + 1).padStart(2, "0")}`;
    let detail = "";
    if (latest.finished) {
      const ending = getEnding(latest.ending);
      detail = `Histoire terminée · ${ending.kicker}.`;
    } else if (chapter) {
      detail = `${chapter.label} · ${chapter.title}.`;
    }
    this.dom.continueMeta.textContent = `${slotLabel}. ${detail} Dernière sauvegarde : ${formatDate(latest.updatedAt, "short")}.`;
  }

  openSlots(mode = "new") {
    this.slotsMode = mode;
    this.updateSlots();
    this.dom.slotsTitle.textContent = mode === "new" ? "Choisir un carnet" : "Reprendre là où le souvenir s'arrête";
    this.dom.slotsLead.textContent = mode === "new"
      ? "Chaque histoire possède son carnet. Le jeu s'y inscrit tout seul, à chaque scène."
      : "Trois carnets. Vos choix, vos souvenirs et votre progression y attendent.";
    this.dom.slotNote.textContent = mode === "new"
      ? "Choisissez un carnet vide, ou remplacez une histoire existante."
      : "Vous pouvez aussi commencer une nouvelle histoire sur un carnet libre.";
    this.#renderSlots();
    this.#openDialog(this.dom.slotsDialog, ".slot-card button");
  }

  #renderSlots() {
    const mode = this.slotsMode;
    const entries = this.slots;
    this.dom.slotsList.innerHTML = entries.map(({ slot, state }) => {
      const slotNumber = String(slot + 1).padStart(2, "0");
      if (!state) {
        return `
          <article class="slot-card is-empty" data-folio="${slotNumber} / 03">
            <span class="slot-index">CARNET ${slotNumber}</span>
            <p class="slot-day">Libre</p>
            <p class="slot-empty-title">Un carnet encore vierge.</p>
            <span class="slot-empty-line" aria-hidden="true"></span>
            <p class="slot-empty-note">Les sept journées y laisseront leurs traces.</p>
            <div class="slot-actions">
              <button class="btn btn-primary" type="button" data-slot="${slot}" data-action="new">Commencer ici</button>
            </div>
          </article>`;
      }
      const chapter = getChapter(state.chapterId);
      const ending = state.finished ? getEnding(state.ending) : null;
      const day = ending ? "Histoire terminée" : chapter?.label ?? "Carnet";
      const title = ending ? ending.title : chapter?.title ?? "Une histoire en cours";
      const meta = `${formatDate(state.updatedAt, "short")} · ${state.memories.length} souvenir${state.memories.length > 1 ? "s" : ""} · ${formatPlayTime(state.playTime)}`;
      const primaryLabel = state.finished ? "Voir la fin" : "Reprendre";
      return `
        <article class="slot-card" data-folio="${slotNumber} / 03">
          <span class="slot-index">CARNET ${slotNumber}</span>
          <p class="slot-day">${escapeHTML(day)}</p>
          <p class="slot-title">${escapeHTML(title)}</p>
          <p class="slot-meta">${escapeHTML(meta)}</p>
          <div class="slot-actions">
            <button class="btn btn-primary" type="button" data-slot="${slot}" data-action="load">${primaryLabel}</button>
            ${mode === "new" ? `<button class="btn btn-ghost" type="button" data-slot="${slot}" data-action="new">Nouvelle histoire</button>` : ""}
          </div>
          <button class="slot-delete" type="button" data-slot="${slot}" data-action="delete" aria-label="Effacer le carnet ${slotNumber}" title="Effacer ce carnet">×</button>
        </article>`;
    }).join("");
    const focusTarget = this.dom.slotsList.querySelector(".slot-card button");
    if (focusTarget && this.dom.slotsDialog.open) focusTarget.focus({ preventScroll: true });
  }

  #handleSlotClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const slot = Number(button.dataset.slot);
    const action = button.dataset.action;
    if (!Number.isInteger(slot)) return;
    if (action === "delete") {
      this.#deleteSlot(slot);
    } else if (action === "load") {
      this.#loadSlot(slot);
    } else if (action === "new") {
      this.#startNewGame(slot);
    }
  }

  async #deleteSlot(slot) {
    const state = saveStore.load(slot);
    if (!state) return;
    const confirmed = await this.askConfirm({
      title: "Effacer ce carnet ?",
      text: "La progression de ce carnet sera définitivement perdue. Les préférences et les autres carnets ne bougeront pas.",
      okLabel: "Effacer le carnet"
    });
    if (!confirmed) return;
    saveStore.delete(slot);
    this.updateSlots();
    this.#renderSlots();
    this.#updateTitleContinue();
    this.toast("Le carnet a été effacé.");
  }

  async #startNewGame(slot) {
    const existing = saveStore.load(slot);
    if (existing) {
      const confirmed = await this.askConfirm({
        title: "Commencer une nouvelle histoire ?",
        text: `Le carnet ${String(slot + 1).padStart(2, "0")} contient déjà une progression. Elle sera remplacée par une nouvelle histoire, dès le prologue.`,
        okLabel: "Remplacer le carnet"
      });
      if (!confirmed) return;
    }
    await this.ensureAudio();
    const state = saveStore.createState(slot);
    saveStore.save(state);
    this.currentState = state;
    this.#closeAllDialogs(true);
    this.enterGame(state);
  }

  async #loadSlot(slot) {
    const state = saveStore.load(slot);
    if (!state) {
      this.toast("Ce carnet n'a pas pu être lu.", "error");
      return;
    }
    await this.ensureAudio();
    this.currentState = state;
    this.#closeAllDialogs(true);
    if (state.finished) this.showEndScreen(state);
    else this.enterGame(state);
  }

  continueLatest() {
    const state = saveStore.latest();
    if (!state) {
      this.toast("Aucun carnet à reprendre.", "error");
      return;
    }
    this.#loadSlot(state.slot);
  }

  async clearAllSaves() {
    const confirmed = await this.askConfirm({
      title: "Effacer toutes les histoires ?",
      text: "Les trois carnets et toute la progression seront effacés de ce navigateur. Les réglages resteront en place.",
      okLabel: "Tout effacer"
    });
    if (!confirmed) return;
    saveStore.clearAll();
    this.#closeAllDialogs(true);
    if (this.currentScreen === GAME_SCREEN || this.currentScreen === END_SCREEN) {
      this.engine?.stop();
      this.currentState = null;
      this.#showScreen(TITLE_SCREEN);
      if (audio.ready && !this.settings.muted) {
        audio.playMusic("title");
        audio.setAmbience("sea");
      }
    }
    this.#updateTitleContinue();
    this.toast("Tous les carnets ont été effacés.");
  }

  /* ------------------------------------------------------------------ */
  /* Menu                                                               */
  /* ------------------------------------------------------------------ */

  openMenu() {
    if (this.currentScreen !== GAME_SCREEN || !this.engine?.isActive) return;
    if (this.engine.isPianoOpen) {
      this.engine.pausePiano();
      this.menuPausedPiano = true;
    } else {
      this.menuPausedPiano = false;
    }
    this.#updateMenuInfo();
    this.#openDialog(this.dom.menuDialog, "#menu-resume");
  }

  #updateMenuInfo() {
    if (!this.dom || !this.currentState) return;
    const chapter = getChapter(this.currentState.chapterId);
    this.dom.menuContext.textContent = chapter
      ? `${chapter.label} · ${chapter.title}`
      : "Le carnet";
    this.dom.menuJournalCount.textContent = `${this.currentState.memories.length} / ${MEMORY_TOTAL}`;
    this.dom.menuSaveMeta.textContent = this.currentState.updatedAt
      ? formatDate(this.currentState.updatedAt, "short")
      : "";
  }

  /* ------------------------------------------------------------------ */
  /* Journal                                                            */
  /* ------------------------------------------------------------------ */

  openJournal() {
    const state = this.currentState ?? saveStore.latest();
    if (!state) {
      this.toast("Le carnet n'est pas encore ouvert.", "error");
      return;
    }
    this.currentState = state;
    const unlocked = state.memories ?? [];
    this.dom.journalProgress.textContent = `${unlocked.length} souvenir${unlocked.length > 1 ? "s" : ""} sur ${MEMORY_TOTAL}`;
    this.dom.journalList.innerHTML = MEMORIES.map((memory, index) => {
      const isUnlocked = unlocked.includes(memory.id);
      const button = `
        <button class="journal-entry${isUnlocked ? "" : " is-locked"}" type="button"
          data-memory="${memory.id}" aria-current="false" ${isUnlocked ? "" : "disabled"}>
          <span class="journal-entry-index">${String(index + 1).padStart(2, "0")}</span>
          <span>
            <span class="journal-entry-title">${escapeHTML(memory.title)}</span>
            <span class="journal-entry-day">${escapeHTML(memory.day)}</span>
          </span>
        </button>`;
      return button;
    }).join("");

    const available = MEMORIES.filter((memory) => unlocked.includes(memory.id));
    const fallback = available[available.length - 1]?.id ?? null;
    const selected = this.currentMemoryId && unlocked.includes(this.currentMemoryId)
      ? this.currentMemoryId
      : fallback;
    this.currentMemoryId = selected;
    this.#renderJournalDetail(selected);
    this.#openDialog(this.dom.journalDialog, selected ? `[data-memory="${selected}"]` : ".modal-close");
  }

  #renderJournalDetail(memoryId) {
    const state = this.currentState;
    if (!state) return;
    this.dom.journalList.querySelectorAll("[data-memory]").forEach((button) => {
      button.setAttribute("aria-current", String(button.dataset.memory === memoryId));
    });

    if (!memoryId) {
      this.dom.journalDetail.innerHTML = `
        <div class="journal-detail-empty">
          <p class="eyebrow">Les pages sont encore blanches</p>
          <h3>Ce que la musique garde</h3>
          <p>Les souvenirs viendront en jouant. Chaque fragment retrouvé au piano laissera une trace dans ce carnet : une image, une phrase, parfois quatre notes.</p>
        </div>`;
      return;
    }

    const memory = getMemory(memoryId);
    if (!memory) return;
    this.currentMemoryId = memoryId;
    const unlocked = state.memories?.includes(memory.id);
    if (!unlocked) {
      this.dom.journalDetail.innerHTML = `
        <div class="journal-locked-detail">
          <div class="memory-icon">${MEMORY_ICONS[memory.icon] ?? MEMORY_ICONS.letter}</div>
          <h3>${escapeHTML(memory.title)}</h3>
          <p>Ce souvenir n'a pas encore été retrouvé. Il attend quelque part dans l'une des sept journées.</p>
        </div>`;
      return;
    }

    const notes = this.#notesForMemory(memory);

    this.dom.journalDetail.innerHTML = `
      <div class="memory-header">
        <div class="memory-icon" aria-hidden="true">${MEMORY_ICONS[memory.icon] ?? MEMORY_ICONS.letter}</div>
        <div>
          <p class="memory-kicker">${escapeHTML(memory.kicker)} · ${escapeHTML(memory.chapter)}</p>
          <p class="memory-title">${escapeHTML(memory.title)}</p>
        </div>
      </div>
      <p class="memory-text">${escapeHTML(memory.text)}</p>
      <blockquote class="memory-quote">${escapeHTML(memory.quote)}</blockquote>
      ${notes.length ? `<div class="memory-notes">
        <div class="memory-notes-head">
          <h4>${escapeHTML(memory.noteTitle ?? "Le fragment")}</h4>
          <button class="listen-fragment" type="button" data-play-memory="${memory.id}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h3l5 4V6l-5 4H5ZM17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>
            Écouter
          </button>
        </div>
        <div class="fragment-staff">${staffSVG(notes, {
          showLabels: this.settings.noteLabels,
          label: memory.staffLabel,
          currentIndex: -1,
          completedCount: notes.length
        })}</div>
        ${this.settings.noteLabels ? `<p class="fragment-note-names">${notes.map((note) => frenchNoteName(note)).join(" · ")}</p>` : ""}
      </div>` : ""}`;
  }

  #notesForMemory(memory) {
    const state = this.currentState;
    if (!state) return [];
    if (memory.coda) return scoreCoda(state);
    if (!memory.puzzleId) return [];
    const puzzle = PUZZLES[memory.puzzleId];
    if (!puzzle) return [];
    if (puzzle.mode === "compose") return scoreCoda(state);
    if (typeof puzzle.buildSequence === "function") {
      return puzzle.buildSequence(state).map((entry) => entry.note);
    }
    return puzzle.notes ?? [];
  }

  async #playMemoryFragment(memoryId, button) {
    const memory = getMemory(memoryId);
    if (!memory) return;
    if (this.settings.muted) {
      this.toast("Le son est coupé. Activez-le pour écouter le fragment.", "error");
      return;
    }
    const ok = await this.ensureAudio();
    if (!ok) return;
    const notes = this.#notesForMemory(memory);
    if (!notes.length) return;
    const label = button.innerHTML;
    button.disabled = true;
    button.textContent = "Écoute…";
    audio.playPhrase(notes, {
      noteMs: 600,
      velocity: 0.48,
      onEnd: () => {
        button.disabled = false;
        button.innerHTML = label;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Réglages & crédits                                                 */
  /* ------------------------------------------------------------------ */

  openSettings() {
    this.#reflectSettingsControls();
    this.#openDialog(this.dom.settingsDialog, "#range-music");
  }

  openCredits() {
    this.#openDialog(this.dom.creditsDialog, ".modal-close");
  }

  async toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        this.toast("Le plein écran n'est pas disponible dans ce navigateur.", "error");
      }
    } catch {
      this.toast("Le plein écran a été refusé par le navigateur.", "error");
    }
  }

  #updateFullscreenLabel() {
    if (!this.dom?.titleFullscreen) return;
    this.dom.titleFullscreen.textContent = document.fullscreenElement ? "Quitter le plein écran" : "Plein écran";
  }

  /* ------------------------------------------------------------------ */
  /* Dialogues / utilitaires                                            */
  /* ------------------------------------------------------------------ */

  #openDialog(dialog, focusSelector) {
    if (!dialog) return;
    const opener = document.activeElement;
    if (!dialog.open) {
      this.dialogOpeners.set(dialog, opener);
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
      }
    }
    this.#syncDialogState();
    window.setTimeout(() => {
      const target = focusSelector ? dialog.querySelector(focusSelector) : dialog.querySelector(".modal-close");
      target?.focus({ preventScroll: true });
    }, 40);
  }

  #syncDialogState() {
    document.body.classList.toggle("is-dialog-open", Boolean(document.querySelector("dialog[open]")));
  }

  #closeAllDialogs(suppressFocus = false) {
    this.suppressDialogFocus = suppressFocus;
    this.menuPausedPiano = false;
    document.querySelectorAll("dialog.modal[open]").forEach((dialog) => {
      try { dialog.close(); } catch { /* déjà fermé */ }
    });
    window.setTimeout(() => {
      this.suppressDialogFocus = false;
    }, 80);
    this.#syncDialogState();
  }

  askConfirm({ title, text, okLabel = "Confirmer" }) {
    return new Promise((resolve) => {
      if (this.confirmResolver) {
        this.confirmResolver(false);
        this.confirmResolver = null;
      }
      this.confirmResolver = resolve;
      this.dom.confirmTitle.textContent = title;
      this.dom.confirmText.textContent = text;
      this.dom.confirmOk.textContent = okLabel;
      this.#openDialog(this.dom.confirmDialog, "#confirm-cancel");
    });
  }

  toast(message, type = "info") {
    if (!this.dom?.app) return;
    const region = document.getElementById("toast-region");
    if (!region) return;
    if (region.children.length >= 3) region.firstElementChild?.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    if (type === "error") toast.dataset.type = "error";
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 320);
    }, 3600);
  }

  #handleGlobalKey(event) {
    if (event.defaultPrevented) return;
    const target = event.target;
    const isFormField = target instanceof HTMLElement
      && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);
    if (isFormField) return;

    const dialogOpen = Boolean(document.querySelector("dialog[open]"));
    if (dialogOpen) return;

    if (this.currentScreen === GAME_SCREEN) {
      if (event.code === "Escape") {
        event.preventDefault();
        this.openMenu();
        return;
      }
      if (this.engine?.isPianoOpen) {
        this.engine.piano.handleKeyDown(event);
        return;
      }
      if (event.code === "KeyM") {
        event.preventDefault();
        this.toggleSound();
        return;
      }
      this.engine?.handleKeyDown(event);
      return;
    }

    if (this.currentScreen === TITLE_SCREEN && event.code === "KeyM") {
      event.preventDefault();
      this.toggleSound();
    }
  }

  #startPlaytimeClock() {
    this.playtimeTimer = window.setInterval(() => {
      if (document.hidden) return;
      if (this.currentScreen === GAME_SCREEN && this.engine?.isActive) {
        this.engine.tickPlaytime(30);
      }
    }, 30000);
  }

  async #finishBoot() {
    this.dom.bootStatus.textContent = "On accorde le piano…";
    await Promise.race([this.#preloadArtwork(), new Promise((resolve) => window.setTimeout(resolve, 2200))]);
    this.dom.bootStatus.textContent = "La maison est prête.";
    this.dom.boot.classList.add("is-hidden");
    this.dom.app.classList.add("is-ready");
    if (!saveStore.storageAvailable) {
      window.setTimeout(() => {
        this.toast("Le stockage local est indisponible : la progression ne survivra pas à la fermeture de l'onglet.", "error");
      }, 1200);
    }
  }

  #preloadArtwork() {
    return Promise.all(
      BACKGROUNDS.map((name) => new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(name);
        image.onerror = () => resolve(name);
        image.src = `./assets/art/backgrounds/${name}.svg`;
      }))
    );
  }

  #setupDebug() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("debug")) return;
    const app = this;
    window.__QLNSE__ = {
      app,
      get engine() { return app.engine; },
      audio,
      saveStore,
      jumpTo(chapterId, pageIndex = 0, options = {}) {
        const state = saveStore.createState(options.slot ?? 0);
        state.chapterId = chapterId;
        state.pageIndex = pageIndex;
        state.flags = { ...(options.flags ?? {}) };
        state.memories = [...(options.memories ?? [])];
        state.seenIntros = options.cards ? [] : CHAPTERS.map((chapter) => chapter.id);
        state.ending = options.ending ?? null;
        state.finished = false;
        saveStore.save(state);
        app.currentState = state;
        app.enterGame(state);
        return state;
      },
      setCoda(coda = ["E4", "G4", "E5", "A4"]) {
        if (!app.currentState) return;
        app.currentState.flags.coda = coda;
        saveStore.save(app.currentState);
      }
    };
    console.info("Mode test actif : window.__QLNSE__");
  }
}

function scoreCoda(state) {
  if (!state) return [];
  const coda = state.flags?.coda;
  if (Array.isArray(coda) && coda.length === 4) return [...coda];
  return ["E4", "G4", "E5", "A4"];
}

const app = new App();

app.init().catch((error) => {
  console.error(error);
  const boot = document.getElementById("boot");
  const status = boot?.querySelector(".boot-status");
  if (status) status.textContent = "Le piano n'a pas pu démarrer. Rechargez la page.";
  const title = boot?.querySelector(".boot-title");
  if (title) title.textContent = "Une erreur est survenue";
  boot?.classList.remove("is-hidden");
});

export { app };
