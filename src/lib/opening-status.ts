export type OpeningHours = { days: string; hours: string };

/** Sanity "Stav provozu": "automatic" is shown in the Studio as "Žádné" (no announcement). */
export type OperatingStatusOverride = {
  mode?: "automatic" | "notice" | (string & {});
  noticeText?: string;
};

const DAY_INDEX: Record<string, number> = {
  Po: 1,
  Út: 2,
  St: 3,
  Čt: 4,
  Pá: 5,
  So: 6,
  Ne: 0,
};

type OpeningSlot = { days: number[]; opens: number; closes: number; opensAt: string; closesAt: string };

export function parseDays(value: string): number[] {
  const tokens = value.match(/Po|Út|St|Čt|Pá|So|Ne/g) || [];
  if (tokens.length === 2 && /[-–—]/.test(value)) {
    const result: number[] = [];
    let day = DAY_INDEX[tokens[0]];
    const end = DAY_INDEX[tokens[1]];
    while (day !== end) {
      result.push(day);
      day = (day + 1) % 7;
    }
    result.push(end);
    return result;
  }
  return [...new Set(tokens.map((token) => DAY_INDEX[token]))];
}

function parseTime(value: string): { minutes: number; display: string } | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return { minutes: hours * 60 + minutes, display: `${String(hours).padStart(2, "0")}:${match[2]}` };
}

function parseSlots(hours: OpeningHours[]): OpeningSlot[] {
  return hours.flatMap((row) => {
    const times = row.hours.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/);
    const opens = times && parseTime(times[1]);
    const closes = times && parseTime(times[2]);
    const days = parseDays(row.days);
    if (!opens || !closes || !days.length) return [];
    return [{ days, opens: opens.minutes, closes: closes.minutes, opensAt: opens.display, closesAt: closes.display }];
  });
}

/** The announcement text from Sanity, or null when there is nothing to announce. */
export function getStatusBanner(override: OperatingStatusOverride | undefined): { tone: "notice"; text: string } | null {
  const notice = override?.mode === "notice" ? override.noticeText?.trim() : undefined;
  return notice ? { tone: "notice", text: notice } : null;
}

/**
 * The hero card: only shown for an announcement, never for the normal opening hours.
 * The first sentence becomes the bold title and the rest the line under it; "12. 10." style dates are not split.
 */
export function getHeroNotice(override: OperatingStatusOverride | undefined): { tone: "notice"; title: string; text?: string } | null {
  const banner = getStatusBanner(override);
  if (!banner) return null;
  const match = banner.text.match(/^(.+?[.!?])\s+(?=\p{Lu})(.+)$/su);
  return match ? { tone: banner.tone, title: match[1], text: match[2] } : { tone: banner.tone, title: banner.text };
}

/** Opening and closing minute for a date (YYYY-MM-DD); closing after midnight counts past 24:00. */
export function getOpeningWindow(hours: OpeningHours[], date: string): { opens: number; closes: number } | null {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  const slot = parseSlots(hours).find((candidate) => candidate.days.includes(day));
  if (!slot) return null;
  return { opens: slot.opens, closes: slot.closes <= slot.opens ? slot.closes + 24 * 60 : slot.closes };
}
