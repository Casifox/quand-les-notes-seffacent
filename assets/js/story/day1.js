import { n, noe, e } from "./helpers.js";

export const day1 = {
  id: "day1",
  number: 1,
  label: "Jour 1",
  date: "Samedi 12 septembre",
  title: "La clé sous le pot",
  location: "Kerlann · Les Mouettes",
  quote: "« On ne revient jamais vraiment chez soi. On revient vers quelqu'un. »",
  bg: "atelier",
  tone: "warm",
  fx: "motes",
  music: "maison",
  ambience: "room",
  portrait: true,
  pages: [
    {
      id: "day1-01",
      bg: "arrivee",
      tone: "night",
      fx: "rain",
      ambience: "rain",
      location: "Kerlann · Le perron",
      lines: [
        n("La pluie tambourine sur l'auvent. Derrière Élise, le couloir découpe une bande de lumière jaune sur le gravier. Elle ne s'écarte pas tout de suite, comme si elle vérifiait encore que je suis bien là."),
        e("Tu vas entrer, ou tu comptes rester sous la pluie jusqu'à demain ?", "smile"),
        n("Ses cheveux sont plus courts. Le vent lui colle une mèche sur la joue. Elle porte un pull trop grand qui me rappelle celui que j'ai laissé dans la commode, il y a sept ans."),
        noe("Tu as coupé tes cheveux.", {}),
        e("Il fallait. Ils s'accrochaient partout. Aux boutons, aux poignées, aux idées.", "laugh"),
        n("Je franchis le seuil. Elle sent le savon et la cire. La maison, elle, sent mon enfance. Dans le couloir, quelqu'un a déplacé les cadres. Luce sourit toujours sur la photo de la plage, mais elle regarde maintenant vers la porte.")
      ]
    },
    {
      id: "day1-02",
      bg: "cuisine",
      location: "La cuisine",
      fx: "motes",
      music: "maison",
      lines: [
        n("La cuisine est plus petite que dans mon souvenir. Ou peut-être que c'est moi qui suis plus grand. Elle fait chauffer l'eau, sort deux mugs dépareillés, verse trois cuillerées de miel dans le mien."),
        noe("Tu te souviens que je n'aime pas le miel ?", {}),
        e("Bien sûr que non. Tu en buvais quand même pour me faire plaisir.", "smile"),
        n("Elle a raison. J'en buvais. Il y a des mensonges qui ressemblent à des preuves d'amour."),
        e("Je te donne la clé du bas. Celle du pot bleu. Pour que tu puisses sortir sans m'attendre.", "soft"),
        n("Elle fouille dans le tiroir des couverts, puis sous l'évier, puis dans la poche de son tablier. Son geste devient plus rapide. Plus sec."),
        e("Elle était là. Je l'ai encore posée quelque part. Je pose tout quelque part, en ce moment.", "worried"),
        n("Je sors sur le perron. Le géranium est mort depuis longtemps. Sous le pot bleu, dans la terre sèche, il y a une clé et un porte-clés en forme de poisson."),
        noe("Sous le pot bleu.", {}),
        e("Évidemment. Où veux-tu qu'elle soit ?", "laugh"),
        n("Elle rit. C'est un rire d'une seconde trop tard, comme un applaudissement dans la mauvaise mesure. Elle le sait. Je le sais. On ne dit rien.")
      ]
    },
    {
      id: "day1-03",
      bg: "atelier",
      tone: "warm",
      location: "L'atelier",
      music: "maison",
      ambience: "room",
      lines: [
        n("L'atelier est la seule pièce que le temps n'a pas réussi à ranger. Le Pleyel occupe le fond comme un animal endormi. Des partitions montent le long des murs ; certaines pages ont jauni, d'autres sont encore blanches."),
        n("Élise s'assoit sur le banc, pas tout à fait au centre. Ses mains trouvent les touches sans qu'elle regarde."),
        e("La maison est vendue. Acte en novembre. Un couple de Rennes veut en faire une maison d'hôtes. Ils garderont peut-être la vue, pas le piano.", "neutral"),
        n("Elle dit cela d'une voix de notaire. Puis elle appuie sur une touche. La note est légèrement fausse."),
        e("Il y a un concert vendredi. Le dernier de la Fête des marées. Enfin, le dernier tout court. J'ai promis à Margot de jouer au phare. Une pièce que j'ai commencée il y a longtemps et que je n'ai jamais finie.", "soft"),
        noe("Tu me demandes de la finir ?", {}),
        e("Je te demande sept jours. Après, tu pourras retourner à ta vie, à tes micros, à tes trains.", "neutral"),
        n("Elle me regarde enfin. Ses yeux sont verts comme les vitres de l'atelier quand la mer est grise."),
        e("Ils ont trouvé quelque chose dans ma tête. Une chose qui efface les dates, les noms, les clés. Le médecin dit que la musique reste souvent plus longtemps. Alors je vais tout mettre dans cette pièce. Et toi, tu vas m'aider.", "distant")
      ]
    },
    {
      id: "day1-04",
      tone: "warm",
      lines: [
        n("Le mot « maladie » ne sort pas. Il reste au milieu de la pièce, entre le piano et nous. Je voudrais le ramasser, le jeter par la fenêtre."),
        e("Je ne te raconte pas ça pour que tu me plaignes. Je te le raconte parce que vendredi, je vais avoir besoin de quelqu'un qui se souvienne de la suite. Ce n'est pas de la générosité. C'est du pragmatisme.", "determined"),
        noe("Pourquoi moi ?", {}),
        n("La question sort avant que je puisse la retenir. Élise regarde le clavier. Ses doigts tracent un accord sans le jouer."),
        e("Parce que tu es le seul à qui je n'ai jamais réussi à mentir plus de trois minutes.", "soft")
      ],
      choices: [
        {
          text: "« Parce que tu me l'as demandé. Je suis venu. »",
          set: { d1Reason: "asked" }
        },
        {
          text: "« Parce que j'avais une réponse à te donner, moi aussi. »",
          set: { d1Reason: "answer" }
        },
        {
          text: "« Parce que je ne savais pas où aller. »",
          set: { d1Reason: "lost" }
        }
      ]
    },
    {
      id: "day1-05",
      lines: [
        {
          who: "elise",
          expr: "sad",
          text: "Tu es venu parce que je te l'ai demandé. Tu n'as pas idée de ce que ça fait, quelqu'un qui vient quand on l'appelle.",
          if: (state) => state.flags.d1Reason === "asked"
        },
        {
          who: "elise",
          expr: "soft",
          text: "Une réponse. En sept ans, j'ai eu le temps d'inventer la tienne. Elle était moins bien que la vraie.",
          if: (state) => state.flags.d1Reason === "answer"
        },
        {
          who: "elise",
          expr: "laugh",
          text: "Alors nous sommes deux à ne plus savoir où aller. Ça fait une maison, non ?",
          if: (state) => state.flags.d1Reason === "lost"
        },
        noe("Je peux rester sept jours. Et peut-être plus, si tu ne me jettes pas dehors avant.", {}),
        e("Je ne jette personne. Je perds les gens, c'est différent.", "soft"),
        n("Elle pose les quatre premiers doigts sur le clavier. La phrase qu'elle joue est simple, presque enfantine. Elle s'arrête après quatre notes et retire ses mains."),
        e("Répète après moi. Si tu te souviens encore de ça, on a une chance.", "smile")
      ]
    },
    {
      id: "day1-piano",
      kind: "piano",
      puzzleId: "j1",
      portrait: true
    },
    {
      id: "day1-06",
      lines: [
        n("Quand la dernière note s'éteint, Élise garde les mains au-dessus du clavier. Le soir est tombé pour de bon derrière la vitre. La maison craque doucement, comme un bateau."),
        e("Tu te souviens encore de moi.", "soft"),
        n("Ce n'est pas une question. Je voudrais lui dire que je n'ai jamais cessé, que chaque fois que j'entends un piano dans une gare je m'arrête, que son nom est la seule chose que je n'ai jamais réussi à ranger. Je ne dis rien. Les grandes phrases ont parfois l'air de meubles qu'on livre trop tôt."),
        noe("On la finira. La pièce.", {}),
        e("On la finira.", "smile"),
        n("Elle range la partition dans un carton, puis demande où elle a mis sa tasse, qui est encore dans sa main."),
        e("Demain, on ira à la plage. J'ai besoin de bruit de coquillages pour le deuxième mouvement. Et toi, tu auras besoin de marcher.", "neutral"),
        n("Cette nuit, à deux heures du matin, je l'entends jouer. Toujours les mêmes quatre notes. Sauf qu'elle en ajoute une cinquième. Une note qui ne va nulle part. Pas encore.")
      ]
    }
  ]
};
