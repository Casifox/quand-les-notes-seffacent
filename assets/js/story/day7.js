import { n, noe, e, m } from "./helpers.js";

export const day7 = {
  id: "day7",
  number: 7,
  label: "Jour 7",
  date: "Vendredi 18 septembre",
  title: "La dernière mesure",
  location: "Kerlann · Le phare des Marées",
  quote: "« Je ne me souviens plus de la fin. Reste. »",
  bg: "phare",
  tone: "dusk",
  fx: "motes",
  music: "espoir",
  ambience: "room",
  portrait: true,
  pages: [
    {
      id: "day7-01",
      bg: "cuisine",
      tone: "dawn",
      location: "Kerlann · La cuisine",
      lines: [
        n("Vendredi matin, Élise m'appelle « le garçon de la plage »."),
        n("Elle est debout dans la cuisine, habillée, coiffée, les mains posées à plat sur la table comme si elle attendait un train. Sur le frigo, il y a trois Post-it : « café », « clé », « Noé – visage »."),
        e("Pardon. Je sais que vous êtes Noé. Je le sais. C'est juste que le mot est arrivé après vous.", "worried"),
        noe("Je peux attendre le mot.", {}),
        e("C'est gentil. Mais ne m'attends pas trop. Les mots prennent parfois le train sans moi.", "soft"),
        n("Elle rit. Je ris. Nous sommes deux personnes qui rient dans une cuisine trop silencieuse. Sur la table, le carnet vert est ouvert à la page de la veille : coda, quatre notes, la mineure, la majeure, le dernier la."),
        e("On a dîné avec Margot hier ?", "soft"),
        noe("Pain, fromage, soupe. Tu as lu les petites annonces du journal.", {}),
        e("J'adore les petites annonces. Elles appartiennent à des gens que je ne connais pas.", "smile"),
        n("Elle ne s'en souvient pas. Mais elle sait qu'elle aime ça. Peut-être que c'est suffisant pour aujourd'hui.")
      ]
    },
    {
      id: "day7-02",
      bg: "phare",
      tone: "dusk",
      location: "Le phare des Marées · 18 h 20",
      music: "phare",
      ambience: "hall",
      fx: "motes",
      lines: [
        n("À dix-huit heures, le phare est déjà plein de bruit. Margot commande des chaises, un enfant court entre les câbles, deux pêcheurs accrochent une guirlande qui ne servira à rien. Sur la mer, les lampes des bateaux s'allument une par une."),
        n("J'ai installé deux micros près du piano : un pour les cordes, un pour la salle. Le câble passe sous un tapis. J'ai vérifié trois fois. C'est la seule chose que je sais faire sans trembler."),
        m("Le maire voulait faire un discours. Je lui ai promis qu'il aurait le mot de la fin. Il ne sait pas encore que la fin, c'est toi qui la connais.", "playful"),
        e("Je ne la connais plus.", "worried"),
        m("Alors ce sera une surprise. Moi, j'adore les surprises.", "warm"),
        n("Élise est assise derrière le paravent, dans une robe bleu nuit qui appartenait à Luce. Elle tient une tasse de thé entre ses mains. Je l'ai fait sans miel. Elle le remarque."),
        e("Tu as mis du miel.", "surprised"),
        noe("Non.", {}),
        n("Elle goûte. Elle repose la tasse avec précaution."),
        e("Je progresse.", "smile"),
        n("Dehors, les lampions de la fête s'allument. La salle bourdonne. Élise regarde la porte comme si elle hésitait à entrer dans sa propre vie.")
      ]
    },
    {
      id: "day7-03",
      bg: "phare",
      music: "phare",
      ambience: "hall",
      lines: [
        n("Margot ouvre la porte. La lumière de la salle tombe sur nous. Élise se lève. Elle ajuste sa robe, puis défait ce qu'elle vient de faire, puis recommence."),
        e("Tu es sûr que je dois jouer ?", "worried"),
        noe("Non.", {}),
        e("Ce n'est pas une réponse.", "soft"),
        noe("Je suis sûr que je serai là.", {}),
        n("Elle hoche la tête. Puis elle me prend la main. Sa paume est glacée, mais sa poigne est ferme."),
        e("Rappelle-moi ton prénom.", "distant"),
        noe("Noé.", {}),
        e("Noé.", "soft"),
        n("Elle le dit comme on accorde une corde : en cherchant la note juste autour du mot."),
        e("Si je m'arrête au milieu, tu ne me portes pas. Tu ne joues pas à ma place. Tu joues avec moi. D'accord ?", "determined"),
        noe("D'accord.", {}),
        n("Margot nous regarde depuis le seuil. Elle ne dit rien. C'est sa façon de prier.")
      ]
    },
    {
      id: "day7-04",
      portrait: false,
      music: null,
      lines: [
        n("La salle est pleine. Je reconnais des visages de l'école, du port, du café. La boulangère. Le fils de Margot, venu de Brest. Des gens qui n'ont jamais entendu Élise jouer et des gens qui l'ont entendue naître."),
        n("Margot prend le micro. Elle dit qu'Élise Varenne est compositrice, qu'elle a écrit une pièce pour quatre mains et une seule personne. Elle dit que la mer est dans la salle. Puis elle s'écarte."),
        n("Élise traverse la lumière. Le silence se referme derrière elle. Elle s'assoit. Ses mains trouvent le clavier. Elle joue les premières mesures."),
        n("Ce n'est pas parfait. Le piano est vieux, la salle résonne trop, quelqu'un tousse près de la porte. C'est magnifique."),
        n("Puis, au milieu de la deuxième page, ses mains s'arrêtent."),
        n("Elles restent suspendues au-dessus des touches. Une note attend sous son majeur. La salle entière attend avec elle."),
        e("Je cherche la suite.", "distant"),
        n("Elle tourne la tête vers moi. Je suis dans l'ombre, à trois pas du piano. Elle me cherche comme on cherche une lumière dans une pièce qu'on connaît pourtant par cœur."),
        e("Je ne me souviens plus de la fin.", "worried")
      ]
    },
    {
      id: "day7-piano",
      kind: "piano",
      puzzleId: "j7",
      portrait: true
    },
    {
      id: "day7-05",
      music: null,
      portrait: true,
      lines: [
        n("Personne n'applaudit. Le silence n'est pas vide : il est plein de cent personnes qui retiennent leur souffle et d'une mer qui continue dehors, indifférente."),
        n("Élise regarde ses mains comme si elles appartenaient à quelqu'un d'autre. Puis elle regarde la page blanche posée contre le pupitre. Au bas, il y a quatre notes à l'encre, et deux prénoms."),
        {
          who: "elise",
          expr: "sad",
          text: "Tu m'as promis d'arrêter si je te le demandais. Je ne te le demande pas. Je te demande juste de décider avec moi.",
          if: (state) => state.flags.d5Promise === "together"
        },
        {
          who: "elise",
          expr: "soft",
          text: "Tu es resté. Même maintenant. Surtout maintenant.",
          if: (state) => state.flags.d5Promise === "stay"
        },
        {
          who: "elise",
          expr: "determined",
          text: "Je ne sais pas si je peux finir. Mais je sais que je ne veux pas te laisser faire semblant que ça va.",
          if: (state) => state.flags.d5Promise === "stop"
        },
        e("Tu te souviens de la coda ?", "distant"),
        noe("Oui.", {}),
        n("Je pose la main sur le couvercle du piano. Élise ne me demande pas de jouer. Elle ne me demande pas d'arrêter. Elle attend que je choisisse, et c'est la chose la plus généreuse et la plus terrible qu'on puisse demander à quelqu'un."),
        n("La mer respire derrière les vitres. Le papier attend. Ma main hésite.")
      ],
      choices: [
        {
          text: "Tu joues les quatre notes, jusqu'au dernier la. Tu termines la phrase.",
          set: { d7FinalChoice: "held" },
          ending: "held"
        },
        {
          text: "Tu refermes doucement le clavier et tu prends sa main.",
          set: { d7FinalChoice: "silence" },
          ending: "silence"
        }
      ]
    }
  ]
};
