/**
 * Partition originale de « Quand les notes s'effacent ».
 * Chaque événement est joué en temps réel par la Web Audio API.
 * beat : position dans la boucle ; duration : durée en temps.
 */

const P = (note, beat, duration, vel = 0.42) => ({
  instrument: "piano", note, beat, duration, velocity: vel
});
const BASS = (note, beat, duration, vel = 0.32) => ({
  instrument: "bass", note, beat, duration, velocity: vel
});
const PAD = (notes, beat, duration, vel = 0.13) =>
  notes.map((note) => ({ instrument: "pad", note, beat, duration, velocity: vel }));
const BELL = (note, beat, duration, vel = 0.16) => ({
  instrument: "bell", note, beat, duration, velocity: vel
});

const arpPattern = (chord, beat, pattern, options = {}) => {
  const { step = 1, duration = 1.55, vel = 0.2, octave = 0 } = options;
  return pattern.map((index, i) => {
    const note = chord[index];
    if (!note) return [];
    const octaveShift = octave ? Number(note.slice(-1)) + octave : null;
    const finalNote = octaveShift ? note.replace(/-?\d+$/, String(octaveShift)) : note;
    return P(finalNote, beat + i * step, duration, vel);
  }).flat();
};

const voicing = {
  Am: ["A2", "E3", "A3", "C4", "E4"],
  AmHigh: ["A3", "C4", "E4", "G4", "B4"],
  Fmaj7: ["F2", "C3", "F3", "A3", "C4", "E4"],
  F: ["F3", "A3", "C4", "F4"],
  C: ["C3", "G3", "C4", "E4"],
  Cadd9: ["C3", "G3", "C4", "D4", "E4"],
  G: ["G2", "D3", "G3", "B3", "D4"],
  G6: ["G3", "B3", "D4", "E4"],
  D: ["D3", "A3", "D4", "F#4"],
  Dm: ["D3", "A3", "D4", "F4"],
  Dm7: ["D3", "A3", "C4", "F4"],
  Bb: ["Bb2", "F3", "Bb3", "D4"],
  BbMaj7: ["Bb2", "F3", "A3", "D4", "F4"],
  Em7: ["E3", "B3", "D4", "G4"],
  A: ["A2", "E3", "A3", "C#4", "E4"],
  Asus: ["A2", "E3", "A3", "D4", "E4"],
  DMaj: ["D3", "A3", "D4", "F#4"],
  FSharpMinor: ["F#2", "C#3", "F#3", "A3", "C#4"],
  E: ["E2", "B2", "E3", "G#3", "B3"],
  Cmaj7: ["C3", "G3", "B3", "E4"]
};

const padVoicing = (name) => [...voicing[name]].slice(1);
const bassOf = (name) => voicing[name][0];

/* ------------------------------------------------------------------ */
/* Les Mouettes — thème-titre                                         */
/* ------------------------------------------------------------------ */

const titleEvents = [
  ...PAD(padVoicing("Am"), 0, 8, 0.12),
  ...PAD(padVoicing("Fmaj7"), 8, 8, 0.12),
  ...PAD(padVoicing("Cadd9"), 16, 8, 0.115),
  ...PAD(padVoicing("G6"), 24, 8, 0.115),
  BASS(bassOf("Am"), 0, 7.5, 0.3),
  BASS(bassOf("Fmaj7"), 8, 7.5, 0.28),
  BASS(bassOf("Cadd9"), 16, 7.5, 0.27),
  BASS(bassOf("G6"), 24, 7.5, 0.26),

  ...arpPattern(voicing.Am, 0, [2, 4, 1, 3, 4, 3, 2, 1], { step: 1, vel: 0.18, duration: 1.7 }),
  ...arpPattern(voicing.Fmaj7, 8, [2, 3, 5, 4, 3, 4, 2, 1], { step: 1, vel: 0.17, duration: 1.7 }),
  ...arpPattern(voicing.Cadd9, 16, [2, 4, 3, 2, 4, 3, 2, 1], { step: 1, vel: 0.17, duration: 1.7 }),
  ...arpPattern(voicing.G6, 24, [1, 3, 2, 4, 3, 2, 1, 0], { step: 1, vel: 0.16, duration: 1.7 }),

  P("E5", 0, 3.2, 0.42),
  P("D5", 2.3, 1.4, 0.34),
  P("C5", 3.4, 1.6, 0.36),
  P("B4", 5, 2.3, 0.32),
  P("A4", 7, 2.7, 0.4),
  P("C5", 9, 1.3, 0.32),
  P("E5", 10.4, 1.5, 0.37),
  P("F5", 12.1, 2.2, 0.38),
  P("E5", 14.2, 1.4, 0.33),
  P("D5", 15.5, 2, 0.35),
  P("B4", 17.4, 1.7, 0.28),
  P("C5", 19.1, 2.8, 0.34),
  P("B4", 22.1, 1.2, 0.26),
  P("A4", 23.4, 2.1, 0.31),
  P("G4", 25.6, 1.2, 0.25),
  P("A4", 27.2, 4.6, 0.36),
  P("E5", 29.1, 2.6, 0.22),
  BELL("A5", 30.5, 1.6, 0.08)
];

/* ------------------------------------------------------------------ */
/* La maison des marées — piano et quotidien                          */
/* ------------------------------------------------------------------ */

const houseEvents = [
  ...PAD(padVoicing("F"), 0, 8, 0.105),
  ...PAD(padVoicing("Dm7"), 8, 8, 0.1),
  ...PAD(padVoicing("BbMaj7"), 16, 8, 0.1),
  ...PAD(padVoicing("C"), 24, 8, 0.1),
  BASS(bassOf("F"), 0, 7.4, 0.25),
  BASS(bassOf("Dm7"), 8, 7.4, 0.24),
  BASS(bassOf("BbMaj7"), 16, 7.4, 0.23),
  BASS(bassOf("C"), 24, 7.4, 0.23),

  P("C4", 0, 2.4, 0.15), P("F4", 1.5, 1.8, 0.16), P("A4", 3, 2.5, 0.18),
  P("C5", 5.1, 1.7, 0.17), P("F4", 6.3, 1.5, 0.14), P("G4", 8.1, 2.2, 0.16),
  P("A4", 10, 1.8, 0.18), P("C5", 12, 2.1, 0.16), P("D5", 14.1, 1.8, 0.15),
  P("C5", 16, 2.4, 0.18), P("A4", 18.2, 1.6, 0.15), P("F4", 20.2, 2.1, 0.14),
  P("G4", 22.4, 1.8, 0.15), P("A4", 24.2, 2.8, 0.17), P("G4", 27, 1.4, 0.14),
  P("F4", 28.5, 2.4, 0.16), P("A4", 31, 2.2, 0.14),

  ...arpPattern(voicing.F, 0, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.13, duration: 1.5 }),
  ...arpPattern(voicing.Dm7, 8, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.12, duration: 1.5 }),
  ...arpPattern(voicing.BbMaj7, 16, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.12, duration: 1.5 }),
  ...arpPattern(voicing.C, 24, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.12, duration: 1.5 }),
  BELL("C6", 6, 2.2, 0.05),
  BELL("E5", 27.5, 2.5, 0.045)
];

/* ------------------------------------------------------------------ */
/* Les coquillages — marée basse                                      */
/* ------------------------------------------------------------------ */

const shoreEvents = [
  ...PAD(padVoicing("G"), 0, 8, 0.095),
  ...PAD(padVoicing("Em7"), 8, 8, 0.09),
  ...PAD(padVoicing("Cadd9"), 16, 8, 0.09),
  ...PAD(padVoicing("D"), 24, 8, 0.09),
  BASS(bassOf("G"), 0, 7.4, 0.22),
  BASS(bassOf("Em7"), 8, 7.4, 0.21),
  BASS(bassOf("Cadd9"), 16, 7.4, 0.2),
  BASS("D2", 24, 7.4, 0.2),

  P("D5", 0, 2.2, 0.32), P("B4", 2.4, 1.5, 0.26), P("G4", 4.1, 2.6, 0.3),
  P("A4", 6.8, 1.9, 0.26), P("B4", 9, 2.3, 0.3), P("E5", 11.2, 1.9, 0.28),
  P("D5", 13.1, 2.2, 0.27), P("B4", 15.3, 1.7, 0.24), P("A4", 17.2, 2.2, 0.27),
  P("G4", 19.5, 2.4, 0.26), P("C5", 22, 1.6, 0.24), P("B4", 24.1, 2.2, 0.27),
  P("A4", 26.3, 1.8, 0.24), P("G4", 28.1, 3.4, 0.3),
  ...arpPattern(voicing.G, 0, [1, 2, 4, 3, 2, 3], { step: 1.3, vel: 0.12, duration: 1.6 }),
  ...arpPattern(voicing.Em7, 8, [1, 2, 3, 4, 3, 2], { step: 1.3, vel: 0.11, duration: 1.6 }),
  ...arpPattern(voicing.Cadd9, 16, [1, 2, 4, 3, 2, 3], { step: 1.3, vel: 0.11, duration: 1.6 }),
  ...arpPattern(["D3", "A3", "D4", "E4", "A4"], 24, [1, 2, 3, 4, 3, 2], { step: 1.3, vel: 0.11, duration: 1.6 }),
  BELL("G5", 5, 2, 0.04),
  BELL("D6", 20, 2.5, 0.04)
];

/* ------------------------------------------------------------------ */
/* La pluie dans le grenier                                           */
/* ------------------------------------------------------------------ */

const atticEvents = [
  ...PAD(padVoicing("Dm"), 0, 8, 0.1),
  ...PAD(padVoicing("BbMaj7"), 8, 8, 0.1),
  ...PAD(padVoicing("G"), 16, 8, 0.095),
  ...PAD(padVoicing("Asus"), 24, 8, 0.1),
  BASS("D2", 0, 7.4, 0.24),
  BASS("Bb1", 8, 7.4, 0.23),
  BASS("G2", 16, 7.4, 0.23),
  BASS("A2", 24, 7.4, 0.24),
  P("A4", 0, 2.2, 0.27), P("D5", 2.8, 2.5, 0.24), P("C5", 5.7, 1.8, 0.22),
  P("F4", 8.2, 2.1, 0.23), P("A4", 10.8, 1.8, 0.2), P("D5", 13, 2.7, 0.24),
  P("Bb4", 16.3, 2.2, 0.22), P("G4", 18.9, 1.8, 0.2), P("D4", 21.2, 2.3, 0.21),
  P("E4", 24.2, 1.8, 0.2), P("A4", 26.4, 2.6, 0.24), P("D5", 29.2, 2.4, 0.2),
  P("C5", 31.2, 1.7, 0.18),
  ...arpPattern(["D3", "F3", "A3", "D4"], 0, [0, 2, 3, 2], { step: 2, vel: 0.09, duration: 2.6 }),
  ...arpPattern(["Bb2", "D3", "F3", "A3"], 8, [0, 2, 3, 1], { step: 2, vel: 0.085, duration: 2.6 }),
  ...arpPattern(["G2", "Bb2", "D3", "F3"], 16, [0, 2, 3, 1], { step: 2, vel: 0.085, duration: 2.6 }),
  ...arpPattern(["A2", "E3", "A3", "C#4"], 24, [0, 2, 3, 2], { step: 2, vel: 0.085, duration: 2.6 }),
  BELL("D5", 6, 2.5, 0.05),
  BELL("A4", 22, 2.2, 0.045)
];

/* ------------------------------------------------------------------ */
/* La cassette de Luce — valse                                       */
/* ------------------------------------------------------------------ */

const cassetteEvents = [];
const waltzChords = [
  { beat: 0, chord: ["C3", "G3", "C4", "E4"], bass: "C2" },
  { beat: 12, chord: ["A2", "E3", "A3", "C4"], bass: "A1" },
  { beat: 24, chord: ["F2", "C3", "F3", "A3"], bass: "F1" },
  { beat: 36, chord: ["G2", "D3", "G3", "B3"], bass: "G1" }
];

for (const { beat, chord, bass } of waltzChords) {
  cassetteEvents.push(BASS(bass, beat, 9.5, 0.25));
  for (let bar = 0; bar < 4; bar += 1) {
    const barBeat = beat + bar * 3;
    cassetteEvents.push(P(chord[1], barBeat + 1, 0.8, 0.13));
    cassetteEvents.push(P(chord[2], barBeat + 1, 0.8, 0.13));
    cassetteEvents.push(P(chord[3], barBeat + 1, 0.8, 0.12));
    cassetteEvents.push(P(chord[1], barBeat + 2, 0.8, 0.11));
    cassetteEvents.push(P(chord[2], barBeat + 2, 0.8, 0.11));
    cassetteEvents.push(P(chord[3], barBeat + 2, 0.8, 0.1));
  }
}

cassetteEvents.push(
  P("G4", 0, 2.6, 0.25), P("C5", 2.2, 1.8, 0.24), P("E5", 4.2, 3, 0.24),
  P("D5", 7.4, 1.5, 0.2), P("C5", 9.1, 2.3, 0.22), P("A4", 11.5, 2.8, 0.21),
  P("G4", 14.2, 2.6, 0.24), P("A4", 17.1, 1.7, 0.2), P("C5", 19, 2.5, 0.22),
  P("F5", 21.2, 3, 0.22), P("E5", 24.3, 1.8, 0.2), P("D5", 26.2, 2.3, 0.2),
  P("C5", 28.5, 3, 0.23), P("G4", 31.5, 2.3, 0.2), P("G4", 34, 1.7, 0.2),
  P("C5", 36, 2.1, 0.22), P("E5", 38.2, 2.2, 0.23), P("G5", 40.2, 2.7, 0.22),
  P("F5", 43.1, 1.9, 0.2), P("E5", 45.1, 2.8, 0.23),
  BELL("C6", 45.5, 2.5, 0.05)
);

/* ------------------------------------------------------------------ */
/* La tempête — nuit sans électricité                                */
/* ------------------------------------------------------------------ */

const stormEvents = [
  ...PAD(["D2", "A2", "D3", "F3"], 0, 8, 0.14),
  ...PAD(["Bb1", "F2", "Bb2", "D3"], 8, 8, 0.13),
  ...PAD(["G2", "D3", "G3", "Bb3"], 16, 8, 0.13),
  ...PAD(["A2", "E3", "A3", "C#4"], 24, 8, 0.14),
  BASS("D1", 0, 7.5, 0.34), BASS("Bb1", 8, 7.5, 0.32),
  BASS("G1", 16, 7.5, 0.31), BASS("A1", 24, 7.5, 0.33),
  P("D4", 1.1, 1.7, 0.19), P("A4", 3.6, 1.2, 0.16), P("F4", 6.2, 2.2, 0.18),
  P("Bb3", 9.1, 1.4, 0.15), P("D4", 12.2, 2.8, 0.18), P("F4", 15.4, 1.3, 0.13),
  P("G3", 17.2, 1.8, 0.16), P("Bb3", 20.1, 1.2, 0.14), P("D4", 22.3, 2.7, 0.17),
  P("E4", 25, 1.5, 0.17), P("A4", 27.4, 2.2, 0.2), P("D5", 30, 2.8, 0.15),
  BELL("A5", 2.5, 2.8, 0.045), BELL("D5", 19.5, 2.2, 0.04),
  P("A2", 31.2, 0.7, 0.24)
];

/* ------------------------------------------------------------------ */
/* La page blanche — espoir du matin                                 */
/* ------------------------------------------------------------------ */

const hopeEvents = [
  ...PAD(padVoicing("C"), 0, 8, 0.1),
  ...PAD(padVoicing("G"), 8, 8, 0.095),
  ...PAD(padVoicing("AmHigh"), 16, 8, 0.095),
  ...PAD(padVoicing("F"), 24, 8, 0.1),
  BASS("C2", 0, 7.4, 0.23), BASS("G1", 8, 7.4, 0.22),
  BASS("A1", 16, 7.4, 0.22), BASS("F1", 24, 7.4, 0.23),
  P("G4", 0, 2.3, 0.3), P("C5", 2.5, 1.8, 0.27), P("E5", 4.4, 2.5, 0.3),
  P("D5", 7.2, 1.8, 0.25), P("C5", 9.2, 2.2, 0.27), P("E5", 11.5, 1.6, 0.25),
  P("G5", 13.2, 2.5, 0.27), P("F5", 16.1, 2.6, 0.25), P("E5", 19.1, 1.9, 0.24),
  P("C5", 21.2, 2.1, 0.24), P("D5", 23.4, 1.7, 0.22), P("E5", 25.2, 2.4, 0.25),
  P("D5", 27.8, 1.8, 0.22), P("C5", 29.2, 4.2, 0.28),
  ...arpPattern(voicing.C, 0, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.13, duration: 1.5 }),
  ...arpPattern(voicing.G, 8, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.12, duration: 1.5 }),
  ...arpPattern(voicing.AmHigh, 16, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.12, duration: 1.5 }),
  ...arpPattern(voicing.F, 24, [2, 3, 1, 2, 3, 2], { step: 1.25, vel: 0.12, duration: 1.5 }),
  BELL("C6", 5, 2.5, 0.05), BELL("G5", 21, 3, 0.04)
];

/* ------------------------------------------------------------------ */
/* Le phare — avant le dernier concert                               */
/* ------------------------------------------------------------------ */

const lighthouseEvents = [
  ...PAD(padVoicing("Am"), 0, 8, 0.11),
  ...PAD(padVoicing("Fmaj7"), 8, 8, 0.1),
  ...PAD(padVoicing("C"), 16, 8, 0.1),
  ...PAD(padVoicing("G"), 24, 8, 0.1),
  BASS("A1", 0, 7.4, 0.24), BASS("F1", 8, 7.4, 0.23),
  BASS("C2", 16, 7.4, 0.22), BASS("G1", 24, 7.4, 0.22),
  P("E5", 1, 2.3, 0.28), P("C5", 4, 1.5, 0.23), P("D5", 6, 2.1, 0.25),
  P("B4", 9, 1.7, 0.22), P("A4", 11.5, 2.8, 0.26), P("F4", 15, 1.8, 0.2),
  P("A4", 17.5, 2.4, 0.24), P("C5", 20.5, 1.5, 0.22), P("E5", 22.5, 2.5, 0.25),
  P("D5", 25.5, 2, 0.22), P("B4", 28, 1.5, 0.2), P("A4", 30, 3.2, 0.24),
  ...arpPattern(voicing.Am, 0, [2, 4, 3, 4, 2, 3], { step: 1.4, vel: 0.1, duration: 1.8 }),
  ...arpPattern(voicing.Fmaj7, 8, [2, 4, 5, 4, 3, 4], { step: 1.4, vel: 0.095, duration: 1.8 }),
  ...arpPattern(voicing.C, 16, [2, 3, 4, 3, 2, 3], { step: 1.4, vel: 0.095, duration: 1.8 }),
  ...arpPattern(voicing.G, 24, [2, 3, 4, 3, 2, 3], { step: 1.4, vel: 0.095, duration: 1.8 })
];

/* ------------------------------------------------------------------ */
/* Quand les notes s'effacent — le concert                           */
/* ------------------------------------------------------------------ */

const concertEvents = [
  ...PAD(padVoicing("Am"), 0, 8, 0.12),
  ...PAD(padVoicing("Fmaj7"), 8, 8, 0.115),
  ...PAD(padVoicing("Cadd9"), 16, 8, 0.11),
  ...PAD(padVoicing("G6"), 24, 8, 0.11),
  BASS("A1", 0, 7.6, 0.29), BASS("F1", 8, 7.6, 0.27),
  BASS("C2", 16, 7.6, 0.26), BASS("G1", 24, 7.6, 0.26),

  // premier thème
  P("E5", 0, 2.6, 0.36), P("C5", 2.3, 1.5, 0.28), P("D5", 3.6, 1.6, 0.3),
  P("B4", 5.2, 2.5, 0.29), P("A4", 8, 2.2, 0.32), P("C5", 10.3, 1.4, 0.26),
  P("E5", 11.6, 2.2, 0.3), P("F5", 14, 2.8, 0.32),
  P("E5", 17, 1.7, 0.28), P("D5", 18.6, 1.3, 0.26), P("B4", 20, 2.1, 0.26),
  P("C5", 22.3, 2.7, 0.3), P("B4", 25.2, 1.5, 0.25), P("A4", 26.6, 4.6, 0.34),

  // deuxième phrase, plus haute
  P("E5", 32, 2.5, 0.38), P("G5", 34.4, 1.8, 0.28), P("F5", 36.3, 2.3, 0.31),
  P("E5", 39, 2, 0.28), P("D5", 41.2, 1.6, 0.26), P("C5", 42.8, 2.8, 0.31),
  P("B4", 45.8, 1.8, 0.26), P("D5", 47.7, 2, 0.27), P("E5", 49.8, 2.4, 0.3),
  P("D5", 52.4, 2, 0.26), P("C5", 54.5, 2.2, 0.28), P("A4", 57, 5.2, 0.34),

  // troisième phrase, le motif d'Élise
  P("A4", 64, 2.1, 0.27), P("C5", 66.2, 1.6, 0.25), P("E5", 68, 2.6, 0.3),
  P("D5", 70.8, 1.8, 0.26), P("C5", 72.8, 2.2, 0.27), P("B4", 75.2, 1.8, 0.23),
  P("G4", 77, 2.4, 0.25), P("A4", 79.5, 3.6, 0.29),
  BELL("A5", 60, 2.6, 0.04),

  ...arpPattern(voicing.Am, 0, [2, 4, 3, 2, 3, 1, 2, 1], { step: 1.15, vel: 0.15, duration: 1.6 }),
  ...arpPattern(voicing.Fmaj7, 8, [2, 3, 5, 4, 3, 2, 1, 2], { step: 1.15, vel: 0.14, duration: 1.6 }),
  ...arpPattern(voicing.Cadd9, 16, [2, 4, 3, 2, 3, 1, 2, 1], { step: 1.15, vel: 0.14, duration: 1.6 }),
  ...arpPattern(voicing.G6, 24, [1, 3, 2, 4, 3, 2, 1, 0], { step: 1.15, vel: 0.14, duration: 1.6 }),
  ...arpPattern(voicing.Am, 32, [2, 4, 3, 2, 3, 1, 2, 1], { step: 1.15, vel: 0.14, duration: 1.6 }),
  ...arpPattern(voicing.Fmaj7, 40, [2, 3, 5, 4, 3, 2, 1, 2], { step: 1.15, vel: 0.14, duration: 1.6 }),
  ...arpPattern(voicing.Cadd9, 48, [2, 4, 3, 2, 3, 1, 2, 1], { step: 1.15, vel: 0.14, duration: 1.6 }),
  ...arpPattern(voicing.G6, 56, [1, 3, 2, 4, 3, 2, 1, 0], { step: 1.15, vel: 0.14, duration: 1.6 }),
  ...arpPattern(voicing.Am, 64, [2, 4, 3, 2], { step: 1.4, vel: 0.13, duration: 1.8 }),
  ...arpPattern(voicing.Fmaj7, 72, [2, 3, 5, 4], { step: 1.4, vel: 0.13, duration: 1.8 }),
  ...PAD(padVoicing("Am"), 64, 7.8, 0.08),
  ...PAD(padVoicing("Fmaj7"), 72, 7.8, 0.08),
  BASS("A1", 64, 7.5, 0.26),
  BASS("F1", 72, 7.5, 0.23)
];
concertEvents.push(
  ...PAD(padVoicing("Am"), 80, 8, 0.1),
  ...PAD(padVoicing("Fmaj7"), 88, 8, 0.09),
  ...PAD(padVoicing("Cadd9"), 96, 8, 0.09),
  ...PAD(padVoicing("G6"), 104, 8, 0.09),
  BASS("A1", 80, 7.5, 0.25), BASS("F1", 88, 7.5, 0.24),
  BASS("C2", 96, 7.5, 0.23), BASS("G1", 104, 7.5, 0.23),
  P("A4", 80, 2.8, 0.3), P("C5", 83.2, 1.8, 0.26), P("E5", 85.2, 2.4, 0.28),
  P("D5", 88, 2.2, 0.25), P("C5", 90.4, 1.6, 0.24), P("B4", 92.2, 2.5, 0.24),
  P("A4", 96, 2.7, 0.29), P("G4", 98.8, 1.8, 0.23), P("A4", 100.7, 2.6, 0.25),
  P("A4", 104, 6.4, 0.3)
);
concertEvents.push(
  ...arpPattern(voicing.Am, 80, [2, 4, 3, 2, 3, 1, 2, 1], { step: 1.35, vel: 0.12, duration: 1.8 }),
  ...arpPattern(voicing.Fmaj7, 88, [2, 3, 5, 4, 3, 2, 1, 2], { step: 1.35, vel: 0.12, duration: 1.8 }),
  ...arpPattern(voicing.Cadd9, 96, [2, 4, 3, 2, 3, 1, 2, 1], { step: 1.35, vel: 0.12, duration: 1.8 }),
  ...arpPattern(voicing.G6, 104, [1, 3, 2, 4, 3, 2, 1, 0], { step: 1.35, vel: 0.12, duration: 1.8 })
);

/* ------------------------------------------------------------------ */
/* Après la dernière mesure — épilogue                               */
/* ------------------------------------------------------------------ */

const epilogueEvents = [
  ...PAD(padVoicing("DMaj"), 0, 8, 0.1),
  ...PAD(padVoicing("A"), 8, 8, 0.095),
  ...PAD(padVoicing("FSharpMinor"), 16, 8, 0.09),
  ...PAD(padVoicing("E"), 24, 8, 0.1),
  BASS("D2", 0, 7.5, 0.24), BASS("A1", 8, 7.5, 0.22),
  BASS("F#1", 16, 7.5, 0.22), BASS("E1", 24, 7.5, 0.23),
  P("F#5", 0, 2.7, 0.29), P("E5", 3.2, 1.7, 0.24), P("D5", 5.1, 2.8, 0.27),
  P("A4", 8.1, 2.4, 0.25), P("C#5", 10.8, 1.8, 0.22), P("E5", 12.8, 2.6, 0.25),
  P("F#5", 16.1, 2.4, 0.26), P("E5", 18.7, 1.7, 0.22), P("D5", 20.6, 2.2, 0.23),
  P("B4", 23, 3.2, 0.24), P("A4", 27, 2.2, 0.24), P("C#5", 29.3, 1.8, 0.22),
  P("D5", 31, 3.4, 0.24),
  ...arpPattern(voicing.DMaj, 0, [2, 4, 3, 2, 4, 3], { step: 1.3, vel: 0.11, duration: 1.6 }),
  ...arpPattern(voicing.A, 8, [2, 4, 3, 2, 4, 3], { step: 1.3, vel: 0.1, duration: 1.6 }),
  ...arpPattern(voicing.FSharpMinor, 16, [2, 4, 3, 2, 4, 3], { step: 1.3, vel: 0.1, duration: 1.6 }),
  ...arpPattern(voicing.E, 24, [2, 4, 3, 2, 3, 2], { step: 1.3, vel: 0.1, duration: 1.6 }),
  BELL("D6", 2, 3, 0.04), BELL("A5", 26, 3, 0.04)
];

export const TRACKS = {
  title: {
    title: "Les Mouettes",
    bpm: 60,
    beats: 32,
    volume: 0.9,
    events: titleEvents
  },
  maison: {
    title: "La maison des marées",
    bpm: 68,
    beats: 32,
    volume: 0.76,
    events: houseEvents
  },
  plage: {
    title: "Les coquillages",
    bpm: 76,
    beats: 32,
    volume: 0.72,
    events: shoreEvents
  },
  pluie: {
    title: "La pluie dans le grenier",
    bpm: 54,
    beats: 32,
    volume: 0.66,
    events: atticEvents
  },
  cassette: {
    title: "La cassette de Luce",
    bpm: 84,
    beats: 48,
    volume: 0.66,
    events: cassetteEvents
  },
  tempete: {
    title: "La tempête",
    bpm: 48,
    beats: 32,
    volume: 0.7,
    events: stormEvents
  },
  espoir: {
    title: "La page blanche",
    bpm: 64,
    beats: 32,
    volume: 0.74,
    events: hopeEvents
  },
  phare: {
    title: "Le phare",
    bpm: 62,
    beats: 32,
    volume: 0.7,
    events: lighthouseEvents
  },
  concert: {
    title: "Quand les notes s'effacent",
    bpm: 58,
    beats: 112,
    volume: 0.86,
    events: concertEvents
  },
  epilogue: {
    title: "Ce qui reste",
    bpm: 56,
    beats: 32,
    volume: 0.8,
    events: epilogueEvents
  }
};

export const CHAPTER_MUSIC = {
  prologue: "title",
  day1: "maison",
  day2: "plage",
  day3: "pluie",
  day4: "cassette",
  day5: "tempete",
  day6: "espoir",
  day7: "phare",
  epilogue: "epilogue"
};
