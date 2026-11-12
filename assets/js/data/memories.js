export const MEMORY_ICONS = {
  key: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="17" cy="18" r="8.5"/>
      <circle cx="17" cy="18" r="3.2"/>
      <path d="m23 24 15 15M30 31l4-4M35 36l4-4"/>
    </svg>`,
  shell: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M7 36C9 18 18 8 32 9c10 1 13 12 8 21-4 7-13 11-23 9Z"/>
      <path d="M12 34c5-11 12-18 23-21M18 36c3-10 8-16 17-19M26 37c2-7 5-11 11-13"/>
      <path d="M6 38c11 2 20 1 29-4"/>
    </svg>`,
  metronome: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 41h18l9-30H22Z"/>
      <path d="M24 16 37 8M19 41h32"/>
      <path d="M27 21h8M25 27h9M23 33h10"/>
    </svg>`,
  cassette: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="11" width="38" height="26" rx="3"/>
      <rect x="11" y="17" width="26" height="14" rx="2"/>
      <circle cx="18.5" cy="24" r="4.5"/>
      <circle cx="29.5" cy="24" r="4.5"/>
      <path d="M17 31h14M17 36v2M31 36v2"/>
    </svg>`,
  candle: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M18 20h12v22H18Z"/>
      <path d="M24 18c-6-5-3-12 1-16 5 5 6 11-1 16Z"/>
      <path d="M24 18v-5M12 42h24"/>
      <path d="M12 13c-3 5-3 9 2 12M36 13c3 5 3 9-2 12"/>
    </svg>`,
  page: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 7h24l6 6v28H9Z"/>
      <path d="M33 7v7h6M15 27h17M15 33h13M15 15h10"/>
      <path d="M18 23c5-4 9-3 13 2M25 20v8"/>
    </svg>`,
  lighthouse: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M18 42h12l-2-29H20Z"/>
      <path d="M19 13h10l-2-5h-6ZM24 8V4"/>
      <path d="M24 15 8 9M24 15l16-6M24 19 11 17M24 19l13-2"/>
      <path d="M11 42c3-3 7-3 10 0M27 42c3-3 6-3 10 0"/>
    </svg>`,
  letter: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="11" width="36" height="26" rx="2"/>
      <path d="m7 13 17 14 17-14M7 35l12-11M41 35 29 24"/>
      <path d="M31 8c2-4 6-4 8 0 2-4 6-4 8 0" opacity=".5"/>
    </svg>`
};

export const MEMORIES = [
  {
    id: "cle-bleue",
    number: 1,
    day: "Jour 1",
    chapter: "La clé sous le pot",
    title: "La clé bleue",
    kicker: "Souvenir · samedi",
    icon: "key",
    puzzleId: "j1",
    text: "Élise avait perdu la clé de la maison. Je l'ai trouvée sous le pot de géraniums, à l'endroit où nous cachions déjà nos secrets quand nous avions dix ans. La peinture bleue s'écaillait. Elle a ri en disant que la maison avait meilleure mémoire qu'elle. Puis elle a regardé le couloir un peu trop longtemps, comme si elle cherchait la suite de la phrase. Le soir, elle a joué quatre notes. Je les ai reprises sans réfléchir. Pendant une seconde, nous avons eu de nouveau dix-sept ans.",
    quote: "« Tu te souviens encore de moi. » — Élise",
    noteTitle: "Marée basse · premier fragment",
    staffLabel: "Le fil"
  },
  {
    id: "coquillage-luce",
    number: 2,
    day: "Jour 2",
    chapter: "Les coquillages",
    title: "Le coquillage de Luce",
    kicker: "Souvenir · dimanche",
    icon: "shell",
    puzzleId: "j2",
    text: "La plage était vide, ou presque. Élise a ramassé un coquillage nacré, l'a collé à mon oreille et a juré qu'on y entendait la mer. On n'entendait que le vent. Elle a soutenu le contraire jusqu'à ce que nous riions tous les deux. Elle m'a dit que sa grand-mère appelait ces coquillages « les petites maisons du bruit ». Celui-là est resté dans la poche de mon manteau. Je l'y touche encore quand je ne sais pas quoi dire.",
    quote: "« Si je ne sais plus qui tu es, souffle dedans. Je reviendrai. » — Élise",
    noteTitle: "Les coquillages · deuxième fragment",
    staffLabel: "La marée"
  },
  {
    id: "metronome-fele",
    number: 3,
    day: "Jour 3",
    chapter: "La maison avale les objets",
    title: "Le métronome fêlé",
    kicker: "Souvenir · lundi",
    icon: "metronome",
    puzzleId: "j3",
    text: "Nous avons cherché dans le grenier quelque chose qu'elle ne pouvait pas nommer. Elle s'est mise en colère contre une boîte, contre la pluie, contre le temps. Le vieux métronome de Luce a heurté le plancher et s'est fêlé sur le côté. Il continue de battre, mais plus de travers. Élise a pleuré, puis elle s'est excusée de pleurer. Je lui ai répondu que la maison était faite pour les objets imparfaits. Plus tard, elle a reconstruit la phrase de Luce au piano. Le métronome battait toujours. Nous aussi.",
    quote: "« Ce n'est pas la mesure qui compte. C'est de ne pas s'arrêter. » — Luce",
    noteTitle: "La maison avale les objets · troisième fragment",
    staffLabel: "Le grenier"
  },
  {
    id: "cassette-luce",
    number: 4,
    day: "Jour 4",
    chapter: "La voix dans la cassette",
    title: "La cassette de Luce",
    kicker: "Souvenir · mardi",
    icon: "cassette",
    puzzleId: "j4",
    text: "Margot a apporté une cassette trouvée derrière la caisse du café. On y entend Luce qui compte les temps pour une petite fille, puis une Élise de huit ans qui se trompe, rit et recommence. Sa voix est là, intacte, minuscule. Élise ne se souvenait pas de la mélodie avant que la bande ne la lui rende. Nous l'avons réécoutée trois fois. À la quatrième, elle a fermé les yeux et a joué par-dessus. Je n'ai jamais rien entendu d'aussi vivant que ce duo entre une morte et sa petite-fille.",
    quote: "« La musique ne demande pas la permission de rester. » — Luce, sur la cassette",
    noteTitle: "Berceuse des marées · quatrième fragment",
    staffLabel: "La cassette"
  },
  {
    id: "bougie-tempete",
    number: 5,
    day: "Jour 5",
    chapter: "La tempête",
    title: "La bougie de la tempête",
    kicker: "Souvenir · mercredi",
    icon: "candle",
    puzzleId: "j5",
    text: "L'électricité est partie avec la lumière. Dans le noir, Élise m'a demandé où était Luce, puis pourquoi je portais ce manteau, puis qui j'étais. J'ai eu peur de répondre. J'ai joué les notes qu'elle m'avait apprises. Une par une, la maison est revenue. Elle a pleuré sans se cacher, la tête contre mon épaule. La bougie a brûlé jusqu'au matin. Sur le verre, elle a gravé avec son ongle : « encore là ». Ce n'était pas pour la maison. C'était pour nous.",
    quote: "« Je ne veux pas qu'on se souvienne de moi à moitié. » — Élise",
    noteTitle: "Dans le noir · cinquième fragment",
    staffLabel: "La tempête"
  },
  {
    id: "page-blanche",
    number: 6,
    day: "Jour 6",
    chapter: "La dernière page",
    title: "Les quatre notes",
    kicker: "Souvenir · jeudi",
    icon: "page",
    puzzleId: "j6",
    text: "Elle m'a laissé les quatre dernières notes. Deux étaient déjà écrites ; deux venaient de moi. J'ai posé mes doigts sur le piano sans savoir si j'avais le droit. Élise a dit que c'était exactement pour ça que la page était blanche. Nous avons recopié la fin sur un papier propre, avec la date. Le soir, elle a glissé la clé bleue dans ma poche. « Au cas où la maison se souviendrait mieux que moi », a-t-elle dit. Je l'ai gardée. Je la garde encore.",
    quote: "« Une fin, ce n'est pas une note. C'est ce qu'on en fait après. » — Élise",
    noteTitle: "Ta coda",
    staffLabel: "La dernière page",
    coda: true
  },
  {
    id: "derniere-mesure",
    number: 7,
    day: "Jour 7",
    chapter: "La dernière mesure",
    title: "La dernière mesure",
    kicker: "Souvenir · vendredi",
    icon: "lighthouse",
    puzzleId: "j7",
    text: "Le phare était plein de gens, de manteaux mouillés et de chaises empruntées au café. Élise a commencé seule. Puis sa main s'est arrêtée au-dessus du clavier. Elle m'a cherché dans la salle et j'ai compris. J'ai traversé la lumière. Sous mes doigts, le bois était chaud. Nous n'avons pas joué comme avant. Nous avons joué comme on reste : mal, ensemble, jusqu'au bout. Après, le silence a duré plus longtemps que la musique.",
    quote: "« Reste. » — Élise, à voix basse",
    noteTitle: "Quand les notes s'effacent · fragment final",
    staffLabel: "Le phare"
  },
  {
    id: "lettre-finale",
    number: 8,
    day: "Épilogue",
    chapter: "Ce qui reste",
    title: "La lettre dans le banc",
    kicker: "Lettre retrouvée",
    icon: "letter",
    puzzleId: null,
    text: "Margot l'avait gardée sous le banc du piano, dans une enveloppe bleue. L'écriture d'Élise était appliquée, un peu penchée à droite. Elle l'avait écrite le jeudi soir, pendant que je dormais. « Tu vas croire que je l'ai fait pour toi. Ce n'est pas vrai. Ou pas seulement. J'ai besoin qu'il reste une version de moi qui ne soit pas malade, une version qui a assez aimé quelqu'un pour lui confier ses quatre dernières notes. Le piano est à toi maintenant — pas la maison, la maison est trop lourde. Le piano, oui. Et si un jour tu ne sais plus quoi faire de ta peine, joue le morceau en entier. Je serai dans la mesure qui traîne. »",
    quote: "« Je t'aime à retardement. Ça compte quand même. » — extrait de la lettre",
    noteTitle: "La mesure qui traîne",
    staffLabel: "La lettre"
  }
];

export function getMemory(memoryId) {
  return MEMORIES.find((memory) => memory.id === memoryId) ?? null;
}

export const MEMORY_TOTAL = MEMORIES.length;
