export type OpeningHours = { days: string; hours: string };

export type OperatingStatusOverride = {
  mode?: "automatic" | "closed";
  closedReason?: string;
  closedUntil?: string;
};

export type HeroOpeningStatus = {
  state: "open" | "closed";
  message: string;
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

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

type LocalTime = { date: string; day: number; minutes: number };
type OpeningSlot = { days: number[]; opens: number; closes: number; opensAt: string; closesAt: string };

function getPragueTime(now: Date): LocalTime {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";

  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    day: WEEKDAY_INDEX[value("weekday")],
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

function parseDays(value: string): number[] {
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

export function getOpeningStatus(
  hours: OpeningHours[],
  override: OperatingStatusOverride | undefined,
  now = new Date(),
): HeroOpeningStatus {
  const local = getPragueTime(now);
  const isManualClosure = override?.mode === "closed" && (!override.closedUntil || override.closedUntil >= local.date);
  if (isManualClosure) {
    const reason = override?.closedReason?.trim();
    return { state: "closed", message: reason ? `Dnes zavřeno — ${reason}` : "Dnes zavřeno" };
  }

  const slots = parseSlots(hours);
  const todaySlots = slots.filter((slot) => slot.days.includes(local.day));
  const previousDay = (local.day + 6) % 7;

  for (const slot of slots) {
    const crossesMidnight = slot.closes <= slot.opens;
    const openFromPreviousDay = crossesMidnight && slot.days.includes(previousDay) && local.minutes < slot.closes;
    const openToday = slot.days.includes(local.day) && local.minutes >= slot.opens && (crossesMidnight || local.minutes < slot.closes);
    if (openFromPreviousDay || openToday) return { state: "open", message: `Dnes otevřeno do ${slot.closesAt}` };
  }

  const nextSlot = todaySlots.find((slot) => local.minutes < slot.opens);
  if (nextSlot) return { state: "open", message: `Dnes otevřeno od ${nextSlot.opensAt}` };
  return { state: "closed", message: "Nyní zavřeno" };
}
