// Shared by the build (site-content.ts, index.astro) and the browser (site.ts), so both render the same lunch menu.

export type LunchDayInput = {
  soupName?: string;
  soupAllergens?: string;
  dishAName?: string;
  dishAAllergens?: string;
  dishBName?: string;
  dishBAllergens?: string;
};
export type WeekdayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
export type LunchPrices = { soupPrice?: number; dishAPrice?: number; dishBPrice?: number };
/** The single lunch menu the owner rewrites every weekend. */
export type LunchMenu = Partial<Record<WeekdayKey, LunchDayInput>> & LunchPrices & { updatedAt?: string };
export type LunchData = { menu?: LunchMenu };

export type LunchDish = { type: string; name: string; allergens?: string; price?: string };
export type LunchDayView = { key: WeekdayKey; label: string; shortLabel: string; dateLabel: string; dishes: LunchDish[]; isToday: boolean };
export type LunchView = {
  message?: string;
  /** Point to the regular menu, used when there is no lunch to serve right now. */
  linkMenu: boolean;
  /** No menu for this week yet: offer the phone instead. */
  showPhone: boolean;
  days: LunchDayView[];
  activeIndex: number;
};

const dayFields = "soupName,soupAllergens,dishAName,dishAAllergens,dishBName,dishBAllergens";
export const lunchQuery = `*[_type == "lunchMenu" && _id == "lunchMenu"][0]{"updatedAt":_updatedAt,soupPrice,dishAPrice,dishBPrice,monday{${dayFields}},tuesday{${dayFields}},wednesday{${dayFields}},thursday{${dayFields}},friday{${dayFields}}}`;

export const weekdays = [
  { key: "monday", label: "Pondělí", shortLabel: "Po" },
  { key: "tuesday", label: "Úterý", shortLabel: "Út" },
  { key: "wednesday", label: "Středa", shortLabel: "St" },
  { key: "thursday", label: "Čtvrtek", shortLabel: "Čt" },
  { key: "friday", label: "Pátek", shortLabel: "Pá" },
] as const;

const LUNCH_ENDS = 14 * 60;

// Dates are plain YYYY-MM-DD strings; noon UTC keeps the weekday stable in any timezone.
const toDate = (value: string) => new Date(`${value}T12:00:00Z`);
export const addDays = (value: string, days: number) => {
  const date = toDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
export const mondayOf = (value: string) => addDays(value, -((toDate(value).getUTCDay() + 6) % 7));
const shortDate = (value: string) => `${Number(value.slice(8, 10))}. ${Number(value.slice(5, 7))}.`;

export function pragueNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  const date = `${value("year")}-${value("month")}-${value("day")}`;
  return { date, day: toDate(date).getUTCDay(), minutes: Number(value("hour")) * 60 + Number(value("minute")) };
}

const clean = (value?: string) => value?.trim() || "";
// Lunch A and B cost 159 and 169 Kč unless the owner sets another price in Sanity.
const price = (value?: number) => typeof value === "number" ? `${value} Kč` : undefined;

function dishesFor(day: LunchDayInput | undefined, prices: LunchPrices): LunchDish[] {
  const dishes: LunchDish[] = [
    { type: "Polévka", name: clean(day?.soupName), allergens: clean(day?.soupAllergens), price: price(prices.soupPrice) },
    { type: "Jídlo A", name: clean(day?.dishAName), allergens: clean(day?.dishAAllergens), price: price(prices.dishAPrice ?? 159) },
    { type: "Jídlo B", name: clean(day?.dishBName), allergens: clean(day?.dishBAllergens), price: price(prices.dishBPrice ?? 169) },
  ];
  return dishes.filter((dish) => dish.name);
}

export function getLunchView(data: LunchData, now = new Date()): LunchView {
  const local = pragueNow(now);
  const weekend = local.day === 0 || local.day === 6;
  const thisMonday = mondayOf(local.date);
  const weekStart = weekend ? addDays(thisMonday, 7) : thisMonday;
  // The owner rewrites the menu over the weekend. An edit since Friday counts as the menu for the coming week,
  // so on weekdays a menu last touched before the previous Friday is last week's and is not shown as current.
  const freshFrom = weekend ? addDays(thisMonday, 4) : addDays(thisMonday, -3);
  const menu = data.menu;
  const fresh = !menu?.updatedAt || pragueNow(new Date(menu.updatedAt)).date >= freshFrom;
  const week = fresh ? menu : undefined;
  const days = weekdays.map((weekday, index): LunchDayView => {
    const date = addDays(weekStart, index);
    return {
      key: weekday.key,
      label: weekday.label,
      shortLabel: weekday.shortLabel,
      dateLabel: shortDate(date),
      dishes: week ? dishesFor(week[weekday.key], week) : [],
      isToday: date === local.date,
    };
  });
  const hasMenu = days.some((day) => day.dishes.length);

  if (!hasMenu) {
    return {
      message: weekend
        ? "O víkendu obědy nevaříme. Menu na příští týden ještě připravujeme."
        : "Menu na tento týden ještě připravujeme. Zavolejte nám, rádi řekneme, co se dnes vaří.",
      linkMenu: weekend,
      showPhone: !weekend,
      days: [],
      activeIndex: 0,
    };
  }

  const todayIndex = days.findIndex((day) => day.isToday);
  let message: string | undefined;
  let linkMenu = false;
  if (weekend) {
    message = "O víkendu obědy nevaříme. Tady je menu na příští týden.";
    linkMenu = true;
  } else if (!days[todayIndex]?.dishes.length) {
    message = "Dnes obědové menu nevaříme.";
    linkMenu = true;
  } else if (local.minutes >= LUNCH_ENDS) {
    message = "Dnešní obědy už jsme vydali. Další zítra od 11:00.";
    linkMenu = true;
  }
  return { message, linkMenu, showPhone: false, days, activeIndex: Math.max(todayIndex, 0) };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** Markup for the message, day tabs and panels. Used for the static HTML and for re-rendering in the browser. */
export function renderLunch(view: LunchView, phone: { label: string; href: string }): string {
  const links = [
    view.showPhone ? `<a href="tel:${escape(phone.href)}">${escape(phone.label)}</a>` : "",
    view.linkMenu ? `<a href="/listky">Jídelní lístek</a>` : "",
  ].filter(Boolean).join(" ");
  const message = view.message ? `<p class="lunch-message">${escape(view.message)}${links ? ` ${links}` : ""}</p>` : "";
  if (!view.days.length) return message;

  const tabs = view.days.map((day, index) => {
    const selected = index === view.activeIndex;
    return `<button type="button" role="tab" id="tab-${index}" aria-controls="panel-${index}" aria-selected="${selected}" tabindex="${selected ? 0 : -1}" data-tab="${index}"${day.isToday ? ' class="is-today" aria-current="date"' : ""}>`
      + `<span class="day-short">${day.shortLabel}</span><span class="day-name">${day.label}</span><span class="day-date">${day.isToday ? "Dnes" : day.dateLabel}</span></button>`;
  }).join("");
  const panels = view.days.map((day, index) => {
    const dishes = day.dishes.length
      ? `<div class="dish-list">${day.dishes.map((dish) => `<article class="dish"><span class="dish-type">${dish.type}</span><div><h3>${escape(dish.name)}</h3>${dish.allergens ? `<p class="allergens">Alergeny: ${escape(dish.allergens)}</p>` : ""}</div>${dish.price ? `<strong>${dish.price}</strong>` : "<span></span>"}</article>`).join("")}</div>`
      : `<p class="dish-empty">Tento den obědy nevaříme.</p>`;
    return `<div class="lunch-panel" role="tabpanel" id="panel-${index}" aria-labelledby="tab-${index}"${index === view.activeIndex ? "" : " hidden"}>${dishes}</div>`;
  }).join("");
  return `${message}<div class="lunch-widget"><div class="day-tabs" role="tablist" aria-label="Dny obědového menu">${tabs}</div><div class="lunch-panels">${panels}</div></div>`;
}
