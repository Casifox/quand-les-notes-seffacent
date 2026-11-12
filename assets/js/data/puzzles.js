import { CODA_ALLOWED_NOTES } from "../core/notes.js";

export const PUZZLES = {
  j1: {
    id: "j1",
    dayNumber: 1,
    dayLabel: "Jour 1",
    title: "Le fil",
    pieceTitle: "Marée basse",
    mode: "echo",
    memoryId: "cle-bleue",
    notes: ["E5", "D5", "C5", "B4"],
    staffLabel: "Premier fil",
    brief: "Élise joue quatre notes, comme on lance un fil entre deux rives. Elle attend que tu le reprennes.",
    quote: "« Ce sont les notes que je ne veux pas perdre. »",
    instruction: "Écoute, puis joue les quatre notes dans le même ordre.",
    hint: "La phrase descend doucement, comme une marée : mi, ré, do, si.",
    successText: "La phrase est restée entre vos doigts. Ce soir-là, la maison avait retrouvé un de ses bruits.",
    listenNoteMs: 620
  },
  j2: {
    id: "j2",
    dayNumber: 2,
    dayLabel: "Jour 2",
    title: "Les coquillages",
    pieceTitle: "Les coquillages",
    mode: "fill",
    memoryId: "coquillage-luce",
    notes: ["B4", "D5", "C5", "A4", "B4", "D5"],
    missing: [2, 4],
    staffLabel: "La marée",
    brief: "Le vent a emporté deux notes de la petite phrase qu'Élise fredonne. Les autres reviennent toutes seules.",
    quote: "« La mer oublie toujours une chose sur la plage. À nous de la retrouver. »",
    instruction: "Écoute la phrase à trous et retrouve les deux notes manquantes, dans l'ordre.",
    hint: "La première note perdue redescend après le ré ; la seconde remonte juste avant la dernière.",
    successText: "Le coquillage a tenu sa promesse. La mélodie est revenue entière, avec un peu de sel dans la voix.",
    listenNoteMs: 560
  },
  j3: {
    id: "j3",
    dayNumber: 3,
    dayLabel: "Jour 3",
    title: "La page déchirée",
    pieceTitle: "La maison avale les objets",
    mode: "fill",
    memoryId: "metronome-fele",
    notes: ["B4", "D5", "C5", "A4", "F4", "G4"],
    missing: [1, 4],
    staffLabel: "La page déchirée",
    brief: "La pluie a effacé deux mesures sur la partition de Luce. Élise se souvient du contour, pas du chemin.",
    quote: "« Mamie disait qu'une partition, c'est seulement la mer vue de la fenêtre. »",
    instruction: "Écoute les notes qui restent, puis comble les deux blancs.",
    hint: "La première note manquante est un ré aigu ; la seconde, un fa grave.",
    successText: "La phrase a retrouvé son milieu. Élise a ri en découvrant que le métronome battait toujours plus vite qu'elle.",
    listenNoteMs: 540
  },
  j4: {
    id: "j4",
    dayNumber: 4,
    dayLabel: "Jour 4",
    title: "La cassette",
    pieceTitle: "Berceuse des marées",
    mode: "echo",
    memoryId: "cassette-luce",
    notes: ["G4", "C5", "E5", "D5", "C5", "A4"],
    staffLabel: "La voix de Luce",
    brief: "La cassette grésille. Une voix de petite fille sort du haut-parleur, puis s'arrête au milieu d'une mesure.",
    quote: "« Recommence, Mamie. Je vais y arriver. »",
    instruction: "Écoute la berceuse, puis rends-la à Élise comme on rend un souvenir.",
    hint: "La phrase monte jusqu'au mi, hésite sur le ré, revient au do, puis se pose sur le la.",
    successText: "Élise a joué par-dessus sa propre voix d'enfant. Pendant quelques mesures, trois générations ont tenu la même note.",
    listenNoteMs: 590
  },
  j5: {
    id: "j5",
    dayNumber: 5,
    dayLabel: "Jour 5",
    title: "Dans le noir",
    pieceTitle: "Ce qui reste",
    mode: "echo",
    memoryId: "bougie-tempete",
    notes: ["E5", "C5", "D5", "B4", "A4", "E5"],
    hiddenScore: true,
    staffLabel: "La bougie",
    brief: "Les bougies font des ombres longues. Élise ne peut plus lire la partition ; tu ne peux plus lire que ses mains.",
    quote: "« Joue-moi quelque chose que je connais. Même si je ne sais plus que je le connais. »",
    instruction: "Écoute les six notes. Tu peux les rejouer de mémoire, ou demander un indice.",
    hint: "La phrase reprend le thème, puis remonte vers un mi, comme une flamme.",
    successText: "Dans le noir, chaque note a trouvé son chemin. Élise a reconnu la dernière sans que tu aies besoin de la nommer.",
    listenNoteMs: 650
  },
  j6: {
    id: "j6",
    dayNumber: 6,
    dayLabel: "Jour 6",
    title: "Les quatre notes",
    pieceTitle: "La dernière page",
    mode: "compose",
    memoryId: "page-blanche",
    notes: ["E4", "A4"],
    firstNote: "E4",
    lastNote: "A4",
    allowedNotes: CODA_ALLOWED_NOTES,
    staffLabel: "La coda",
    brief: "Élise a déjà écrit la première et la dernière note. Il reste deux notes, et cette page blanche entre elles.",
    quote: "« Choisis celles que tu voudras entendre quand je ne serai plus là. »",
    instruction: "Choisis deux notes pour former une coda de quatre notes. Elles commenceront par mi, finiront par la.",
    hint: "Reste sur les touches dorées. Il n'y a pas de mauvaise note, seulement des notes qui s'éloignent.",
    successText: "Quatre notes. Deux de mémoire, deux de toi. Élise les a recopiées sur une page propre, avec la date.",
    listenNoteMs: 620
  },
  j7: {
    id: "j7",
    dayNumber: 7,
    dayLabel: "Jour 7",
    title: "La dernière mesure",
    pieceTitle: "Quand les notes s'effacent",
    mode: "duet",
    memoryId: "derniere-mesure",
    staffLabel: "Le duo",
    brief: "Sous les fenêtres du phare, Élise commence la pièce. Au bout de quelques mesures, sa main s'arrête. Elle te cherche dans la lumière.",
    quote: "« Je ne me souviens plus de la suite. Reste. »",
    instruction: "Quand c'est à toi, joue la note marquée. Les notes d'Élise viennent toutes seules.",
    hint: "La touche indiquée attend sous tes doigts. Prends ton temps.",
    successText: "Le dernier accord a traversé la salle sans se presser. Personne n'a applaudi tout de suite.",
    listenNoteMs: 620,
    stopMusic: true,
    buildSequence() {
      return [
        { who: "elise", note: "E5", cue: "Élise commence." },
        { who: "you", note: "D5", cue: "La salle retient son souffle." },
        { who: "elise", note: "C5" },
        { who: "you", note: "B4" },
        { who: "elise", note: "A4" },
        { who: "you", note: "C5" },
        { who: "elise", note: "E5", fading: true, cue: "Sa main hésite." },
        { who: "you", note: "D5" },
        { who: "you", note: "C5", cue: "Tu continues seul. La partition est vide après cette note." }
      ];
    }
  }
};

export const PUZZLE_ORDER = Object.keys(PUZZLES);

export function getPuzzle(id) {
  return PUZZLES[id] ?? null;
}
