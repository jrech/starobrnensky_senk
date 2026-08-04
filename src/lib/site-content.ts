import { createClient } from "@sanity/client";
import type { OpeningHours, OperatingStatusOverride } from "./opening-status";
import { drinkMenu as fallbackDrinkMenu, foodMenu as fallbackFoodMenu, type MenuCategory } from "./menu-content";

export type Dish = { name: string; detail?: string; price: string; allergens?: string };
export type LunchDay = { date: string; label: string; shortLabel: string; dishes: Dish[] };
type SanityLunchDay = {
  soupName?: string;
  soupAllergens?: string;
  dishAName?: string;
  dishAAllergens?: string;
  dishBName?: string;
  dishBAllergens?: string;
};
type SanityLunchMenu = Partial<Record<"monday" | "tuesday" | "wednesday" | "thursday" | "friday", SanityLunchDay>>;
export type Rum = { name: string; origin: string; note: string; abv: string; image?: string };
export type Specialty = { name: string; note: string; price?: string; image?: string };
export type SiteContent = {
  notice?: string;
  lunchUpdated: string;
  lunchDays: LunchDay[];
  rums: Rum[];
  specialties: Specialty[];
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  mapUrl: string;
  hours: OpeningHours[];
  operatingStatus?: OperatingStatusOverride;
  foodMenu: MenuCategory[];
  drinkMenu: MenuCategory[];
};

const fallback: SiteContent = {
  notice: "Ukázkový obsah — aktuální nabídku doplní obsluha v Sanity CMS.",
  lunchUpdated: "Ukázkové menu · 3.–7. srpna 2026",
  lunchDays: [
    {
      date: "2026-08-03",
      label: "Pondělí 3. 8.",
      shortLabel: "Po",
      dishes: [
        { name: "Česneková polévka se sýrem a krutony", price: "49 Kč", allergens: "1, 7" },
        { name: "Vepřový vrabec, špenát, bramborový knedlík", price: "159 Kč", allergens: "1, 3, 7" },
        { name: "Kuřecí steak, pepřová omáčka, hranolky", price: "169 Kč", allergens: "1, 7" },
      ],
    },
    {
      date: "2026-08-04",
      label: "Úterý 4. 8.",
      shortLabel: "Út",
      dishes: [
        { name: "Hovězí vývar s nudlemi", price: "49 Kč", allergens: "1, 3, 9" },
        { name: "Smažený kuřecí řízek, bramborová kaše", price: "159 Kč", allergens: "1, 3, 7" },
        { name: "Fazolový guláš s klobásou a chlebem", price: "149 Kč", allergens: "1" },
      ],
    },
    {
      date: "2026-08-05",
      label: "Středa 5. 8.",
      shortLabel: "St",
      dishes: [
        { name: "Bramboračka s houbami", price: "49 Kč", allergens: "1, 9" },
        { name: "Hovězí na česneku, rýže", price: "169 Kč", allergens: "1" },
        { name: "Smažený sýr, hranolky, tatarská omáčka", price: "159 Kč", allergens: "1, 3, 7" },
      ],
    },
    {
      date: "2026-08-06",
      label: "Čtvrtek 6. 8.",
      shortLabel: "Čt",
      dishes: [
        { name: "Kulajda s vejcem", price: "49 Kč", allergens: "1, 3, 7" },
        { name: "Segedínský guláš, houskový knedlík", price: "159 Kč", allergens: "1, 3, 7" },
        { name: "Grilovaný hermelín, salát a toast", price: "159 Kč", allergens: "1, 7" },
      ],
    },
    {
      date: "2026-08-07",
      label: "Pátek 7. 8.",
      shortLabel: "Pá",
      dishes: [
        { name: "Gulášová polévka", price: "49 Kč", allergens: "1" },
        { name: "Moravský závitek, dušená rýže", price: "169 Kč", allergens: "1, 3, 10" },
        { name: "Bramborové noky s kuřecím masem a špenátem", price: "159 Kč", allergens: "1, 3, 7" },
      ],
    },
  ],
  rums: [
    { name: "Diplomático Reserva", origin: "Venezuela", note: "Kulatý, medový a jemně kořenitý.", abv: "40 %" },
    { name: "Abuelo 7 Años", origin: "Panama", note: "Sušší rum s tóny dubu a vanilky.", abv: "40 %" },
    { name: "Plantation XO", origin: "Barbados", note: "Kokos, kakao a dlouhý sametový závěr.", abv: "40 %" },
    { name: "Ron Zacapa 23", origin: "Guatemala", note: "Bohatý styl s karamelem a sušeným ovocem.", abv: "40 %" },
  ],
  specialties: [
    { name: "Pečené vepřové koleno", note: "Hořčice, křen, nakládaná zelenina a chléb.", price: "249 Kč / kg" },
    { name: "Šenkovní burger", note: "Hovězí maso, slanina, čedar a naše omáčka.", price: "199 Kč" },
    { name: "BBQ žebra", note: "Pomalu pečená, s chlebem a salátkem coleslaw.", price: "229 Kč" },
  ],
  phone: "+420 776 791 144",
  phoneHref: "+420776791144",
  email: "info@starobrnenskysenk.cz",
  address: "Plachty 512/2, 634 00 Brno–Nový Lískovec",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Starobrnensky+Senk+Plachty+512%2F2+Brno",
  hours: [
    { days: "Po–Čt", hours: "11:00–23:00" },
    { days: "Pá", hours: "11:00–00:00" },
    { days: "So", hours: "12:00–00:00" },
    { days: "Ne", hours: "12:00–22:00" },
  ],
  operatingStatus: { mode: "automatic" },
  foodMenu: fallbackFoodMenu,
  drinkMenu: fallbackDrinkMenu,
};

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

const lunchWeekdays = [
  { key: "monday", label: "Pondělí", shortLabel: "Po" },
  { key: "tuesday", label: "Úterý", shortLabel: "Út" },
  { key: "wednesday", label: "Středa", shortLabel: "St" },
  { key: "thursday", label: "Čtvrtek", shortLabel: "Čt" },
  { key: "friday", label: "Pátek", shortLabel: "Pá" },
] as const;

function getCurrentWeekDates(now = new Date()): string[] {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  const weekday = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }[value("weekday") as "Mon"] ?? 1;
  const monday = new Date(Date.UTC(Number(value("year")), Number(value("month")) - 1, Number(value("day")) - ((weekday + 6) % 7), 12));
  return lunchWeekdays.map((_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

function formatLunchWeek(dates: string[]): string {
  const first = new Date(`${dates[0]}T12:00:00Z`);
  const last = new Date(`${dates[dates.length - 1]}T12:00:00Z`);
  const months = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];
  return `Obědové menu · ${first.getUTCDate()}.–${last.getUTCDate()}. ${months[last.getUTCMonth()]} ${last.getUTCFullYear()}`;
}

function normalizeLunchMenu(menu: SanityLunchMenu, dates: string[]): LunchDay[] {
  return lunchWeekdays.map((weekday, index) => {
    const day = menu[weekday.key] || {};
    return {
      date: dates[index],
      label: `${weekday.label} ${Number(dates[index].slice(8, 10))}. ${Number(dates[index].slice(5, 7))}.`,
      shortLabel: weekday.shortLabel,
      dishes: [
        { name: day.soupName || "", price: "", allergens: day.soupAllergens || "" },
        { name: day.dishAName || "", price: "159 Kč", allergens: day.dishAAllergens || "" },
        { name: day.dishBName || "", price: "169 Kč", allergens: day.dishBAllergens || "" },
      ],
    };
  });
}

function hasLunchMenuContent(menu: SanityLunchMenu): boolean {
  return Object.values(menu).some((day) => Object.values(day || {}).some((value) => typeof value === "string" && value.trim().length > 0));
}

export async function getSiteContent(): Promise<SiteContent> {
  const dates = getCurrentWeekDates();
  const currentLunchLabel = formatLunchWeek(dates);
  if (!projectId) return { ...fallback, lunchUpdated: currentLunchLabel };

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-08-01",
    useCdn: true,
    token: import.meta.env.SANITY_READ_TOKEN,
  });

  try {
    const data = await client.fetch<{ lunchMenu?: SanityLunchMenu; operatingStatus?: OperatingStatusOverride }>(`{
      "lunchMenu": *[_type == "lunchMenu" && _id == "lunchMenu"][0]{monday{soupName,soupAllergens,dishAName,dishAAllergens,dishBName,dishBAllergens},tuesday{soupName,soupAllergens,dishAName,dishAAllergens,dishBName,dishBAllergens},wednesday{soupName,soupAllergens,dishAName,dishAAllergens,dishBName,dishBAllergens},thursday{soupName,soupAllergens,dishAName,dishAAllergens,dishBName,dishBAllergens},friday{soupName,soupAllergens,dishAName,dishAAllergens,dishBName,dishBAllergens}},
      "operatingStatus": *[_type == "operatingStatus" && _id == "operatingStatus"][0]{mode,closedReason,closedUntil}
    }`);

    if (!data) return { ...fallback, lunchUpdated: currentLunchLabel };
    const hasLunchMenu = Boolean(data.lunchMenu && hasLunchMenuContent(data.lunchMenu));
    const lunchDays = hasLunchMenu ? normalizeLunchMenu(data.lunchMenu!, dates) : fallback.lunchDays;
    return {
      ...fallback,
      notice: hasLunchMenu ? undefined : fallback.notice,
      lunchUpdated: currentLunchLabel,
      lunchDays,
      operatingStatus: data.operatingStatus ?? fallback.operatingStatus,
    };
  } catch (error) {
    console.warn("Sanity content could not be loaded; using local fallback.", error);
    return { ...fallback, lunchUpdated: currentLunchLabel };
  }
}
