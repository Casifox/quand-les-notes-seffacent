export const ENDINGS = {
  held: {
    id: "held",
    kicker: "La note tenue",
    title: "Ce qui reste",
    quote: "« La mer ne se souvient pas de la plage. Elle revient quand même. »",
    summary: "Tu as joué les quatre notes jusqu'au dernier la. Le monde n'a pas été réparé, mais quelque chose a été tenu. La musique a continué, et toi avec elle.",
    credit: "Pour celles et ceux qui restent après la dernière mesure."
  },
  silence: {
    id: "silence",
    kicker: "Le silence",
    title: "La mesure qui traîne",
    quote: "« Le silence n'est pas un oubli. C'est une note qu'on choisit de ne pas jouer. »",
    summary: "Tu as refermé le clavier et pris sa main. La salle a gardé la musique autrement. Certaines fins ne s'écrivent pas : elles s'assoient à côté de nous.",
    credit: "Pour celles et ceux qui savent s'arrêter à temps."
  }
};

export function getEnding(id) {
  return ENDINGS[id] ?? ENDINGS.held;
}
