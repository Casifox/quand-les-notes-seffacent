import { n, noe, e } from "./helpers.js";

export const prologue = {
  id: "prologue",
  number: 0,
  label: "Prologue",
  date: "Vendredi 11 septembre",
  title: "La lettre",
  location: "Gare de Kerlann · 19 h 42",
  quote: "« Reviens avant que je m'oublie. Sept jours. »",
  bg: "gare",
  tone: "dusk",
  fx: "rain",
  music: "title",
  ambience: "rain",
  portrait: false,
  pages: [
    {
      id: "prologue-01",
      lines: [
        n("La lettre est arrivée mardi, entre une facture d'électricité et un prospectus pour une salle de sport. Une enveloppe bleue. Mon nom écrit avec une encre qui bavait un peu sur le coin."),
        n("À l'intérieur, il n'y avait pas de mots. Seulement une portée à main levée, sept notes, et sous la dernière : « Reviens avant que je m'oublie. Sept jours. — E. »"),
        n("J'ai reconnu l'écriture avant de reconnaître la peur. Sept ans que je n'avais pas remis les pieds à Kerlann. Le train m'a déposé dans le crachin, avec une valise trop lourde et l'impression d'avoir oublié comment on respire au bord de la mer."),
        noe("Sept jours.", { thought: true })
      ]
    },
    {
      id: "prologue-02",
      bg: "arrivee",
      location: "Chemin des Mouettes · 20 h 17",
      music: "maison",
      ambience: "sea",
      lines: [
        n("La maison n'a pas changé. Même toit qui penche vers la mer, même géranium dans le pot bleu, même fenêtre de l'atelier qui refuse de s'éteindre avant minuit."),
        n("Je connais ce chemin par cœur. Le gravier, la barrière qui grince, la pierre plate où je m'asseyais pour attendre qu'Élise finisse ses gammes."),
        n("Je lève la main pour frapper. La porte s'ouvre avant."),
        e("Tu as toujours ta valise trop lourde.", "soft"),
        n("Ses cheveux sont plus courts. Elle porte un pull trop grand qui lui mange les poignets. Pendant une seconde, elle me regarde comme si j'étais un inconnu qui lui rappelait quelqu'un."),
        e("Entre. Il pleut sur le pas-de-porte et ça va finir par sentir le chien mouillé.", "smile"),
        n("Elle sourit. Je ne sais pas encore si c'est pour m'accueillir ou pour couvrir le silence.")
      ]
    }
  ]
};
