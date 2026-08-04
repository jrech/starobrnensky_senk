import { createClient } from "@sanity/client";
import type { OpeningHours, OperatingStatusOverride } from "./opening-status";
import { drinkMenu as fallbackDrinkMenu, foodMenu as fallbackFoodMenu, type MenuCategory } from "./menu-content";

export type Dish = { name: string; detail?: string; price: string; allergens?: string };
export type LunchDay = { date: string; label: string; shortLabel: string; dishes: Dish[] };
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

export async function getSiteContent(): Promise<SiteContent> {
  if (!projectId) return fallback;

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-08-01",
    useCdn: true,
    token: import.meta.env.SANITY_READ_TOKEN,
  });

  try {
    const data = await client.fetch<Partial<SiteContent>>(`*[_type == "siteContent"][0]{
      lunchUpdated,
      lunchDays[]{date,label,shortLabel,dishes[]{name,detail,price,allergens}},
      foodMenu[]{title,items[]{amount,name,allergens,price}},
      drinkMenu[]{title,items[]{amount,name,allergens,price}},
      rums[]{name,origin,note,abv,"image": image.asset->url},
      specialties[]{name,note,price,"image": image.asset->url},
      phone,phoneHref,email,address,mapUrl,hours[]{days,hours},
      operatingStatus{mode,closedReason,closedUntil}
    }`);

    if (!data) return fallback;
    return {
      ...fallback,
      ...data,
      notice: data.notice ?? (data.lunchDays?.length ? undefined : fallback.notice),
      lunchUpdated: data.lunchUpdated ?? fallback.lunchUpdated,
      lunchDays: data.lunchDays ?? fallback.lunchDays,
      rums: data.rums ?? fallback.rums,
      specialties: data.specialties ?? fallback.specialties,
      phone: data.phone ?? fallback.phone,
      phoneHref: data.phoneHref ?? fallback.phoneHref,
      email: data.email ?? fallback.email,
      address: data.address ?? fallback.address,
      mapUrl: data.mapUrl ?? fallback.mapUrl,
      hours: data.hours ?? fallback.hours,
      operatingStatus: data.operatingStatus ?? fallback.operatingStatus,
      foodMenu: data.foodMenu ?? fallback.foodMenu,
      drinkMenu: data.drinkMenu ?? fallback.drinkMenu,
    } as SiteContent;
  } catch (error) {
    console.warn("Sanity content could not be loaded; using local fallback.", error);
    return fallback;
  }
}
