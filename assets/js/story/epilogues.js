import { n, noe, e, m } from "./helpers.js";

export const epilogueHeld = {
  id: "epilogue-held",
  number: 8,
  epilogue: true,
  label: "Épilogue",
  date: "Après la dernière mesure",
  title: "La note tenue",
  location: "Le phare des Marées",
  quote: "« La mer ne se souvient pas de la plage. Elle revient quand même. »",
  bg: "epilogue",
  tone: "dawn",
  fx: "motes",
  music: "epilogue",
  ambience: "sea",
  portrait: false,
  pages: [
    {
      id: "held-01",
      bg: "phare",
      tone: "night",
      music: null,
      playCoda: true,
      ambience: "hall",
      location: "Le phare des Marées · 21 h 12",
      lines: [
        n("Tu joues les quatre notes. La première est un mi grave, presque un souffle. Les deux suivantes viennent de toi. La dernière est un la qui refuse de finir."),
        n("Élise ne bouge pas. Sa main est posée sur le couvercle, à côté de la tienne. Elle écoute comme si elle découvrait la pièce pour la première fois, ce qui est peut-être le cas."),
        n("Quand le la s'éteint, le silence dure plus longtemps que la musique. Puis quelqu'un se lève au fond de la salle. C'est Margot. Elle applaudit seule pendant trois secondes, et le reste du monde se souvient qu'il a des mains."),
        n("Élise ne se retourne pas tout de suite. Elle regarde les touches, puis le papier, puis toi. Elle a les yeux brillants et le visage d'une personne qui vient de retrouver une clé dans une poche qu'elle avait oubliée."),
        e("C'était nous.", "soft"),
        noe("C'était nous.", {}),
        n("Tu ne sais pas si elle se souviendra de cette phrase demain. Ce soir, elle est vraie. Cela suffit pour traverser la nuit.")
      ]
    },
    {
      id: "held-02",
      bg: "epilogue",
      tone: "dawn",
      music: "epilogue",
      ambience: "sea",
      location: "Kerlann · Trois ans plus tard",
      lines: [
        n("Trois ans plus tard, la maison des Mouettes appartient au couple de Rennes qui loue des chambres l'été. Ils ont gardé le pot bleu sur le perron. Je ne sais pas s'ils savent qu'il cache une clé. Je préfère ne pas leur dire."),
        n("Le Pleyel est au phare. La commune a accepté de le déplacer après le concert, parce que Margot a fait signer une pétition et que Margot obtient toujours ce qu'elle veut. L'atelier est devenu une chambre d'amis. J'y dors quand les nouveaux propriétaires n'ont pas besoin de moi."),
        n("Je suis resté. Je fais des enregistrements pour une association de sauvegarde du littoral. Je répare les câbles du café. Le mardi, j'apprends à trois enfants à écouter le silence avant de jouer."),
        {
          who: "narr",
          text: "J'avais promis de rester après le concert, sans savoir ce que cela voudrait dire. Cela a voulu dire apprendre les horaires de bus, les dossiers, les mots qu'il faut répéter. Cela a voulu dire rester même les jours où elle ne savait plus pourquoi j'étais là.",
          if: (state) => state.flags.d4Stay === "after"
        },
        {
          who: "narr",
          text: "J'avais promis le concert, rien de plus. Puis le concert est passé, et je n'ai pas pris le train. Les jours ont fait le reste. Parfois, une promesse minuscule suffit à ouvrir une vie.",
          if: (state) => state.flags.d4Stay === "concert"
        },
        {
          who: "narr",
          text: "Je n'avais rien promis. C'est peut-être pour cela que rester a été une décision chaque matin, et non une dette. Certains matins, je repars. Le plus souvent, je reste.",
          if: (state) => state.flags.d4Stay === "unknown"
        },
        n("L'appartement prévu à Rennes n'a jamais été disponible. Une place s'est ouverte à La Chapelle des Vents, à Saint-Malo, avec une chambre et une fenêtre sur les toits. Élise a dit que les toits, au moins, ne lui rappelaient rien. Tous les dimanches, Margot ferme le café et nous conduit au phare. Nous jouons la pièce. Pas toujours en entier. Parfois seulement les premières mesures. Parfois seulement les quatre notes de la fin."),
        {
          who: "narr",
          text: "Quand j'ai dit que je resterais à Kerlann, je ne savais pas que ce serait pour elle une adresse parmi d'autres. Maintenant, elle me demande parfois où j'habite. Je réponds : « Ici. » Et c'est vrai, même quand elle l'oublie.",
          if: (state) => state.flags.d6After === "stay"
        },
        {
          who: "narr",
          text: "Je ne pars plus sans le lui dire. Parfois, c'est pour trois heures. Parfois pour trois jours. Chaque fois, je le lui dis, même si elle oublie avant mon retour.",
          if: (state) => state.flags.d6After === "tell"
        },
        {
          who: "narr",
          text: "Je n'avais promis qu'un soir. Puis un autre. Puis les soirs ont fait des années.",
          if: (state) => state.flags.d6After === "now"
        },
        n("Certains dimanches, elle me demande qui je suis. Je réponds : « Noé. » Elle hoche la tête comme si c'était un renseignement utile, puis elle me tend une main froide pour que je l'aide à monter sur le banc.")
      ]
    },
    {
      id: "held-03",
      bg: "phare",
      tone: "warm",
      music: "epilogue",
      ambience: "hall",
      location: "Un dimanche de juin",
      lines: [
        n("Le lendemain du concert, Margot m'a donné la lettre d'Élise. Je l'ai lue dans la voiture, sur le parking du phare, avec le moteur allumé pour avoir de la lumière. Je ne l'ai pas montrée à Élise. Je ne sais pas si elle se souvient de l'avoir écrite."),
        n("Il y a une phrase que je n'ai pas oubliée : « Je t'aime à retardement. Ça compte quand même. »"),
        n("Aujourd'hui, Élise joue la première page et s'arrête au milieu de la deuxième. Elle cherche une note qui n'est pas là. Je pose ma main à côté de la sienne, sans toucher les touches."),
        e("C'est vous qui avez écrit la fin ?", "distant"),
        noe("C'est nous.", {}),
        n("Elle regarde la page blanche, puis la tienne. Elle ne se souvient pas de la coda. Mais ses doigts trouvent les deux notes du milieu sans hésiter. Le corps a d'autres archives."),
        e("Alors on va la jouer.", "determined"),
        n("Nous la jouons. C'est maladroit, lent, différent chaque fois. À la fin, elle ne dit rien. Elle pose sa tête sur mon épaule et regarde la mer par la fenêtre."),
        {
          who: "elise",
          expr: "soft",
          text: "Tu te souviens du radeau ? Tu m'as sauvé la vie, tu sais.",
          if: (state) => state.flags.d2Raft === "let"
        },
        {
          who: "elise",
          expr: "soft",
          text: "Je suis tombée du radeau. Tu m'as attrapée par la manche. Tu ne m'as jamais laissée couler.",
          if: (state) => state.flags.d2Raft === "truth"
        },
        {
          who: "elise",
          expr: "smile",
          text: "On est tombés tous les deux, hein ? C'est pour ça que le radeau a coulé.",
          if: (state) => state.flags.d2Raft === "both"
        },
        noe("Oui.", {}),
        n("Elle ne demande pas si c'est vrai. Aujourd'hui, elle a choisi son souvenir. Je le lui laisse. Il est à elle.")
      ]
    },
    {
      id: "held-04",
      bg: "epilogue",
      tone: "dawn",
      music: "epilogue",
      ambience: "sea",
      location: "La plage des Vaches · septembre",
      lines: [
        n("En septembre, nous retournons à la plage. C'est un jour sans vent, un de ces jours où la mer fait semblant d'être une toile peinte. Élise tient ses souliers à la main. Elle oublie qu'elle les tient et les lâche dans le sable."),
        n("Nous nous asseyons sur une poutre que la marée a poussée là. Elle sort un coquillage de sa poche. Je ne sais pas lequel des deux. Elle le met à son oreille."),
        e("On entend la mer.", "soft"),
        noe("On est devant la mer.", {}),
        e("Ça n'empêche pas.", "smile"),
        n("Elle me regarde. Parfois, je vois passer l'ombre du doute. Parfois, elle sourit avant même de me reconnaître, parce que mon visage est devenu un endroit familier, même sans les mots."),
        e("Vous êtes qui, déjà ?", "distant"),
        noe("Quelqu'un qui est resté.", {}),
        e("C'est bien.", "soft"),
        n("Elle pose sa main sur la mienne. La mer monte. Nous ne bougeons pas. Le passé n'est pas derrière nous : il est dans nos mains, dans la coda, dans le pot bleu. Il ne tient pas tout seul. Nous le tenons.")
      ]
    }
  ]
};

export const epilogueSilence = {
  id: "epilogue-silence",
  number: 8,
  epilogue: true,
  label: "Épilogue",
  date: "Après la dernière mesure",
  title: "Le silence",
  location: "Le phare des Marées",
  quote: "« Le silence n'est pas un oubli. C'est une note qu'on choisit de ne pas jouer. »",
  bg: "epilogue",
  tone: "dawn",
  fx: "motes",
  music: "epilogue",
  ambience: "sea",
  portrait: false,
  pages: [
    {
      id: "silence-01",
      bg: "phare",
      tone: "night",
      music: null,
      ambience: "hall",
      location: "Le phare des Marées · 21 h 13",
      lines: [
        n("Tu refermes le clavier. Le bois fait un petit bruit, comme une porte de nuit. Tu prends la main d'Élise. Elle est froide, précise, vivante."),
        n("La salle attend. Les quatre notes restent sur la page blanche. Personne ne tousse. Dehors, une vague se retire."),
        n("Puis une voix s'élève au fond. Margot. Elle fredonne la première phrase de la pièce, mal, sans assurance. Une deuxième voix la rejoint près de la porte. Puis une autre. Bientôt la salle entière chante la mélodie qu'Élise vient de perdre."),
        n("Élise ferme les yeux. Elle écoute. Sa bouche remue sur quelques notes. Elle ne cherche pas à retrouver la suite. Elle laisse le monde la porter."),
        e("C'est joli.", "soft"),
        noe("C'est toi.", {}),
        e("Alors c'est bien.", "smile"),
        n("Vous sortez par la porte de service pendant que les applaudissements commencent. La mer est là, derrière le phare, énorme et calme. Élise tient ta main comme on tient une rampe.")
      ]
    },
    {
      id: "silence-02",
      bg: "atelier",
      tone: "warm",
      music: "epilogue",
      ambience: "room",
      location: "Kerlann · Octobre",
      lines: [
        n("La maison a été vendue le mois suivant. Le piano est resté chez Margot, dans l'arrière-salle du café, entre les caisses de bouteilles et les chaises empilées. Le phare a proposé de l'accueillir, mais Élise a dit qu'elle voulait pouvoir en jouer sans qu'on l'écoute."),
        n("Nous avons enregistré la pièce un dimanche d'octobre. Pas en concert. Juste nous deux, dans l'atelier, avec les fenêtres ouvertes et le bruit de la mer dans les micros. Elle n'a pas joué la coda. Elle s'est arrêtée quand elle a perdu la suite, et elle a posé sa tête sur le couvercle."),
        n("La lettre d'Élise m'attendait dans le banc du piano. Margot me l'a donnée le lendemain du concert, avec un air qui disait qu'elle avait tenu sa promesse mieux que moi."),
        n("J'ai gardé l'enregistrement. Elle est partie vivre à Rennes en novembre. Je suis resté à Kerlann. Je loue une chambre au-dessus du café, je fais des enregistrements pour la radio locale, et le mardi j'accorde le piano pour les enfants qui viennent apprendre."),
        {
          who: "narr",
          text: "Je n'avais promis que le concert. Le lundi suivant, j'ai acheté un abonnement de bus. Je n'ai jamais demandé le remboursement du train pour Lyon.",
          if: (state) => state.flags.d4Stay === "concert"
        },
        {
          who: "narr",
          text: "Rester ne ressemblait pas à ce que j'imaginais. Ce n'était pas héroïque. C'était des sacs de courses, des rendez-vous médicaux, des après-midi où elle me demandait de partir parce qu'elle ne me reconnaissait pas. Je sortais. Je revenais le lendemain.",
          if: (state) => state.flags.d4Stay === "after" || state.flags.d4Stay === "unknown"
        },
        n("La pièce n'a jamais été rejouée en public. À quoi bon ? Les œuvres ne sont pas des monuments. Parfois, une chose belle est un endroit où l'on s'assoit ensemble, et puis on se lève.")
      ]
    },
    {
      id: "silence-03",
      bg: "epilogue",
      tone: "dawn",
      music: "epilogue",
      ambience: "sea",
      location: "Saint-Malo · Deux ans plus tard",
      lines: [
        n("L'appartement de Rennes n'a duré qu'un an. Trop de couloirs, trop de portes identiques. La Chapelle des Vents, à Saint-Malo, avait une petite salle commune avec un tourne-disque et une fenêtre sur les toits. J'y apporte la cassette de Luce et l'enregistrement de la pièce. Nous les écoutons dans l'ordre, comme deux vagues qui se suivent."),
        n("Élise ne reconnaît pas sa propre voix au piano. Elle écoute avec attention, les mains croisées sur les genoux. Arrivée au milieu de la pièce, là où le silence commence, elle lève la tête."),
        e("On dirait deux personnes qui se tiennent la main.", "distant"),
        noe("C'est toi qui l'as écrite.", {}),
        e("C'est joli.", "soft"),
        n("Elle ne demande pas qui joue. Elle ne demande pas qui est l'autre personne. Elle continue d'écouter comme on regarde une photo d'un pays où l'on a vécu."),
        e("L'autre personne est gentille ?", "soft"),
        noe("Oui.", {}),
        e("Alors j'ai eu de la chance.", "smile"),
        {
          who: "narr",
          text: "Je n'ai jamais tenu la promesse de rester tous les jours. J'ai tenu celle de revenir. Il y a une différence, et elle est suffisante.",
          if: (state) => state.flags.d4Stay === "after"
        },
        {
          who: "narr",
          text: "Je n'avais rien promis. J'ai pourtant appris les horaires du dernier bus et le prénom des infirmières. C'est peut-être cela, une vie qui ne ressemble pas à un plan.",
          if: (state) => state.flags.d4Stay === "unknown"
        },
        n("Il y a des vérités qu'on ne peut pas expliquer. Celle-là passe par la fenêtre, avec la lumière de Saint-Malo et le bruit des mouettes.")
      ]
    },
    {
      id: "silence-04",
      bg: "plage",
      tone: "dawn",
      music: "epilogue",
      ambience: "sea",
      location: "Kerlann · La plage des Vaches",
      lines: [
        n("Le lendemain, je retourne à la plage. La mer est basse. Je trouve une coquille intacte, rose à l'intérieur, et je la mets dans ma poche."),
        n("Au phare, le piano est silencieux. Sur la page blanche de la partition, quelqu'un a écrit au crayon : « Ici, on peut s'arrêter. » Je ne sais pas si c'est Élise, Margot ou le vent. L'écriture est penchée vers la mer."),
        n("Je ne joue pas. Je pose ma main sur le couvercle, comme elle le faisait. Le silence a la forme de sa main. Il a aussi la forme de la mienne."),
        n("En rentrant, je passe devant le pot bleu. La clé n'y est plus. Les nouveaux propriétaires ont mis des géraniums. Ils sont vivants. C'est déjà beaucoup."),
        n("Il y a des fins qui ne ferment rien. Elles laissent une mesure en suspens. On peut marcher dessous pendant des années sans être écrasé.")
      ]
    }
  ]
};
