import { n, noe, e, m } from "./helpers.js";

export const day6 = {
  id: "day6",
  number: 6,
  label: "Jour 6",
  date: "Jeudi 17 septembre",
  title: "La dernière page",
  location: "Kerlann · Les Mouettes",
  quote: "« Une fin, ce n'est pas une note. C'est ce qu'on en fait après. »",
  bg: "atelier",
  tone: "day",
  fx: "motes",
  music: "espoir",
  ambience: "room",
  portrait: true,
  pages: [
    {
      id: "day6-01",
      bg: "cuisine",
      location: "Kerlann · La cuisine",
      lines: [
        n("Au matin, la mer est plate comme une assiette. On dirait que la tempête n'a jamais existé. La maison, elle, s'en souvient : une tuile dans le jardin, des branches sur le perron, une grande tache humide au plafond de la cuisine."),
        n("Élise se réveille dans son lit. Je ne sais pas comment elle est montée. Elle arrive dans la cuisine en pyjama, les cheveux en bataille, et me regarde comme si j'avais toujours été là."),
        e("On a regardé un film, hier soir ? J'ai l'impression d'avoir rêvé d'un orage.", "soft"),
        n("Je pourrais accepter. Je pourrais lui laisser le film, le rêve, la version où rien ne s'est cassé. Je repense à Margot : « Reste vraiment. »"),
        noe("Il y a eu une tempête. L'électricité est partie. Tu as eu peur. Je t'ai joué la phrase du radeau.", {}),
        n("Élise repose sa tasse. Elle regarde la bougie brûlée sur le buffet, puis la tache au plafond. Elle comprend avant que je finisse."),
        e("Je t'ai oublié ?", "worried"),
        noe("Pendant quelques minutes. Pas longtemps.", {}),
        e("Je t'ai fait peur.", "sad"),
        noe("Tu m'as fait de la peine. Ce n'est pas la même chose.", {}),
        e("Merci de me l'avoir dit.", "soft"),
        n("Elle ne dit pas que ça va. Elle ne dit pas que ce n'est rien. C'est la première fois qu'elle ne me ment pas pour me protéger.")
      ]
    },
    {
      id: "day6-02",
      bg: "cuisine",
      location: "Kerlann · La cuisine",
      lines: [
        n("Margot débarque à neuf heures avec un électricien, deux pains au chocolat et une boîte de gants en caoutchouc. Elle regarde la tache au plafond, puis Élise, puis moi, et décide que le monde peut attendre une heure de plus."),
        m("La tuile du toit, c'est pour ton notaire. Les pains au chocolat, c'est pour nous. Les gants, c'est pour ceux qui ont envie de faire semblant d'être utiles.", "warm"),
        e("Je vais bien, Margot.", "neutral"),
        m("Je sais. Tu es toujours bien. Même quand tu passes la nuit à parler à des bougies.", "playful"),
        n("Élise ouvre la bouche pour protester, puis renonce. Margot lui tend un pain au chocolat. Elle le prend. C'est une trêve."),
        n("Pendant qu'Élise monte se changer, Margot me retient dans l'escalier."),
        m("Aujourd'hui, c'est un bon jour. Les bons jours sont plus rares que les mauvais. Ne gâche pas celui-là en essayant de réparer le toit.", "soft"),
        noe("Et si demain est un mauvais jour ?", {}),
        m("Alors on mettra des bougies. On ne peut pas vivre seulement dans les jours qui nous plaisent.", "warm")
      ]
    },
    {
      id: "day6-letter",
      bg: "atelier",
      location: "L'atelier · midi",
      lines: [
        n("Dans l'atelier, Élise ouvre le banc du piano. La lettre de Luce est toujours là, sous les partitions. L'enveloppe a jauni sur un coin."),
        e("Aujourd'hui, je peux.", "worried"),
        n("Elle la décachette. Ses mains tremblent un peu. Elle me tend la feuille."),
        e("Lis-la. Je ne suis pas sûre d'aller jusqu'au bout.", "soft"),
        n("L'écriture de Luce est large, un peu penchée. Elle écrit comme elle parle : sans détour, avec des morceaux d'ordre au milieu des élans."),
        n("« Ma puce. Si tu lis cette lettre, c'est que la maison est plus silencieuse que je ne l'aurais voulu. Ne range pas ma mort avec les partitions. Sors. Joue faux. Aime quelqu'un qui te regarde comme une pièce entière et non comme un fragment. Et si un jour tu as peur d'oublier, souviens-toi que ceux qui t'aiment se souviennent pour deux. Ce n'est pas triste. C'est une façon de danser à quatre mains. »"),
        n("Élise garde les yeux fermés un long moment. Puis elle reprend la lettre, la plie, la remet dans l'enveloppe."),
        e("Elle n'était pas devin. Elle était juste ma grand-mère.", "sad"),
        noe("C'est déjà beaucoup.", {}),
        e("On va finir cette pièce. Et on va mettre des notes qui ne parlent pas de la fin.", "determined")
      ]
    },
    {
      id: "day6-03",
      bg: "atelier",
      location: "L'atelier",
      lines: [
        n("L'après-midi, nous étalons la partition sur le sol de l'atelier. Trois mouvements, trois écritures, trois âges d'Élise. La dernière page est toujours blanche."),
        e("Il me manque quatre notes pour la coda. Quatre notes, ce n'est pas grand-chose. J'ai écrit des symphonies entières dans ma tête quand j'avais seize ans, et je n'arrive pas à remplir une page.", "distant"),
        noe("Tu pourrais les écrire seule.", {}),
        e("Je pourrais. Mais alors la pièce finirait sur moi. J'ai passé six mois à écrire des notes qui disent « je me souviens », « je ne me souviens plus », « souviens-toi de moi ». J'aimerais que la fin dise autre chose.", "soft"),
        n("Elle me tend un crayon. C'est un crayon ordinaire, taillé trop court, avec des traces de dents sur le bout."),
        e("La première et la dernière note sont déjà là. Mi et la. Ce sont les deux rives. Il te reste deux notes pour traverser.", "smile"),
        noe("Et si je choisis mal ?", {}),
        e("Alors ce sera une fin qui ne ressemble pas à ce que j'avais prévu. Tant mieux. J'ai assez prévu ma disparition comme on prévoit un déménagement.", "determined")
      ]
    },
    {
      id: "day6-piano",
      kind: "piano",
      puzzleId: "j6",
      portrait: true
    },
    {
      id: "day6-04",
      bg: "atelier",
      location: "L'atelier",
      lines: [
        n("Les quatre notes sont là. Elles ne ressemblent pas à une fin de carrière, ni à un adieu. Elles ressemblent à une porte qu'on laisse ouverte."),
        e("Joue-les encore.", "soft"),
        n("Je les joue. Élise ferme les yeux. Quand le dernier la s'éteint, elle reste un moment immobile."),
        e("C'est toi. On t'entendra dans ma pièce. Même si je ne sais plus que c'est toi.", "sad"),
        n("Elle recopie la coda sur une page propre, avec la date et nos deux prénoms. Puis elle sort la clé bleue de sa poche et la pose dans ma main."),
        e("Garde-la. La maison sera vendue, mais une clé n'a pas besoin de porte pour être une clé.", "soft"),
        noe("C'est la clé de quoi, alors ?", {}),
        e("De la personne que je suis quand tu es là.", "smile"),
        n("Je referme ma main. Le métal est froid. Le porte-clés en forme de poisson me rentre dans la paume."),
        e("J'ai écrit une lettre. Enfin, quelques pages. Une lettre. Je l'ai laissée dans le banc du piano. Tu ne la lis pas avant la fin du concert.", "neutral"),
        noe("Pourquoi après ?", {}),
        e("Parce qu'avant, tu aurais le temps de me demander de la changer. Après, il faudra vivre avec.", "soft")
      ]
    },
    {
      id: "day6-05",
      bg: "phare",
      tone: "dusk",
      location: "Le phare des Marées",
      music: "phare",
      ambience: "hall",
      fx: "motes",
      lines: [
        n("Le phare des Marées n'éclaire plus les bateaux depuis 1972. La commune l'a transformé en salle de concert, avec des chaises empruntées à l'église, un plancher qui craque et une vue sur la mer qui rend toutes les chansons plus grandes."),
        n("Margot a fait déposer un vieux piano à queue sous la grande fenêtre. Élise s'assoit, joue un accord. La note reste suspendue sous la coupole comme un oiseau."),
        e("Il est désaccordé.", "soft"),
        m("Je l'ai accordé ce matin. C'est toi qui es désaccordée.", "playful"),
        e("C'est possible.", "laugh"),
        n("Nous répétons les trois premiers mouvements. Élise s'arrête plusieurs fois, cherche une page, la trouve. Ses doigts passent par-dessus les erreurs comme l'eau sur les rochers. Quand nous arrivons à la page blanche, elle pose les mains sur ses genoux."),
        e("Après le concert, tu rentres à Lyon ?", "distant"),
        n("La question est posée simplement. C'est ce qui la rend impossible.")
      ],
      choices: [
        {
          text: "« Je reste à Kerlann. Je trouverai une façon de rester. »",
          set: { d6After: "stay" }
        },
        {
          text: "« Je ne pars plus sans te le dire. Et cette fois, je te le dis. »",
          set: { d6After: "tell" }
        },
        {
          text: "« Je ne sais pas encore. Mais ce soir, je suis là. Et demain aussi. »",
          set: { d6After: "now" }
        }
      ]
    },
    {
      id: "day6-06",
      bg: "phare",
      location: "Le phare des Marées",
      music: "phare",
      ambience: "hall",
      lines: [
        {
          who: "elise",
          expr: "surprised",
          text: "Tu resterais ici ? Dans une ville où il pleut six mois par an et où tout le monde sait ce que tu as mangé au petit-déjeuner ?",
          if: (state) => state.flags.d6After === "stay"
        },
        {
          who: "elise",
          expr: "sad",
          text: "Ne me promets pas de ne jamais partir. Promets-moi de me le dire. C'est tout ce que je demande.",
          if: (state) => state.flags.d6After === "tell"
        },
        {
          who: "elise",
          expr: "soft",
          text: "Ce soir, alors. C'est déjà beaucoup. Les soirs se multiplient plus facilement que les années.",
          if: (state) => state.flags.d6After === "now"
        },
        n("Elle hoche la tête. Elle ne me croit pas complètement, et c'est normal. Les promesses, chez nous, ont toujours été des choses qu'on vérifie en les vivant."),
        n("Nous retournons au début. Cette fois, elle joue plus fort. Le phare résonne comme un ventre. Margot, assise sur une chaise au fond, essuie une vitre qui n'a pas besoin d'être essuyée."),
        e("Demain, tu restes à côté de moi jusqu'à la dernière note. Pas derrière. À côté.", "determined"),
        noe("À côté.", {}),
        n("Elle glisse un carré de papier dans ma poche. Je le sors : mon prénom, écrit de sa main. « Noé — celui qui est resté. »"),
        e("C'est pour demain. Au cas où j'oublierais les visages. Je me souviendrai peut-être des mots.", "soft")
      ]
    },
    {
      id: "day6-07",
      bg: "cuisine",
      tone: "night",
      location: "La cuisine · 22 h 37",
      music: "maison",
      ambience: "room",
      fx: "motes",
      lines: [
        n("Nous dînons de pain, de fromage et d'une soupe que Margot a laissée sur la cuisinière. Élise mange lentement. Elle demande deux fois où nous sommes allés cet après-midi."),
        n("Je réponds deux fois. La deuxième, je mets moins de mots. Elle me remercie comme si c'était la première."),
        e("Lis-moi quelque chose.", "tired"),
        noe("Quoi ?", {}),
        e("N'importe quoi. Le dos du paquet de farine. La lettre de la banque. Je veux entendre ta voix quand je ne comprends pas les mots.", "soft"),
        n("Je prends le journal local. Je lis les annonces : un vélo à vendre, un canapé, un cours de yoga le mardi. Élise ferme les yeux. Elle sourit à la page des petites annonces."),
        e("Tu viendras me voir à Rennes ?", "distant"),
        noe("Si tu me laisses entrer.", {}),
        e("Je te mettrai sur la liste. En haut. Avec une note.", "smile"),
        n("Quand je la porte jusqu'à son lit, elle pèse moins lourd que dans mon souvenir. Elle ne lâche pas ma manche. Je reste assis sur la chaise à côté jusqu'à ce que sa respiration ralentisse."),
        n("Sur la table de nuit, il y a la lettre de Luce, encore fermée, et la page blanche devenue la coda. Deux choses qui attendent demain.")
      ]
    }
  ]
};
