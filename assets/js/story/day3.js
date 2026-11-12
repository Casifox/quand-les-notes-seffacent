import { n, noe, e } from "./helpers.js";

export const day3 = {
  id: "day3",
  number: 3,
  label: "Jour 3",
  date: "Lundi 14 septembre",
  title: "La maison avale les objets",
  location: "Kerlann · Le grenier",
  quote: "« Les maisons ne perdent pas les objets. Elles les mettent de côté. »",
  bg: "grenier",
  tone: "warm",
  fx: "dust",
  music: "pluie",
  ambience: "rain",
  portrait: true,
  pages: [
    {
      id: "day3-01",
      lines: [
        n("Il pleut depuis l'aube. La gouttière joue un rythme faux contre la fenêtre du grenier. Quand je monte, Élise est déjà là, assise au milieu d'un cercle de cartons ouverts."),
        e("Je cherche quelque chose.", "neutral"),
        noe("Quoi ?", {}),
        e("Si je le savais, je ne chercherais pas.", "worried"),
        n("Elle porte mon vieux pull à col roulé, celui que j'avais laissé dans la commode en partant. Il lui va comme une tente. Ses cheveux sont poussiéreux. Elle a les mains froides quand je les prends."),
        n("Le grenier sent la toile cirée et le papier moisi. Il y a des malles, un mannequin sans tête, des skis qui n'ont jamais vu la neige, et le vieux métronome de Luce."),
        e("Luce rangeait les choses importantes dans des boîtes qui ne ressemblent à rien. Elle disait que les voleurs ne cherchent jamais dans les boîtes de photos de mariage.", "soft"),
        n("Elle ouvre une boîte, la referme, en ouvre une autre. Ses gestes deviennent rapides, saccadés. Chaque carton est un tiroir de sa propre vie qu'elle ne reconnaît pas.")
      ]
    },
    {
      id: "day3-02",
      lines: [
        n("Elle tire une petite boîte en carton du fond d'une malle. Des photos. Une petite fille aux genoux écorchés. Luce en robe d'été. Moi, à douze ans, un râteau à la main."),
        e("C'est qui, ce garçon ?", "distant"),
        n("Elle dit cela sans ironie. Elle pointe une photo de nous deux, au phare, un jour de juillet. Je sens quelque chose se fermer dans ma poitrine."),
        noe("C'est moi.", {}),
        n("Elle regarde la photo, puis moi, puis de nouveau la photo. Elle pose son doigt sur mon visage. Ses yeux se remplissent."),
        e("Je le savais. Je le savais, Noé. C'est juste que parfois, ma tête me raconte une autre version.", "sad"),
        n("Elle se lève trop vite, heurte le métronome. Il tombe. Le bois se fend sur le côté avec un bruit sec, minuscule, définitif. Elle reste figée au-dessus."),
        e("Je casse tout. Je casse les objets et je perds les gens et je ne sais même plus ce que je suis venue chercher.", "angry"),
        n("Sa voix ne monte pas. C'est pire. Elle est blanche, tranchante, tournée contre elle-même.")
      ],
      choices: [
        {
          text: "« On cherche ensemble. Sans se presser. »",
          set: { d3Care: "together" }
        },
        {
          text: "« Tu as le droit d'être en colère. Tu n'as pas à être courageuse tout le temps. »",
          set: { d3Care: "angry" }
        },
        {
          text: "« Ce n'est pas ta faute. Tu le sais, ça. »",
          set: { d3Care: "fault" }
        }
      ]
    },
    {
      id: "day3-03",
      lines: [
        {
          who: "elise",
          expr: "sad",
          text: "Ensemble. Toujours ensemble. Tu dis ça comme si on avait le temps de fouiller toute la maison.",
          if: (state) => state.flags.d3Care === "together"
        },
        {
          who: "elise",
          expr: "sad",
          text: "Je n'ai pas le droit d'être fatiguée. Si je suis fatiguée, ils vont décider pour moi.",
          if: (state) => state.flags.d3Care === "angry"
        },
        {
          who: "elise",
          expr: "worried",
          text: "Ce n'est pas ma faute. C'est ce qu'ils disent tous. Ça ne rend pas la journée plus facile.",
          if: (state) => state.flags.d3Care === "fault"
        },
        n("Je ramasse le métronome. La fêlure court sous son flanc comme une rivière. Je le remonte. Le balancier repart, hésite, puis se balance de travers."),
        noe("Il marche encore.", {}),
        e("Il a toujours été de travers. Luce disait que la mesure parfaite, c'est bon pour les horloges.", "soft"),
        n("Elle essuie son visage avec la manche du pull. Puis elle aperçoit un carton plat coincé derrière la malle. Sur le couvercle, une écriture ronde, appliquée : « Ne pas ouvrir avant la fin du monde. »"),
        e("C'est ma main.", "surprised"),
        n("À l'intérieur, une chemise de carton. Sur la couverture, un titre à l'encre noire, presque effacé :"),
        n("« Quand les notes s'effacent. Pour piano à quatre mains. »")
      ]
    },
    {
      id: "day3-04",
      lines: [
        n("La partition est faite de pages hétéroclites : du papier réglé, des morceaux de programmes de concert, une page arrachée à un cahier d'écolier. Certaines mesures sont raturées. D'autres sont vides."),
        n("Je reconnais l'écriture d'Élise à dix-sept ans. Les notes penchées, les barres de mesure qui n'arrivent jamais au bon endroit. Luce a annoté certaines pages en rouge. « Plus lentement, ici. Ce n'est pas une course. »"),
        e("Je ne me souviens pas de l'avoir écrit. Je me souviens d'avoir voulu l'écrire. Ce n'est pas pareil.", "distant"),
        noe("La dernière page est blanche.", {}),
        e("Je l'ai laissée blanche exprès. Je devais la finir après. Après quoi, je ne sais plus.", "sad"),
        n("Au dos de la chemise, deux mots plus petits, presque cachés : « pour Noé ». Je ne suis pas censé les voir. Élise les voit aussi. Nous faisons semblant de rien."),
        n("Dans le fond du carton, il y a une lettre. Une enveloppe crème, fermée, avec un seul mot : « Élise ». L'écriture est celle de Luce."),
        e("Pas aujourd'hui.", "worried"),
        n("Je la range dans le banc du piano. Elle attendra. La maison est faite pour les choses qui attendent.")
      ]
    },
    {
      id: "day3-05",
      bg: "atelier",
      tone: "warm",
      location: "L'atelier",
      music: "pluie",
      ambience: "room",
      fx: "motes",
      lines: [
        n("Nous descendons la partition. La pluie s'est arrêtée brutalement, comme quelqu'un qui cesse de pleurer pour écouter. Élise étale les pages sur le couvercle du Pleyel."),
        e("Il manque deux notes au milieu du troisième mouvement. Enfin, deux que je devrais pouvoir retrouver. Les autres, je les entends encore.", "determined"),
        noe("Comment veux-tu faire ?", {}),
        e("Comme toujours. Je joue ce qui reste. Tu écoutes. Tu me rends les trous.", "soft"),
        n("Elle pose ses mains sur le clavier. Avant de jouer, elle regarde la page blanche. Puis moi."),
        e("Si je te demande de finir cette pièce, c'est que je crois encore qu'elle peut tenir debout sans moi.", "determined")
      ]
    },
    {
      id: "day3-piano",
      kind: "piano",
      puzzleId: "j3",
      portrait: true
    },
    {
      id: "day3-06",
      bg: "atelier",
      tone: "warm",
      location: "L'atelier",
      music: "pluie",
      ambience: "room",
      lines: [
        n("La phrase retrouvée, Élise la joue trois fois. À la troisième, le métronome fêlé s'arrête. Elle le remonte sans le regarder."),
        e("Tu sais ce que Luce disait quand je ratais une mesure ?", "soft"),
        noe("Non.", {}),
        e("Elle disait : « Ce n'est pas la note qui compte, c'est ce que tu fais du silence autour. » Je trouvais ça insupportable. Elle avait toujours raison, c'était insupportable.", "laugh"),
        n("Nous collons le métronome avec un reste de colle à bois. La fêlure reste visible. Élise passe son doigt dessus."),
        e("Je vais écrire toutes les notes que je retrouve dans un cahier. Les dates, les noms, les choses qu'on ne peut pas mettre en musique. Si un jour je me réveille sans rien, tu me liras.", "neutral"),
        noe("Je ne suis pas sûr d'être un bon lecteur à voix haute.", {}),
        e("Tu liras mal. Ça me conviendra.", "smile"),
        n("Elle note le fragment au stylo, puis elle ajoute mon nom en marge. Pas mon prénom. Juste « Noé ». Comme si c'était une indication de tempo.")
      ]
    },
    {
      id: "day3-07",
      bg: "atelier",
      tone: "night",
      location: "L'atelier · le soir",
      music: "pluie",
      ambience: "room",
      lines: [
        n("Le soir, la maison est pleine du bruit de l'eau qui s'égoutte. Élise s'endort sur le canapé, la partition sur les genoux. Je couvre ses jambes avec un plaid. Le métronome continue de battre, de travers."),
        n("Dans le carton, il y a la lettre de Luce. Je pense à toutes les choses qu'elle pourrait dire. Je pense à ce que j'aurais écrit, moi, si j'avais eu le courage de laisser une lettre avant de partir."),
        n("Je vais dans l'atelier et je joue la phrase retrouvée, très bas. Pas pour Élise. Pour moi. Pour voir si elle tient encore debout quand personne n'écoute."),
        n("Elle tient. Mais elle penche, comme le métronome.")
      ]
    }
  ]
};
