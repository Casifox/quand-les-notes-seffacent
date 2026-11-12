import { n, noe, e } from "./helpers.js";

export const day2 = {
  id: "day2",
  number: 2,
  label: "Jour 2",
  date: "Dimanche 13 septembre",
  title: "Les coquillages",
  location: "Kerlann · La plage des Vaches",
  quote: "« La mer oublie toujours une chose sur la plage. À nous de la retrouver. »",
  bg: "plage",
  tone: "day",
  fx: "sea",
  music: "plage",
  ambience: "sea",
  portrait: true,
  pages: [
    {
      id: "day2-01",
      lines: [
        n("Dimanche, sept heures. Élise a laissé un mot sur la table : « Café dans la caisse. Je suis à la plage. Ne mets pas trop de miel. » C'est la première fois que j'écris son prénom sur une liste de courses, et je le fais exprès."),
        n("Elle m'attend au bas des escaliers de bois, un seau en fer à la main. Le vent a renversé ses cheveux sur un côté. Elle est pieds nus dans le sable mouillé, avec l'air d'avoir dormi debout."),
        e("Tu as mis du miel.", "smile"),
        noe("Une demi-cuiller.", {}),
        e("Tu progresses. Dans sept ans, tu sauras faire le thé.", "laugh"),
        n("Nous marchons vers la laisse de mer. La marée a déposé des algues, des bouts de filet, un gant sans propriétaire. Élise ramasse les coquillages un par un, les secoue près de son oreille, écarte ceux qui sont fêlés."),
        e("Luce appelait ça les petites maisons du bruit. Elle disait qu'un coquillage vide garde toujours la dernière conversation qui l'a traversé.", "soft")
      ]
    },
    {
      id: "day2-02",
      lines: [
        n("Nous arrivons à l'endroit où le vieux ponton pourrissait autrefois. Il n'en reste que six poteaux noirs et une barque retournée. Élise s'arrête."),
        e("Tu te souviens du radeau ? Celui qu'on avait construit avec des bidons et de la ficelle de pêche ?", "smile"),
        noe("Le radeau qui a tenu exactement jusqu'à ce qu'on monte dessus.", {}),
        e("Je te vois encore tomber. Tu as bu la tasse pendant une minute entière. Je riais tellement que j'ai failli me noyer aussi.", "laugh"),
        n("Ce n'est pas comme ça que ça s'est passé. C'est elle qui a glissé du radeau. Je l'ai attrapée par la manche, sa manche a craqué, et nous avons tous les deux bu la tasse. Nous en avons ri jusqu'à ce que Luce nous appelle avec sa lampe de poche."),
        n("Je regarde son visage. Elle attend que je confirme. Cela lui va si bien, cette petite gloire inventée.")
      ],
      choices: [
        {
          text: "« C'est toi qui es tombée. Je t'ai attrapée par la manche. »",
          set: { d2Raft: "truth" }
        },
        {
          text: "« Tu m'as sauvé la vie. Je m'en souviens comme si c'était hier. »",
          set: { d2Raft: "let" }
        },
        {
          text: "« On est tombés tous les deux. La ficelle n'a pas tenu. »",
          set: { d2Raft: "both" }
        }
      ]
    },
    {
      id: "day2-03",
      lines: [
        {
          who: "elise",
          expr: "soft",
          text: "Tu me corriges. Toujours. Même quand j'arrange le souvenir pour qu'il me fasse moins peur.",
          if: (state) => state.flags.d2Raft === "truth"
        },
        {
          who: "elise",
          expr: "smile",
          text: "Tu mens. Tu mens pour me laisser mon radeau. Je t'aime aussi pour ça.",
          if: (state) => state.flags.d2Raft === "let"
        },
        {
          who: "elise",
          expr: "laugh",
          text: "C'est bien ce qu'il me semblait. Un radeau, ça échoue toujours à deux. C'est pour ça que ça compte.",
          if: (state) => state.flags.d2Raft === "both"
        },
        n("Elle reprend sa marche. Puis elle dit, sans me regarder :"),
        e("Parfois, je raconte des choses qui n'arrivent pas. Les détails se remplacent tout seuls. Un jour, je te raconterai peut-être qu'on s'est aimés, et tu ne sauras pas si c'est un souvenir ou une invention.", "distant"),
        noe("On s'est aimés.", {}),
        n("Elle me regarde. Le vent nous jette du sable dans les yeux. Elle n'a pas reculé."),
        e("Alors tu me diras la vérité. Même quand elle est laide. Même quand je ne peux pas la garder.", "determined")
      ]
    },
    {
      id: "day2-04",
      lines: [
        n("Nous marchons longtemps avant de reparler. La plage se rétrécit, les rochers prennent la place du sable. Elle dit soudain :"),
        e("Je suis allée à la gare, la nuit où tu es parti. J'ai attendu. J'avais une lettre.", "distant"),
        n("Mon corps se souvient avant moi. Le froid du quai, les néons, la valise que je n'avais pas su fermer."),
        noe("Je ne savais pas.", {}),
        e("Tu n'as pas demandé. J'ai attendu le dernier train. Je ne me souviens plus de ce que j'avais écrit. Peut-être que je te disais de rester. Peut-être que je te disais de partir et de m'écrire.", "sad"),
        n("Je regarde les vagues. Il faut que je le dise maintenant. Après, le courage aura repris la mer."),
        noe("Je t'ai entendue parler à Luce. Je passais sous la fenêtre. Tu disais que tu ne pouvais pas me suivre. Que tu ne quitterais jamais la maison, ni elle.", {}),
        e("Ce n'est pas ce que je voulais dire. Ou si. Je ne sais plus. Je ne sais plus ce que je disais hier.", "sad"),
        n("Je sais. C'est peut-être pour cela que je peux enfin lui répondre.")
      ],
      choices: [
        {
          text: "« Je suis parti parce que je t'aimais et que j'ai préféré fuir. »",
          set: { d2Reason: "love" }
        },
        {
          text: "« Je suis parti parce que j'ai cru que tu avais choisi Luce. »",
          set: { d2Reason: "luce" }
        },
        {
          text: "« Je suis parti parce que j'étais jeune et lâche. Il n'y a rien d'autre à comprendre. »",
          set: { d2Reason: "young" }
        }
      ]
    },
    {
      id: "day2-05",
      lines: [
        {
          who: "elise",
          expr: "soft",
          text: "Tu es parti parce que tu m'aimais. C'est la chose la plus lâche et la plus romantique qu'on m'ait dite. J'aurais préféré une lettre.",
          if: (state) => state.flags.d2Reason === "love"
        },
        {
          who: "elise",
          expr: "sad",
          text: "Je n'ai jamais choisi entre toi et elle. J'ai choisi de ne pas laisser une vieille femme seule. Ce n'était pas un choix contre toi.",
          if: (state) => state.flags.d2Reason === "luce"
        },
        {
          who: "elise",
          expr: "soft",
          text: "Tu avais vingt ans. Moi aussi. On avait le droit d'être idiots. On n'avait pas le droit de laisser les idiots décider de tout.",
          if: (state) => state.flags.d2Reason === "young"
        },
        n("Elle met une coquille dans le seau. Ensuite, elle ajoute, presque pour elle :"),
        e("On n'a pas perdu sept ans. On les a passés ailleurs. Ce n'est pas pareil.", "distant"),
        n("Nous continuons à marcher. La marée remonte derrière nous, efface nos pas. Élise fredonne. Une phrase incomplète, avec deux trous au milieu."),
        e("C'était la chanson du coquillage. Luce la chantait quand elle rangeait les factures. Je n'ai jamais réussi à retrouver les notes qui manquent.", "neutral"),
        n("Elle frotte une coquille contre sa manche et me la tend. Rien à l'intérieur. Juste le vent."),
        e("Aide-moi à retrouver la marée.", "soft")
      ]
    },
    {
      id: "day2-piano",
      kind: "piano",
      puzzleId: "j2",
      portrait: true
    },
    {
      id: "day2-06",
      lines: [
        n("La phrase est entière, maintenant. Le vent la prend, la repose entre les rochers, la rend. Élise ferme les yeux. Elle a du sable sur les cils."),
        e("Garde-le.", "soft"),
        n("Elle glisse le coquillage dans la poche de mon manteau. Sa main s'attarde. Je ne bouge pas. Surtout, ne pas bouger."),
        e("Si un jour je ne sais plus qui tu es, tu souffleras dedans. Je reviendrai.", "smile"),
        noe("Et si tu ne reviens pas ?", {}),
        e("Alors tu joueras les notes. Il y a toujours une note qui reste.", "soft"),
        n("Nous rentrons par le sentier. Nos mains se frôlent trois fois. À la troisième, je les laisse se toucher. Elle ne retire pas la sienne. Nous marchons ainsi jusqu'au portillon, comme deux adolescents qui ignorent que le monde est en train de fondre.")
      ]
    },
    {
      id: "day2-07",
      bg: "atelier",
      tone: "warm",
      fx: "motes",
      ambience: "room",
      music: "maison",
      location: "L'atelier · le soir",
      lines: [
        n("Le soir, elle note la phrase dans un cahier à couverture verte. Elle écrit la date, puis son prénom, puis s'arrête."),
        e("Demain, il faut que je monte au grenier. Il y a une partition de Luce là-haut. Et j'ai peur de ne plus savoir ce que je cherche.", "worried"),
        n("Je regarde ses mains posées sur le cahier. Elles sont calmes. C'est le reste d'elle qui tremble.")
      ]
    }
  ]
};
