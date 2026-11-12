import { n, noe, e, m, l } from "./helpers.js";

export const day4 = {
  id: "day4",
  number: 4,
  label: "Jour 4",
  date: "Mardi 15 septembre",
  title: "La voix dans la cassette",
  location: "Kerlann · La cuisine",
  quote: "« La musique ne demande pas la permission de rester. »",
  bg: "cuisine",
  tone: "warm",
  fx: "motes",
  music: "cassette",
  ambience: "room",
  portrait: true,
  pages: [
    {
      id: "day4-01",
      lines: [
        n("Margot arrive à onze heures avec un panier de croissants, un magnétophone qui date d'avant ma naissance et l'air de quelqu'un qui sait déjà qu'elle a raison."),
        m("Je ne te demande pas où tu étais. Je te demande si tu restes pour dîner.", "playful"),
        noe("Je ne sais pas encore.", {}),
        m("C'est déjà plus honnête que ce que j'entends d'habitude.", "warm"),
        n("Margot Le Gall tient le café Le Ressac depuis trente-deux ans. Elle a connu Élise à la naissance, Luce à l'âge où on commence à mentir sur son âge, et moi à l'âge où on croyait que les adultes savaient tout."),
        e("Margot, tu vas l'effrayer.", "soft"),
        m("Il est déjà revenu de lui-même. Je ne vois pas ce qui pourrait l'effrayer davantage.", "playful"),
        n("Elle pose la cassette sur la table. Une étiquette jaunie, une écriture droite : « Élise — 8 ans — ne pas effacer. »"),
        e("Où tu as trouvé ça ?", "surprised"),
        m("Derrière la caisse, dans la boîte des objets perdus. Elle devait y être depuis le déménagement de Luce. J'ai pensé que le grenier n'était pas le seul endroit où les maisons cachent des choses.", "warm")
      ]
    },
    {
      id: "day4-02",
      lines: [
        n("Margot glisse la cassette dans le lecteur. Les premières secondes ne sont que du souffle et des craquements. Puis une voix, si claire que la cuisine semble rétrécir autour d'elle."),
        l("Dos droit, ma puce. Tu comptes à voix haute. Et si tu te trompes, ce n'est pas grave. On recommence."),
        n("Une petite fille répond, avec un accent qui n'existe plus depuis longtemps. Elle joue trois notes, hésite, éclate de rire."),
        l("Voilà. Une erreur qui rit, c'est déjà de la musique."),
        apart(),
        n("Élise n'a pas bougé. Ses mains sont posées à plat sur la toile cirée. Le fermoir de sa montre brille."),
        e("Je ne me souviens pas de cette chanson.", "distant"),
        n("La mélodie continue. Une berceuse simple, avec une note qui remonte à chaque fin de phrase, comme une vague qui refuse de partir."),
        e("Attends.", "surprised"),
        n("Elle fredonne par-dessus la bande. Deux notes justes, puis une hésitation. Sa voix est plus grave, plus abîmée que celle de l'enfant, mais le rythme est identique. Quelque chose en elle se réveille sans passer par les mots."),
        l("Si le garçon aux genoux écorchés est là, dis-lui qu'il peut rester dîner."),
        n("Élise rit. Le son est brut, presque douloureux."),
        e("Luce disait toujours ça. Même quand tu n'étais pas là. Surtout quand tu n'étais pas là.", "laugh")
      ]
    },
    {
      id: "day4-03",
      lines: [
        n("La bande s'arrête au milieu d'une mesure. Le magnétophone claque. Personne ne se lève pour la retourner."),
        e("Elle a enregistré un mardi ordinaire. Je me demande si elle savait que quelqu'un l'écouterait après.", "sad"),
        noe("Elle savait que toi, tu l'écouterais.", {}),
        n("Margot range les tasses avec un bruit discret, puis sort sur le perron étendre un torchon qui n'a pas besoin d'être étendu. La porte vitrée reste entrouverte. Nous sommes seuls, mais pas abandonnés."),
        e("Tu sais ce qui me terrifie ? Ce n'est pas d'oublier le nom des choses. C'est de les oublier sans m'en apercevoir. De devenir quelqu'un qui vous fait mal sans le vouloir.", "sad"),
        noe("Tu ne me fais pas mal.", {}),
        e("Pas encore.", "soft"),
        n("Elle pose sa main sur la mienne. Ses doigts sont froids. Je les referme. Pendant un instant, la cuisine n'est qu'une cuisine, et nous ne sommes pas deux personnes en train de perdre quelque chose.")
      ]
    },
    {
      id: "day4-04",
      lines: [
        n("Margot me fait signe de l'aider à porter une caisse de bouteilles au cellier. Le cellier est minuscule, sent la pomme de terre et le sable. Elle ferme la porte derrière nous."),
        m("La maison sera vendue, Noé. Ce n'est pas une menace, c'est un fait. Le notaire a tous les papiers. Elle a un appartement réservé à Rennes pour novembre.", "neutral"),
        noe("Elle vous l'a dit ?", {}),
        m("Elle me l'a fait croire. Puis j'ai vu les papiers sur la table. Elle essaie de nous rendre la vie facile. C'est sa manière de nous protéger. C'est extrêmement fatigant.", "worried"),
        n("Margot pose une bouteille, la reprend, la repose. Pour la première fois, elle a l'air vieille."),
        m("Tu n'es pas obligé de rester. Personne ne te demandera de sauver quoi que ce soit. Mais si tu restes, reste vraiment. Les gens qui partent au milieu des souvenirs laissent plus de trous que ceux qui ne viennent jamais.", "sad"),
        m("Alors ?", "worried")
      ],
      choices: [
        {
          text: "« Je reste jusqu'au concert. Et je verrai après. »",
          set: { d4Stay: "concert" }
        },
        {
          text: "« Je reste après le concert aussi. Je ne sais pas comment, mais je reste. »",
          set: { d4Stay: "after" }
        },
        {
          text: "« Je ne sais pas. Je ne veux pas lui promettre quelque chose que je ne peux pas tenir. »",
          set: { d4Stay: "unknown" }
        }
      ]
    },
    {
      id: "day4-05",
      lines: [
        {
          who: "margot",
          expr: "warm",
          text: "Jusqu'au concert, c'est déjà ça. Un jour à la fois. Les marées ne demandent jamais de plan sur dix ans.",
          if: (state) => state.flags.d4Stay === "concert"
        },
        {
          who: "margot",
          expr: "soft",
          text: "Tu sais que ce sera dur. Et tu restes quand même. C'est peut-être la définition du courage.",
          if: (state) => state.flags.d4Stay === "after"
        },
        {
          who: "margot",
          expr: "warm",
          text: "C'est la réponse la plus honnête. Ne promets pas de rester. Promets de ne pas disparaître sans le dire.",
          if: (state) => state.flags.d4Stay === "unknown"
        },
        n("Elle ouvre la porte. La lumière de la cuisine nous tombe dessus. Élise est assise devant la cassette, le front posé sur les poings."),
        e("Vous complotez ?", "soft"),
        m("Nous parlons de toi. C'est le seul sujet que nous ayons en commun.", "playful"),
        n("Élise nous regarde l'un après l'autre. Elle sait. Elle choisit de ne pas insister."),
        e("J'ai besoin de réapprendre la berceuse. Pas pour la cassette. Pour vendredi. Je veux que Luce soit dans la salle sans prendre une chaise.", "determined")
      ]
    },
    {
      id: "day4-piano",
      kind: "piano",
      puzzleId: "j4",
      portrait: true
    },
    {
      id: "day4-06",
      lines: [
        n("La berceuse est revenue, avec ses défauts. Élise joue la dernière note et garde le pied sur la pédale, comme si elle pouvait empêcher le silence d'entrer."),
        e("Je veux que tu enregistres le concert.", "soft"),
        noe("Avec mon téléphone ?", {}),
        e("Avec tes machines. Tes micros, tes câbles. Tu fais ça dans les forêts et les usines. Une salle avec un piano et une centaine de personnes qui retiennent leur souffle, ce n'est pas plus difficile.", "smile"),
        noe("Ce n'est pas la même chose. On est censés capter le monde, pas le sauver.", {}),
        e("Alors on va sauver quelque chose de petit. Juste une pièce. Une seule.", "soft"),
        n("Margot apparaît dans l'encadrement, son panier vide à la main. Elle regarde Élise, puis moi, puis le magnétophone."),
        m("Je peux vous laisser. J'ai des pommes de terre qui m'attendent.", "warm"),
        e("Reste. Tu es la seule personne qui connaisse la fin de cette histoire et qui ne l'ait pas encore racontée.", "smile"),
        n("Margot reste. Nous réécoutons la cassette une dernière fois. À la fin, nous parlons de choses inutiles : la recette du far, l'âge du chien de la boulangère, l'endroit où le phare cache sa clé. C'est peut-être ça, une famille : des gens qui savent où tu ranges la clé.")
      ]
    },
    {
      id: "day4-07",
      bg: "atelier",
      tone: "dusk",
      location: "L'atelier",
      music: "cassette",
      lines: [
        n("Margot part à dix-neuf heures avec une part de gâteau dans un torchon. La radio marmonne un bulletin météo. Une dépression arrive de l'Atlantique. Rafales de cent kilomètres en soirée."),
        e("Je n'aime pas quand le vent parle comme ça.", "worried"),
        noe("Tu as déjà traversé des tempêtes.", {}),
        e("Oui. Mais Luce était là pour compter les bougies.", "distant"),
        n("Je range les câbles. Élise ferme le couvercle du piano. En passant, elle pose la main sur l'épaule de la photo de Luce. Elle s'attarde une seconde de trop."),
        e("Si l'électricité saute demain, on jouera au clair de lune. Ou dans le noir. De toute façon, je connais le chemin par cœur.", "soft"),
        n("Dehors, la mer commence déjà à gronder.")
      ]
    }
  ]
};

function apart() {
  return n("La bande crachote. On entend une chaise racler le sol, puis le rire de Luce.");
}
