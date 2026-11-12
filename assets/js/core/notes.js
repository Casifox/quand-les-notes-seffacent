const LETTERS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SOLFEGE = { C: "do", D: "ré", E: "mi", F: "fa", G: "sol", A: "la", B: "si" };
const NATURAL_SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export const WHITE_NOTES = [
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5"
];

export const BLACK_NOTES = [
  "C#4", "D#4", "F#4", "G#4", "A#4",
  "C#5", "D#5", "F#5", "G#5", "A#5"
];

/** Clavier AZERTY/QWERTY-friendly mapping (ZQSD row + QWERTY row). */
export const KEYBOARD_MAP = {
  KeyZ: "C4", KeyS: "C#4", KeyX: "D4", KeyD: "D#4", KeyC: "E4",
  KeyV: "F4", KeyG: "F#4", KeyB: "G4", KeyH: "G#4", KeyN: "A4",
  KeyJ: "A#4", KeyM: "B4",
  KeyQ: "C5", Digit2: "C#5", KeyW: "D5", Digit3: "D#5", KeyE: "E5",
  KeyR: "F5", Digit5: "F#5", KeyT: "G5", Digit6: "G#5", KeyY: "A5",
  Digit7: "A#5", KeyU: "B5"
};

export function parseNote(note) {
  const match = /^([A-G])([#b]?)(-?\d+)$/.exec(note);
  if (!match) throw new Error(`Note invalide : ${note}`);
  const [, letter, accidental, octaveString] = match;
  const octave = Number(octaveString);
  let semitone = NATURAL_SEMITONES[letter];
  if (accidental === "#") semitone += 1;
  if (accidental === "b") semitone -= 1;
  return { letter, accidental, octave, midi: (octave + 1) * 12 + semitone };
}

export function midiFromNote(note) {
  return parseNote(note).midi;
}

export function frequencyFromMidi(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function frequencyFromNote(note) {
  return frequencyFromMidi(midiFromNote(note));
}

export function midiToNote(midi) {
  return `${LETTERS[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

export function frenchNoteName(note, options = {}) {
  const { octave = false, capitalize = false } = options;
  const { letter, accidental, octave: oct } = parseNote(note);
  let name = SOLFEGE[letter];
  if (accidental === "#") name += " dièse";
  if (accidental === "b") name += " bémol";
  if (capitalize) name = name.charAt(0).toUpperCase() + name.slice(1);
  return octave ? `${name} ${oct}` : name;
}

export function shortFrenchName(note) {
  const { letter, accidental, octave } = parseNote(note);
  const accidentalMark = accidental === "#" ? "♯" : accidental === "b" ? "♭" : "";
  return `${SOLFEGE[letter]}${accidentalMark}${octave}`;
}

export function isBlackNote(note) {
  return parseNote(note).accidental !== "";
}

export function noteToDiatonicStep(midi) {
  // Diatonic index with C0 = 0, used for placing notes on a staff.
  const octave = Math.floor(midi / 12) - 1;
  const pitchClass = ((midi % 12) + 12) % 12;
  const steps = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
  return octave * 7 + steps[pitchClass];
}

export function noteNamesFr(notes, options = {}) {
  return notes.map((note) => frenchNoteName(note, options));
}

export function durationToSeconds(beats, bpm) {
  return (60 / bpm) * beats;
}

/** Playable notes (in A minor pentatonic) for the coda editor. */
export const CODA_ALLOWED_NOTES = ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];
