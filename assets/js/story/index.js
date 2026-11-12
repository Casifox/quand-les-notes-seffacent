import { prologue } from "./prologue.js";
import { day1 } from "./day1.js";
import { day2 } from "./day2.js";
import { day3 } from "./day3.js";
import { day4 } from "./day4.js";
import { day5 } from "./day5.js";
import { day6 } from "./day6.js";
import { day7 } from "./day7.js";
import { epilogueHeld, epilogueSilence } from "./epilogues.js";

export const CHAPTERS = [prologue, day1, day2, day3, day4, day5, day6, day7];
export const EPILOGUES = [epilogueHeld, epilogueSilence];

export const CHAPTER_MAP = new Map(
  [...CHAPTERS, ...EPILOGUES].map((chapter) => [chapter.id, chapter])
);

export const ENDING_CHAPTER = {
  held: epilogueHeld.id,
  silence: epilogueSilence.id
};

export function getChapter(chapterId) {
  return CHAPTER_MAP.get(chapterId) ?? null;
}

export function getNextChapterId(chapterId) {
  const index = CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
  if (index < 0 || index >= CHAPTERS.length - 1) return null;
  return CHAPTERS[index + 1].id;
}

export function getChapterNumber(chapterId) {
  const chapter = getChapter(chapterId);
  return chapter?.number ?? 0;
}

export function resolveLines(page, state) {
  if (!page?.lines) return [];
  return page.lines.filter((line) => {
    if (typeof line.if !== "function") return true;
    try {
      return Boolean(line.if(state));
    } catch {
      return false;
    }
  });
}

export const STORY = {
  chapters: CHAPTERS,
  epilogues: EPILOGUES,
  map: CHAPTER_MAP
};
