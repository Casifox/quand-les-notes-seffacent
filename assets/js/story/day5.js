import { n, noe, e } from "./helpers.js";

export const day5 = {
  id: "day5",
  number: 5,
  label: "Jour 5",
  date: "Mercredi 16 septembre",
  title: "La tempête",
  location: "Kerlann · Les Mouettes",
  quote: "« Je ne veux pas qu'on se souvienne de moi à moitié. »",
  bg: "tempete",
  tone: "storm",
  weather: "storm",
  fx: "rain",
  music: "tempete",
  ambience: "storm",
  portrait: true,
  pages: [
    {
      id: "day5-01",
      lines: [
        n("Le vent arrive à dix-neuf heures, comme une bête qui cherche une porte. Les volets claquent. La mer passe par-dessus la jetée. À l'intérieur, Élise allume des bougies avec la concentration d'une enfant qui prépare un rituel."),
        e("On a du thé, des bougies, et un piano. On est plus riches que la moitié de Kerlann.", "smile"),
        n("Elle a sorti les chandeliers dépareillés de Luce. Elle les dispose en cercle autour du piano. La lumière fait danser les ombres sur les murs."),
        e("On pourrait jouer la pièce entière ce soir. Comme répétition générale. Si on survit à la tempête, vendredi sera facile.", "laugh"),
        n("La première coupure vient à 19 h 42. Le réfrigérateur s'arrête au milieu d'un souffle. Les lampes s'éteignent. La maison tombe dans un noir épais, puis les bougies reprennent le dessus."),
        e("Ah.", "surprised"),
        n("Un éclair découpe la pièce en blanc. Le tonnerre suit si vite qu'il semble naître dans les murs. Élise laisse tomber le verre qu'elle tenait. Il se brise sur le carrelage."),
        e("Où est Mamie ?", "worried")
      ]
    },
    {
      id: "day5-02",
      lines: [
        n("Sa voix a changé. Ce n'est pas seulement la peur. C'est un timbre plus jeune, une façon de se tenir plus droite, les mains ouvertes comme si elle cherchait un mur."),
        e("Je suis en retard. L'examen est à huit heures. Je dois jouer la sonate de Brahms et je n'ai pas fini le deuxième mouvement. Pourquoi il fait noir ?", "worried"),
        noe("Élise, c'est moi. Noé. Tu es chez toi. La tempête a coupé l'électricité.", {}),
        n("Elle recule jusqu'au piano. Ses omoplates heurtent le couvercle. Elle me regarde comme on regarde un intrus."),
        e("Vous êtes qui ? Où est ma grand-mère ?", "afraid"),
        n("Le sol est couvert de verre. La bougie sur le buffet projette mon ombre contre le mur. J'ai peur de bouger. J'ai peur de ma propre silhouette.")
      ],
      choices: [
        {
          text: "« Luce est morte l'hiver dernier, Élise. Tu es chez toi. Je suis Noé. »",
          set: { d5Ground: "truth" }
        },
        {
          text: "« Luce est là. Elle écoute. Tu n'es pas seule. »",
          set: { d5Ground: "story" }
        },
        {
          text: "Tu ne dis rien. Tu tends la main et tu respires lentement, pour qu'elle puisse suivre.",
          set: { d5Ground: "presence" }
        }
      ]
    },
    {
      id: "day5-03",
      lines: [
        {
          who: "elise",
          expr: "afraid",
          text: "Morte ? Non. Elle m'a promis qu'elle viendrait me chercher après l'examen. Elle a promis.",
          if: (state) => state.flags.d5Ground === "truth"
        },
        {
          who: "elise",
          expr: "worried",
          text: "Elle est là ? Alors pourquoi elle ne répond pas ? Mamie ? Mamie, c'est moi !",
          if: (state) => state.flags.d5Ground === "story"
        },
        {
          who: "elise",
          expr: "afraid",
          text: "Votre main est froide. Ma grand-mère dit qu'il ne faut pas prendre la main des inconnus.",
          if: (state) => state.flags.d5Ground === "presence"
        },
        n("Je sens la panique monter dans ma poitrine. Les mots ne suffisent pas. Ils n'ont jamais suffi. Alors je fais la seule chose que je sais faire quand une pièce est trop grande."),
        n("Je vais au piano. Le sol craque sous mes semelles. J'écarte le verre du bout du pied et je m'assois dans la lumière d'une bougie."),
        n("Je joue les quatre notes. Mi, ré, do, si. Lentement. Comme on ouvre une porte qu'on croit fermée."),
        n("Élise s'arrête. Sa main se pose sur le couvercle. Elle ne me reconnaît pas encore, mais son corps reconnaît la phrase."),
        e("C'est la chanson du radeau.", "distant"),
        noe("C'est la nôtre.", {}),
        n("Je rejoue les notes. Elle avance d'un pas. Puis un autre. Elle s'assoit à côté de moi, sans me regarder. Ses doigts trouvent les touches graves. Elle joue une note sous ma mélodie. Juste une.")
      ]
    },
    {
      id: "day5-04",
      lines: [
        n("Nous restons ainsi un long moment. La tempête cogne aux fenêtres, mais la maison tient. Puis Élise retire ses mains. Elle regarde le verre brisé, les bougies, mon visage."),
        e("Je t'ai demandé qui tu étais.", "sad"),
        noe("Oui.", {}),
        e("Ne me dis pas ce que j'ai fait. Je m'en souviendrai peut-être demain. Et si je ne m'en souviens pas, je le sentirai dans la maison.", "tired"),
        n("Elle ramène ses genoux contre sa poitrine. Le pull est trop grand. Elle a l'air minuscule."),
        e("C'est ça, le plus humiliant. Pas de ne plus savoir. De te regarder et de ne plus te reconnaître. De te faire peur, alors que tu es la personne que je connais le mieux.", "sad"),
        noe("Tu ne m'as pas fait peur.", {}),
        n("Mensonge. Elle me regarde. Elle sait."),
        e("Vendredi, si ça arrive sur scène, je ne veux pas qu'on me filme comme une chose qui se casse. Je ne veux pas qu'on applaudisse la maladie. Je veux qu'on applaudisse la musique, ou qu'on se taise.", "determined"),
        e("Alors il faut que tu me promettes quelque chose. Si je te fais signe — si je m'arrête et que je te regarde — tu ne continues pas sans moi.", "worried")
      ],
      choices: [
        {
          text: "« Je te le promets. Si tu me demandes d'arrêter, j'arrête. »",
          set: { d5Promise: "stop" }
        },
        {
          text: "« Je te promets de rester à côté de toi, quoi qu'il arrive. »",
          set: { d5Promise: "stay" }
        },
        {
          text: "« Je te promets de ne pas décider à ta place. On décidera ensemble, sur scène. »",
          set: { d5Promise: "together" }
        }
      ]
    },
    {
      id: "day5-05",
      lines: [
        {
          who: "elise",
          expr: "sad",
          text: "Tu n'as pas idée de ce que ça me soulage. Je peux m'arrêter sans que ce soit une défaite.",
          if: (state) => state.flags.d5Promise === "stop"
        },
        {
          who: "elise",
          expr: "soft",
          text: "Rester. Même quand je ne sais plus qui tu es. Surtout quand je ne sais plus qui tu es.",
          if: (state) => state.flags.d5Promise === "stay"
        },
        {
          who: "elise",
          expr: "determined",
          text: "Ensemble. Même pour décider que c'est fini. C'est plus difficile que de tout porter, tu sais.",
          if: (state) => state.flags.d5Promise === "together"
        },
        n("Un éclair éclaire le piano. Sur la page posée contre le pupitre, les notes disparaissent dans la lumière blanche. Élise la retire et la retourne."),
        e("Pas de partition. Pas pour celle-là. Dans le noir, je n'ai que ce que j'entends. Et toi, tu écoutes.", "determined"),
        noe("Et si je me trompe ?", {}),
        e("Alors tu te tromperas. Je ne vais pas mourir d'une fausse note. Je vais mourir de silence.", "soft"),
        n("Elle rit de sa propre brutalité, puis pose sa main sur la mienne. La bougie projette nos deux ombres sur le couvercle. Pendant une seconde, elles jouent du piano toutes seules.")
      ]
    },
    {
      id: "day5-piano",
      kind: "piano",
      puzzleId: "j5",
      portrait: true
    },
    {
      id: "day5-06",
      lines: [
        n("La dernière note tombe. Dans le noir, on ne sait pas combien de temps elle a duré. Élise a les joues mouillées. Elle ne pleure pas fort. C'est une pluie discrète, à l'intérieur."),
        e("Tu es resté.", "soft"),
        noe("Où veux-tu que j'aille ?", {}),
        e("Je ne sais pas. Tu as peut-être une vie, des trains, des micros, des gens qui ne te demandent pas de leur rappeler leur propre nom.", "sad"),
        n("Je l'attire contre mon épaule. Elle résiste une seconde, puis cède. Le tissu du pull sent la cire et le sel."),
        noe("J'ai écouté tous les pianos de Lyon. Aucun ne jouait comme toi. C'est bête, mais c'est vrai.", {}),
        e("C'est très bête.", "soft"),
        noe("Je sais.", {}),
        e("Dis-moi autre chose de vrai. Pas quelque chose de beau. Quelque chose de vrai.", "distant"),
        n("Je réfléchis. Le vent passe sous la porte comme un animal. La bougie fait un bruit de papier."),
        noe("Je t'en ai voulu de ne pas me retenir. Je t'en ai voulu pendant des années. Et quand j'ai reçu ta lettre, j'ai su que je n'attendais que ça.", {}),
        n("Elle ferme les yeux. Sa main trouve la mienne, sans se tromper de chemin. Sur le verre de la bougie, elle trace avec son ongle deux mots presque invisibles : « encore là »."),
        e("Je vais oublier cette nuit. Peut-être demain, peut-être dans un mois. Mais toi, souviens-toi que je n'ai pas eu peur de toi. J'ai eu peur de disparaître.", "sad"),
        n("Nous restons sur le banc jusqu'à ce que la bougie se noie dans sa propre cire. Dehors, la tempête finit par se fatiguer.")
      ]
    },
    {
      id: "day5-07",
      tone: "dawn",
      weather: false,
      fx: "motes",
      music: "espoir",
      ambience: "sea",
      location: "La maison · 5 h",
      lines: [
        n("Vers cinq heures, le vent tombe. La mer est encore agitée, mais le ciel pâlit derrière les volets. Élise s'est endormie contre moi, la tête dans le creux de mon épaule, la main ouverte sur le clavier."),
        n("Je ne dors pas. Je regarde la fêlure du plafond, les bougies mortes, la partition retournée. Je pense au nombre de nuits qu'il faudrait pour épuiser le temps qu'on a perdu."),
        n("Élise bouge. Elle ouvre les yeux, cherche la pièce, puis me trouve. Cette fois, elle ne demande pas qui je suis."),
        e("Il est tôt ?", "tired"),
        noe("Presque. Rendors-toi.", {}),
        e("Je veux juste vérifier un truc.", "soft"),
        n("Elle pose sa main sur ma joue. Ses doigts sentent la cire. Elle me regarde longtemps, comme si elle voulait graver quelque chose dans la lumière du matin."),
        e("C'est bien ce que je pensais. Tu es toujours là.", "smile"),
        n("La marée descend. La maison craque. Le jour se lève sur ce qui reste.")
      ]
    }
  ]
};
