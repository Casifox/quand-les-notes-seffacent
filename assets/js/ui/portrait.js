let portraitSerial = 0;

const CLOSED_EYES = new Set(["laugh", "relieved"]);
const HALF_EYES = new Set(["tired", "soft"]);
const NARROW_EYES = new Set(["angry", "determined"]);
const WIDE_EYES = new Set(["surprised", "afraid"]);

function eyeMarkup(cx, cy, expression, tone) {
  const blinkClass = CLOSED_EYES.has(expression) ? "" : `eye-open${cx > 300 ? " eye-open--two" : ""}`;
  const open = !CLOSED_EYES.has(expression);
  const irisColour = tone === "margot" ? "#5d6656" : "#5b7265";
  const lookX = expression === "distant" ? -4 : expression === "sad" ? -1 : 0;
  const wide = WIDE_EYES.has(expression) ? 2 : 0;

  if (!open) {
    return `
      <g transform="translate(${cx} ${cy})">
        <path d="M-23 1Q0 -12 23 1" fill="none" stroke="#3b2d29" stroke-width="2.1" stroke-linecap="round" opacity=".82"/>
        <path d="M-17 -2Q0 -9 17 -2" fill="none" stroke="#b67f70" stroke-width="1.1" stroke-linecap="round" opacity=".35"/>
      </g>`;
  }

  const lidY = HALF_EYES.has(expression) ? 4 : NARROW_EYES.has(expression) ? 3 : -2;
  const bottomY = HALF_EYES.has(expression) ? 5 : 8;
  const eyeHeight = widthEyeHeight(expression);
  return `
    <g transform="translate(${cx} ${cy})">
      <g class="${blinkClass}">
        <path d="M-23 ${lidY}Q0 ${-13 - eyeHeight - wide} 23 ${lidY}Q0 ${bottomY + wide} -23 ${lidY}Z" fill="#f4e4d7" opacity=".92"/>
        <ellipse cx="${lookX}" cy="0" rx="${8 + wide * 0.4}" ry="${8.6 + wide * 0.5}" fill="${irisColour}"/>
        <circle cx="${lookX}" cy="0" r="${3.1 + wide * 0.2}" fill="#1d2420"/>
        <circle cx="${lookX - 2.4}" cy="-2.5" r="1.8" fill="#f9f2e6" opacity=".85"/>
        <path d="M-23 ${lidY}Q0 ${-13 - eyeHeight - wide} 23 ${lidY}" fill="none" stroke="#3c2c28" stroke-width="2" stroke-linecap="round"/>
        <path d="M-21 ${lidY + 1}Q0 ${-9 - eyeHeight - wide} 21 ${lidY + 1}" fill="none" stroke="#aa7365" stroke-width="1.1" stroke-linecap="round" opacity=".35"/>
        <path d="M-20 ${bottomY - 1}Q0 ${bottomY + 3 + wide} 20 ${bottomY - 1}" fill="none" stroke="#b98877" stroke-width="0.9" stroke-linecap="round" opacity=".45"/>
      </g>
    </g>`;
}

function widthEyeHeight(expression) {
  if (WIDE_EYES.has(expression)) return 1;
  if (NARROW_EYES.has(expression)) return -1.5;
  return 0;
}

function browMarkup(cx, cy, side, expression, tone) {
  const isLeft = side === "left";
  let innerY = 0;
  let outerY = 0;
  let arch = -13;
  switch (expression) {
    case "sad":
      innerY = isLeft ? -4 : -1;
      outerY = isLeft ? 3 : 0;
      arch = -10;
      break;
    case "worried":
    case "afraid":
      innerY = isLeft ? -5 : -2;
      outerY = isLeft ? 2 : 0;
      arch = -17;
      break;
    case "angry":
    case "determined":
      innerY = isLeft ? 5 : 4;
      outerY = isLeft ? -2 : -1;
      arch = -7;
      break;
    case "surprised":
      innerY = -3;
      outerY = -1;
      arch = -20;
      break;
    case "tired":
      innerY = 1;
      outerY = 0;
      arch = -8;
      break;
    case "soft":
    case "smile":
    case "laugh":
    case "relieved":
      innerY = 0;
      outerY = 1;
      arch = -11;
      break;
    default:
      innerY = 0;
      outerY = 0;
      arch = -12;
  }
  // Local coordinates: inner edge is toward the centre of the face.
  const innerX = isLeft ? 19 : -19;
  const outerX = isLeft ? -25 : 25;
  const browColour = tone === "margot" ? "#756b5d" : "#4a342d";
  const main = `M${outerX} ${cy + outerY}Q${cx === 0 ? 0 : -3} ${cy + arch} ${innerX} ${cy + innerY}`;
  const detail = expression === "surprised" ? `M-16 ${cy - 12}Q-4 ${cy - 16} 10 ${cy - 12}` : "";
  return `
    <g transform="translate(${cx} 0)">
      <path d="${main}" fill="none" stroke="${browColour}" stroke-width="${tone === "margot" ? 3.1 : 3.4}" stroke-linecap="round"/>
      ${detail ? `<path d="${detail}" fill="none" stroke="${browColour}" stroke-width="1.1" stroke-linecap="round" opacity=".5"/>` : ""}
    </g>`;
}

function mouthMarkup(centerX, centerY, expression, tone) {
  const lips = tone === "margot" ? "#945f58" : "#aa655f";
  const lipLight = tone === "margot" ? "#bd7f70" : "#d18d81";
  switch (expression) {
    case "laugh":
      return `
        <path d="M${centerX - 25} ${centerY - 4}Q${centerX} ${centerY - 12} ${centerX + 27} ${centerY - 3}Q${centerX + 19} ${centerY + 27} ${centerX} ${centerY + 29}Q${centerX - 18} ${centerY + 26} ${centerX - 25} ${centerY - 4}Z" fill="#713d3a"/>
        <path d="M${centerX - 18} ${centerY + 4}Q${centerX} ${centerY + 1} ${centerX + 20} ${centerY + 5}" fill="none" stroke="#f4e4d5" stroke-width="4" stroke-linecap="round"/>
        <path d="M${centerX - 12} ${centerY + 23}Q${centerX} ${centerY + 17} ${centerX + 13} ${centerY + 23}" fill="none" stroke="#c77b73" stroke-width="3" opacity=".65"/>
        <path d="M${centerX - 26} ${centerY - 3}Q${centerX} ${centerY - 11} ${centerX + 28} ${centerY - 2}" fill="none" stroke="#85514b" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>`;
    case "smile":
      return `
        <path d="M${centerX - 29} ${centerY - 3}Q${centerX} ${centerY + 23} ${centerX + 30} ${centerY - 5}" fill="none" stroke="${lips}" stroke-width="2.7" stroke-linecap="round"/>
        <path d="M${centerX - 21} ${centerY + 2}Q${centerX} ${centerY + 15} ${centerX + 22} ${centerY - 1}" fill="none" stroke="${lipLight}" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
        <path d="M${centerX - 27} ${centerY - 4}Q${centerX} ${centerY + 2} ${centerX + 28} ${centerY - 6}" fill="none" stroke="#9f625a" stroke-width="1" opacity=".4"/>`;
    case "soft":
      return `
        <path d="M${centerX - 21} ${centerY - 1}Q${centerX} ${centerY + 13} ${centerX + 22} ${centerY - 3}" fill="none" stroke="${lips}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M${centerX - 11} ${centerY + 8}Q${centerX} ${centerY + 12} ${centerX + 12} ${centerY + 7}" fill="none" stroke="${lipLight}" stroke-width="1" opacity=".55"/>`;
    case "sad":
      return `
        <path d="M${centerX - 21} ${centerY + 8}Q${centerX} ${centerY - 3} ${centerX + 22} ${centerY + 9}" fill="none" stroke="${lips}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M${centerX - 15} ${centerY + 13}Q${centerX} ${centerY + 17} ${centerX + 16} ${centerY + 13}" fill="none" stroke="${lipLight}" stroke-width="1" opacity=".35"/>`;
    case "worried":
      return `
        <path d="M${centerX - 18} ${centerY + 2}Q${centerX - 8} ${centerY + 5} ${centerX} ${centerY + 1}Q${centerX + 9} ${centerY - 2} ${centerX + 18} ${centerY + 3}" fill="none" stroke="${lips}" stroke-width="2.2" stroke-linecap="round"/>`;
    case "angry":
      return `
        <path d="M${centerX - 20} ${centerY + 4}Q${centerX} ${centerY - 1} ${centerX + 22} ${centerY + 3}" fill="none" stroke="${lips}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M${centerX - 12} ${centerY + 10}Q${centerX} ${centerY + 8} ${centerX + 13} ${centerY + 10}" fill="none" stroke="${lipLight}" stroke-width="1" opacity=".35"/>`;
    case "tired":
      return `
        <path d="M${centerX - 18} ${centerY + 3}Q${centerX} ${centerY + 6} ${centerX + 20} ${centerY + 2}" fill="none" stroke="${lips}" stroke-width="2.1" stroke-linecap="round" opacity=".85"/>`;
    case "surprised":
      return `
        <ellipse cx="${centerX}" cy="${centerY + 5}" rx="12" ry="15" fill="#7e4a47"/>
        <ellipse cx="${centerX}" cy="${centerY + 9}" rx="7" ry="7" fill="#b56f67" opacity=".65"/>
        <path d="M${centerX - 17} ${centerY - 8}Q${centerX} ${centerY - 14} ${centerX + 17} ${centerY - 8}" fill="none" stroke="#9a5f58" stroke-width="1.2" opacity=".5"/>`;
    case "afraid":
      return `
        <path d="M${centerX - 16} ${centerY + 1}Q${centerX - 12} ${centerY - 6} ${centerX - 4} ${centerY - 2}Q${centerX + 4} ${centerY + 3} ${centerX + 12} ${centerY - 3}Q${centerX + 16} ${centerY - 6} ${centerX + 18} ${centerY + 1}Q${centerX + 10} ${centerY + 20} ${centerX} ${centerY + 20}Q${centerX - 11} ${centerY + 19} ${centerX - 16} ${centerY + 1}Z" fill="#75433f"/>
        <path d="M${centerX - 11} ${centerY + 13}Q${centerX} ${centerY + 8} ${centerX + 12} ${centerY + 14}" fill="none" stroke="#c47a71" stroke-width="2.6" opacity=".55"/>`;
    case "distant":
      return `
        <path d="M${centerX - 18} ${centerY + 3}Q${centerX - 7} ${centerY + 8} ${centerX + 3} ${centerY + 2}Q${centerX + 11} ${centerY - 2} ${centerX + 20} ${centerY + 2}" fill="none" stroke="${lips}" stroke-width="2.1" stroke-linecap="round" opacity=".8"/>
        <path d="M${centerX - 8} ${centerY + 11}Q${centerX} ${centerY + 13} ${centerX + 9} ${centerY + 10}" fill="none" stroke="${lipLight}" stroke-width="1" opacity=".35"/>`;
    case "relieved":
      return `
        <path d="M${centerX - 23} ${centerY - 2}Q${centerX} ${centerY + 18} ${centerX + 24} ${centerY - 4}" fill="none" stroke="${lips}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M${centerX - 13} ${centerY + 9}Q${centerX} ${centerY + 14} ${centerX + 14} ${centerY + 8}" fill="none" stroke="${lipLight}" stroke-width="1" opacity=".5"/>`;
    case "neutral":
    default:
      return `
        <path d="M${centerX - 22} ${centerY - 1}Q${centerX - 2} ${centerY + 10} ${centerX + 23} ${centerY - 2}" fill="none" stroke="${lips}" stroke-width="2.3" stroke-linecap="round"/>
        <path d="M${centerX - 11} ${centerY + 8}Q${centerX} ${centerY + 11} ${centerX + 12} ${centerY + 7}" fill="none" stroke="${lipLight}" stroke-width="0.9" opacity=".45"/>`;
    case "warm":
      return `
        <path d="M${centerX - 26} ${centerY - 2}Q${centerX} ${centerY + 22} ${centerX + 28} ${centerY - 4}" fill="none" stroke="${lips}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M${centerX - 18} ${centerY + 6}Q${centerX} ${centerY + 17} ${centerX + 20} ${centerY + 4}" fill="none" stroke="${lipLight}" stroke-width="1" stroke-linecap="round" opacity=".55"/>`;
    case "playful":
      return `
        <path d="M${centerX - 26} ${centerY - 1}Q${centerX - 4} ${centerY + 14} ${centerX + 29} ${centerY - 7}" fill="none" stroke="${lips}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M${centerX + 14} ${centerY - 10}Q${centerX + 22} ${centerY - 14} ${centerX + 28} ${centerY - 11}" fill="none" stroke="${lipLight}" stroke-width="1.1" stroke-linecap="round" opacity=".5"/>`;
  }
}

function glassesMarkup(leftX, rightX, eyeY, tone) {
  if (tone !== "margot") return "";
  const frame = "#5b4b38";
  return `
    <g fill="none" stroke="${frame}" stroke-width="2.1" opacity=".9">
      <circle cx="${leftX}" cy="${eyeY}" r="36"/>
      <circle cx="${rightX}" cy="${eyeY}" r="36"/>
      <path d="M${leftX + 36} ${eyeY - 2}Q282 ${eyeY - 11} ${rightX - 36} ${eyeY - 2}"/>
      <path d="M${leftX - 36} ${eyeY}L192 ${eyeY - 7}M${rightX + 36} ${eyeY}L375 ${eyeY - 9}"/>
    </g>
    <g fill="#f5efe1" opacity=".06">
      <circle cx="${leftX}" cy="${eyeY}" r="34"/>
      <circle cx="${rightX}" cy="${eyeY}" r="34"/>
    </g>
    <path d="M${leftX - 17} ${eyeY - 18}Q${leftX - 25} ${eyeY - 5} ${leftX - 24} ${eyeY + 6}" fill="none" stroke="#f8f2e5" stroke-width="2.2" opacity=".25" stroke-linecap="round"/>
    <path d="M${rightX - 17} ${eyeY - 18}Q${rightX - 25} ${eyeY - 5} ${rightX - 24} ${eyeY + 6}" fill="none" stroke="#f8f2e5" stroke-width="2.2" opacity=".22" stroke-linecap="round"/>`;
}

function eliseMarkup(uid, expression) {
  const skin = `url(#${uid}-skin)`;
  const hair = `url(#${uid}-hair)`;
  const sweater = `url(#${uid}-sweater)`;
  const eyeY = 278;
  const leftEyeX = 232;
  const rightEyeX = 327;
  const blush = ["laugh", "smile", "relieved", "soft"].includes(expression) ? 0.22 : 0.09;

  return `
    <!-- fond doux -->
    <ellipse cx="282" cy="380" rx="241" ry="351" fill="url(#${uid}-halo)" opacity=".65"/>
    <!-- cheveux arrière -->
    <path d="M178 333C133 265 143 164 207 107c54-49 142-57 199-14 67 51 70 165 33 246 26 46 11 105-35 130-12-50-21-94-28-151-57 25-123 23-176-4-3 75-11 121-30 157-40-45-45-92-22-139Z" fill="${hair}"/>
    <path d="M159 280c-2-76 35-140 104-171 51-23 111-20 159 9-66-11-131 2-181 38-49 35-69 79-73 137Z" fill="#5e4138" opacity=".23"/>
    <path d="M177 331C135 267 141 167 207 108c26-25 58-39 92-44" fill="none" stroke="#c69d77" stroke-width="2" opacity=".2" stroke-linecap="round"/>
    <!-- corps -->
    <path d="M66 780c9-130 58-217 151-254 26-11 42-27 49-50h83c7 27 25 43 52 55 87 36 132 124 144 249Z" fill="${sweater}"/>
    <path d="M213 523c22 34 50 51 87 51 38 0 66-17 86-51l-19-17c-17 22-39 33-68 33-27 0-50-10-69-33Z" fill="#16252d"/>
    <path d="M105 779c8-104 44-180 112-220" fill="none" stroke="#b89068" stroke-width="2.3" opacity=".16" stroke-linecap="round"/>
    <!-- chemise -->
    <path d="M246 461c-3 46 1 74 19 101 10 16 25 22 38 22 14 0 29-6 38-22 17-27 22-56 19-101-0 31-80 31-114 0Z" fill="#d9cebc"/>
    <path d="M266 472c5 46 12 73 32 92 7 7 18 7 25 0 20-19 28-47 32-92-14 14-29 22-45 22-16 0-30-8-44-22Z" fill="#c7baa7" opacity=".55"/>
    <path d="M236 480c15 40 26 72 9 108M363 478c-13 42-23 75-6 110" fill="none" stroke="#733d33" stroke-width="1.8" opacity=".35"/>
    <!-- cou et ombre -->
    <path d="M247 377h83v92c-25 28-60 32-86 7Z" fill="${skin}"/>
    <path d="M250 385c16 23 50 32 78 13v-18h-78Z" fill="#8e594b" opacity=".3"/>
    <path d="M258 460c13 15 35 20 56 6 9-6 14-14 16-24v-14c-24 17-52 17-72-1Z" fill="#b9806c" opacity=".42"/>
    <!-- oreilles -->
    <path d="M195 268c-31 7-39 30-31 57 8 28 28 43 49 33l20-55Z" fill="${skin}"/>
    <path d="M195 291c-9 3-13 12-10 23 3 12 10 18 17 16" fill="none" stroke="#ae7865" stroke-width="1.4" opacity=".55"/>
    <path d="M356 269c30 7 39 28 32 54-6 26-21 40-41 31l-20-55Z" fill="${skin}"/>
    <!-- visage -->
    <path d="M212 203c12-47 43-72 82-75 44-3 77 21 88 66 10 40 5 93-9 129-16 42-45 67-81 70-37 3-67-23-83-64-14-36-15-88 3-126Z" fill="${skin}"/>
    <path d="M208 225c2-43 31-77 68-87-45 2-78 36-83 85-5 49 7 105 39 136-24-17-38-47-43-79-4-19-3-37 3-55Z" fill="#f6dcc5" opacity=".18"/>
    <path d="M346 190c27 29 31 81 21 120-9 37-28 64-52 77 34-8 59-37 67-79 7-38 0-87-22-114Z" fill="#9e6454" opacity=".16"/>
    <!-- cheveux avant -->
    <path d="M199 228c-2-68 35-113 93-122 57-9 99 28 103 90-4-24-17-40-41-50-32-13-66-7-94 3-31 11-47 36-51 69Z" fill="#392724"/>
    <path d="M207 205c23-47 67-74 111-73 39 0 69 21 84 58-26-27-58-39-94-36-33 3-57 17-78 43-8 10-15 22-19 36Z" fill="${hair}"/>
    <path d="M322 112c34 12 52 35 58 69 3 21-2 43-14 61 2-35-5-59-22-77-18-18-44-26-75-24 18-17 35-26 53-29Z" fill="#6e4b3e" opacity=".45"/>
    <path d="M198 225c8-28 24-49 48-64 1 29-8 55-27 78Z" fill="#2d211f" opacity=".65"/>
    <path d="M383 206c10 35 9 72-2 103 9 42 4 77-16 98-7-33-7-67 1-102-14-37-12-77 3-112Z" fill="#2b201f"/>
    <path d="M173 285c-8 44 1 85 24 110 9-39 3-76-13-120Z" fill="#332422"/>
    <path d="M391 276c8 44 0 86-22 111-7-38-2-75 13-118Z" fill="#3d2a25"/>
    <path d="M186 347c9 29 24 49 44 62l-8 30c-22-18-34-49-36-92Z" fill="#463029" opacity=".7"/>
    <path d="M375 345c-8 30-23 51-42 64l8 29c21-18 32-48 34-93Z" fill="#4a332a" opacity=".65"/>
    <!-- petits cheveux sur le front -->
    <path d="M243 158c11-24 34-36 61-36M355 169c13 11 21 25 24 42M222 183c-8 13-12 27-12 42" fill="none" stroke="#21201d" stroke-width="1.2" opacity=".45" stroke-linecap="round"/>
    <!-- sourcils -->
    <g>
      ${browMarkup(leftEyeX, 238, "left", expression, "elise")}
      ${browMarkup(rightEyeX, 238, "right", expression, "elise")}
      <path d="M213 224c8-5 17-7 27-5" fill="none" stroke="#6f4038" stroke-width="1.1" opacity=".45" stroke-linecap="round"/>
    </g>
    <!-- yeux -->
    ${eyeMarkup(leftEyeX, eyeY, expression, "elise")}
    ${eyeMarkup(rightEyeX, eyeY, expression, "elise")}
    <!-- nez -->
    <path d="M280 288c-2 16-5 27-9 36 6 5 15 7 23 3" fill="none" stroke="#a56d5d" stroke-width="1.5" stroke-linecap="round" opacity=".65"/>
    <ellipse cx="282" cy="324" rx="5" ry="2.6" fill="#bd8776" opacity=".22"/>
    <!-- joues -->
    <ellipse cx="216" cy="321" rx="29" ry="16" fill="#ca7c70" opacity="${blush}" filter="url(#${uid}-blur)"/>
    <ellipse cx="348" cy="319" rx="27" ry="15" fill="#ca7c70" opacity="${blush}" filter="url(#${uid}-blur)"/>
    <!-- taches de rousseur -->
    <g fill="#855f51" opacity=".28">
      <circle cx="238" cy="317" r="1.1"/><circle cx="248" cy="322" r="1"/><circle cx="256" cy="315" r="0.9"/>
      <circle cx="318" cy="319" r="1"/><circle cx="327" cy="313" r="0.9"/><circle cx="335" cy="320" r="1.1"/>
    </g>
    <!-- bouche -->
    ${mouthMarkup(281, 357, expression, "elise")}
    <path d="M254 388c16 8 36 9 54 1" fill="none" stroke="#a16b5b" stroke-width="1.1" opacity=".23" stroke-linecap="round"/>
    <!-- cicatrice discrète -->
    <path d="M221 209l11-6" fill="none" stroke="#966354" stroke-width="1" opacity=".35" stroke-linecap="round"/>
    <!-- boucle d'oreille -->
    <g transform="translate(191 308) rotate(-12)" fill="none" stroke="#d8c7ab" stroke-width="2.2">
      <path d="M-7 -13C3 -20 14 -14 15 -4 16 6 8 12 0 9 7 5 9 -2 5 -7 1 -12 -4 -10 -6 -5"/>
    </g>
    <!-- col roulé -->
    <path d="M238 432c8 39 24 57 43 57 20 0 37-18 45-57l-18-11c-7 25-16 37-27 37-12 0-21-12-27-37Z" fill="#e5dac8"/>
    <path d="M245 438c8 30 21 44 36 44 16 0 29-14 37-44l-8-5c-7 23-17 35-29 35-11 0-21-12-28-35Z" fill="#c9bba5" opacity=".45"/>
    <path d="M251 438c7 20 17 30 30 30 13 0 23-10 30-30" fill="none" stroke="#f6eee2" stroke-width="1.4" opacity=".6"/>
    <g stroke="#b1a18a" stroke-width="1" opacity=".3">
      <path d="M254 452v28M263 460v25M272 465v24M281 467v24M290 465v24M299 459v25M308 451v28"/>
    </g>
    <path d="M249 426c13 14 48 14 63 0" fill="none" stroke="#9b6657" stroke-width="2" opacity=".22"/>
    <!-- collier -->
    <path d="M251 485c17 25 52 27 69 1" fill="none" stroke="#c8a36d" stroke-width="1.3" opacity=".78"/>
    <circle cx="286" cy="502" r="2.4" fill="#d4b47e" opacity=".8"/>
    <!-- maille du gilet -->
    <g fill="none" stroke="#8ba0a4" opacity=".16" stroke-width="1">
      <path d="M103 646c43-19 82-27 116-24M91 690c47-21 91-29 132-25M85 734c50-23 98-31 143-27M432 644c-35-17-68-25-99-24M447 692c-43-20-80-28-116-25M460 741c-44-22-85-29-124-26"/>
      <path d="M134 602c8 53 10 111 5 174M428 599c-6 53-8 111-3 177"/>
    </g>
    <path d="M207 529c21 29 46 43 75 44M361 529c-20 30-44 44-74 44" fill="none" stroke="#0e1b22" stroke-width="8" opacity=".52"/>
    <path d="M250 533c24 23 49 23 71 0" fill="none" stroke="#e1d3bc" stroke-width="1.2" opacity=".5"/>
  `;
}

function margotMarkup(uid, expression) {
  const skin = `url(#${uid}-skin)`;
  const hair = `url(#${uid}-hair)`;
  const coat = `url(#${uid}-coat)`;
  const eyeY = 285;
  const leftEyeX = 226;
  const rightEyeX = 340;
  return `
    <ellipse cx="284" cy="390" rx="248" ry="348" fill="url(#${uid}-halo)" opacity=".6"/>
    <path d="M200 239C190 160 233 104 302 85c22-6 46-7 70-2" fill="none" stroke="#d6b184" stroke-width="2.2" opacity=".16" stroke-linecap="round"/>
    <!-- chignon -->
    <ellipse cx="400" cy="151" rx="69" ry="79" fill="${hair}"/>
    <path d="M358 107c-9-45 30-82 74-76 42 6 64 40 49 76-10 25-33 40-59 40-30 0-53-17-64-40Z" fill="${hair}"/>
    <path d="M371 83c13-26 38-42 71-39-28 10-47 25-59 47Z" fill="#d5d0c1" opacity=".33"/>
    <!-- corps / manteau -->
    <path d="M47 780c12-126 65-206 158-244 30-12 48-30 56-54h90c7 29 29 48 61 60 83 36 124 114 136 238Z" fill="${coat}"/>
    <path d="M183 544c29 31 57 46 96 46 40 0 70-16 98-47" fill="none" stroke="#323d2e" stroke-width="20" opacity=".55"/>
    <path d="M92 779c10-105 50-179 123-217" fill="none" stroke="#9b946f" stroke-width="2.3" opacity=".14" stroke-linecap="round"/>
    <!-- écharpe -->
    <path d="M203 491c23 38 51 58 87 58 38 0 67-20 88-58l-23-14c-20 25-41 37-67 37-25 0-47-12-65-37Z" fill="#8d5d45"/>
    <path d="M234 526c4 43 12 92 25 136l64 5c19-51 27-100 27-146-29 20-82 23-116 5Z" fill="#76503d"/>
    <g stroke="#bd8b6f" stroke-width="1.1" opacity=".24" fill="none">
      <path d="M231 554c42 13 81 12 118-1M239 584c37 14 75 13 112 0M248 614c31 12 62 11 94 0"/>
    </g>
    <!-- chemise -->
    <path d="M252 466h84v100h-84Z" fill="#d8cdb9"/>
    <path d="M260 469c8 40 16 62 34 78 20-16 29-39 34-78Z" fill="#bdb09c" opacity=".5"/>
    <!-- cou -->
    <path d="M247 377h85v96c-27 27-59 28-86 5Z" fill="${skin}"/>
    <path d="M251 392c18 26 50 32 77 14v-20h-77Z" fill="#8a584b" opacity=".27"/>
    <!-- oreilles -->
    <path d="M193 277c-31 6-39 27-32 54 7 26 25 40 45 32l20-52Z" fill="${skin}"/>
    <path d="M186 302c-11 10-12 27-2 41" fill="none" stroke="#a16e5f" stroke-width="1.4" opacity=".5"/>
    <path d="M369 277c30 6 39 26 33 52-6 25-23 39-42 32l-22-52Z" fill="${skin}"/>
    <!-- visage rond -->
    <path d="M203 217c15-53 48-80 88-80 45 0 78 28 89 80 10 48 2 97-19 128-18 27-42 42-72 43-32 1-58-14-76-43-20-33-23-83-10-128Z" fill="${skin}"/>
    <path d="M197 259c0-51 32-92 73-103-43 7-76 45-79 96-3 52 8 93 33 118-21-17-31-45-32-73-1-12 0-25 5-38Z" fill="#f2dac5" opacity=".2"/>
    <!-- cheveux front -->
    <path d="M202 246c-9-72 30-118 93-124 58-6 98 30 101 94-9-28-27-46-55-55-39-13-81-2-108 23-12 12-22 32-31 62Z" fill="${hair}"/>
    <path d="M205 236c15-43 46-69 87-78 40-8 78 5 100 37-31-24-67-31-102-21-33 9-57 30-72 60Z" fill="#8f8b7d" opacity=".38"/>
    <path d="M211 219c21-36 51-57 89-62M373 196c17 17 27 38 29 64" fill="none" stroke="#d7d2c3" stroke-width="1.3" opacity=".3" stroke-linecap="round"/>
    <path d="M191 278c-11 35-7 70 10 91 1-34 2-63 3-100Z" fill="#a5a093"/>
    <path d="M373 274c9 36 6 69-9 91-1-33-2-63-4-99Z" fill="#9e998c"/>
    <!-- sourcils -->
    <g>
      ${browMarkup(leftEyeX, 246, "left", expression === "playful" ? "surprised" : expression, "margot")}
      ${browMarkup(rightEyeX, 243, "right", expression, "margot")}
    </g>
    <!-- yeux -->
    ${eyeMarkup(leftEyeX, eyeY, expression, "margot")}
    ${eyeMarkup(rightEyeX, eyeY, expression, "margot")}
    <!-- lunettes -->
    ${glassesMarkup(leftEyeX, rightEyeX, eyeY, "margot")}
    <!-- nez -->
    <path d="M282 297c-2 15-5 26-9 34 7 6 16 6 23 2" fill="none" stroke="#986456" stroke-width="1.5" stroke-linecap="round" opacity=".62"/>
    <!-- joues / rides -->
    <ellipse cx="209" cy="328" rx="31" ry="18" fill="#bd7568" opacity=".16" filter="url(#${uid}-blur)"/>
    <ellipse cx="359" cy="327" rx="29" ry="17" fill="#bd7568" opacity=".15" filter="url(#${uid}-blur)"/>
    <g fill="none" stroke="#a67464" stroke-width="1.1" opacity=".35" stroke-linecap="round">
      <path d="M188 288c-7 4-12 10-14 17M190 304c-5 3-8 7-10 12M191 266c-8 1-14 5-18 10"/>
      <path d="M375 289c7 4 12 10 14 17M374 305c5 3 8 7 10 12"/>
      <path d="M247 344c9 12 19 18 34 20M319 344c-8 12-18 18-33 20"/>
      <path d="M261 203c12-5 26-6 39-1M321 202c12-4 24-3 34 2" opacity=".5"/>
    </g>
    <!-- bouche -->
    ${mouthMarkup(283, 363, expression, "margot")}
    <path d="M248 396c18 8 43 9 67 1" fill="none" stroke="#a06d5d" stroke-width="1.1" opacity=".25" stroke-linecap="round"/>
    <!-- boucles d'oreilles -->
    <g fill="none" stroke="#c6a45e" stroke-width="2">
      <circle cx="186" cy="318" r="12"/>
      <circle cx="378" cy="317" r="11"/>
    </g>
    <!-- écharpe remontée -->
    <path d="M229 437c13 39 34 58 54 58 22 0 43-19 55-58l-21-11c-7 25-18 38-33 38-14 0-26-13-34-38Z" fill="#855b44"/>
    <path d="M237 444c12 27 27 40 45 40 18 0 34-13 44-40l-9-5c-9 22-21 34-35 34-13 0-25-12-33-34Z" fill="#6f4b38" opacity=".55"/>
    <path d="M242 443c11 20 26 31 43 31 16 0 30-10 40-30" fill="none" stroke="#b98b6e" stroke-width="1.2" opacity=".32"/>
    <g stroke="#c19779" stroke-width="1" opacity=".22" fill="none">
      <path d="M248 452v33M260 463v28M273 469v24M286 471v24M299 469v24M312 462v28M321 450v32"/>
    </g>
    <path d="M246 426c15 15 51 15 66 0" fill="none" stroke="#8f5c4b" stroke-width="2" opacity=".26"/>
    <!-- détails manteau -->
    <path d="M217 525c25 38 48 55 69 55M358 522c-18 36-41 54-69 57" fill="none" stroke="#4f5c48" stroke-width="8" opacity=".45"/>
    <g fill="none" stroke="#c1bca9" opacity=".13" stroke-width="1">
      <path d="M89 652c33-21 72-34 110-39M78 703c43-22 88-35 133-38M72 754c49-23 98-36 147-39M447 647c-38-20-76-30-111-34M457 696c-44-20-87-31-130-34M466 748c-50-22-101-32-151-35"/>
    </g>
    <path d="M249 464c3 3 7 3 10 0M326 464c3 3 7 3 10 0" stroke="#8a7c67" stroke-width="1.1" opacity=".5"/>
    <circle cx="281" cy="477" r="2.2" fill="#8c775b" opacity=".65"/>
    <!-- broche -->
    <g transform="translate(349 535)">
      <path d="M0 9c7-11 18-9 20 0 2-9 14-11 19 0 5 12-11 23-19 28C12 32-5 21 0 9Z" fill="#a87a4e" opacity=".6"/>
    </g>
  `;
}

function baseSvg(uid, inner, who, expression) {
  const isMargot = who === "margot";
  return `
    <svg class="portrait-svg" viewBox="0 0 564 780" preserveAspectRatio="xMidYMax slice" aria-hidden="true" data-expression="${expression}" data-character="${who}">
      <defs>
        <linearGradient id="${uid}-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${isMargot ? "#e2b79f" : "#efcbb3"}"/>
          <stop offset=".52" stop-color="${isMargot ? "#d3a68e" : "#e3b8a0"}"/>
          <stop offset="1" stop-color="${isMargot ? "#b98270" : "#c9917b"}"/>
        </linearGradient>
        <linearGradient id="${uid}-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${isMargot ? "#b9b4a3" : "#3b2a26"}"/>
          <stop offset=".52" stop-color="${isMargot ? "#9d9888" : "#291f1e"}"/>
          <stop offset="1" stop-color="${isMargot ? "#7a776b" : "#171617"}"/>
        </linearGradient>
        <linearGradient id="${uid}-sweater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#30424c"/>
          <stop offset=".48" stop-color="#1d2d36"/>
          <stop offset="1" stop-color="#0f1b23"/>
        </linearGradient>
        <linearGradient id="${uid}-coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#505943"/>
          <stop offset=".5" stop-color="#3a4232"/>
          <stop offset="1" stop-color="#232b22"/>
        </linearGradient>
        <radialGradient id="${uid}-halo" cx=".5" cy=".42" r=".5">
          <stop offset="0" stop-color="#e0c28d" stop-opacity=".12"/>
          <stop offset=".6" stop-color="#b98d5b" stop-opacity=".035"/>
          <stop offset="1" stop-color="#b98d5b" stop-opacity="0"/>
        </radialGradient>
        <filter id="${uid}-blur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9"/>
        </filter>
      </defs>
      <g class="portrait-figure">
        ${inner}
      </g>
    </svg>`;
}

export function portraitSVG(who = "elise", expression = "neutral") {
  const uid = `portrait-${++portraitSerial}`;
  const character = who === "margot" ? "margot" : "elise";
  const allowed = character === "margot"
    ? ["neutral", "warm", "playful", "worried", "sad", "soft", "surprised"]
    : ["neutral", "soft", "smile", "laugh", "sad", "distant", "worried", "angry", "tired", "surprised", "afraid", "determined", "relieved"];
  const safeExpression = allowed.includes(expression)
    ? expression
    : character === "margot" ? "warm" : "neutral";
  const inner = character === "margot" ? margotMarkup(uid, safeExpression) : eliseMarkup(uid, safeExpression);
  return baseSvg(uid, inner, character, safeExpression);
}

export function portraitHTML(who, expression, extraClass = "") {
  return `<div class="portrait-shell ${extraClass}" data-character="${who}" data-expression="${expression}">${portraitSVG(who, expression)}</div>`;
}
