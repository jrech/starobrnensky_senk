import { createClient } from "@sanity/client";
import type { OpeningHours, OperatingStatusOverride } from "./opening-status";
import { drinkMenu as fallbackDrinkMenu, foodMenu as fallbackFoodMenu, type MenuCategory } from "./menu-content";
import { lunchQuery, type LunchData, type LunchMenu } from "./lunch";

type SanityMenu = { categories?: Array<{ title?: string; items?: Array<{ name?: string; amount?: string; price?: number; allergens?: string }> }> };
type SanityRum = { name?: string; origin?: string; taste?: string; image?: string };
type SanitySpecialty = { name?: string; ingredients?: string; price?: string; image?: string };
export type Rum = { name: string; origin?: string; note?: string; image?: string };
export type Specialty = { name: string; note?: string; price?: string; image?: string };
export type SiteContent = {
  lunch: LunchData;
  rums: Rum[];
  specialties: Specialty[];
  phone: string;
  phoneHref: string;
  email: string;
  facebookUrl: string;
  /** Leave empty until the pub has an Instagram profile; the icon is hidden without it. */
  instagramUrl?: string;
  address: string;
  mapUrl: string;
  hours: OpeningHours[];
  operatingStatus?: OperatingStatusOverride;
  foodMenu: MenuCategory[];
  drinkMenu: MenuCategory[];
};

const fallback: SiteContent = {
  // getSiteContent uses the sample menu only for local development without Sanity.
  lunch: {},
  rums: [
    { name: "Diplomático Reserva", origin: "Venezuela", note: "Kulatý, medový a jemně kořenitý." },
    { name: "Abuelo 7 Años", origin: "Panama", note: "Sušší rum s tóny dubu a vanilky." },
    { name: "Plantation XO", origin: "Barbados", note: "Kokos, kakao a dlouhý sametový závěr." },
    { name: "Ron Zacapa 23", origin: "Guatemala", note: "Bohatý styl s karamelem a sušeným ovocem." },
  ],
  specialties: [
    { name: "Pečené vepřové koleno", note: "Hořčice, křen, nakládaná zelenina a chléb.", price: "249 Kč / kg" },
    { name: "Šenkovní burger", note: "Hovězí maso, slanina, čedar a naše omáčka.", price: "199 Kč" },
    { name: "BBQ žebra", note: "Pomalu pečená, s chlebem a salátkem coleslaw.", price: "229 Kč" },
  ],
  phone: "+420 776 791 144",
  phoneHref: "+420776791144",
  email: "senkbrno@seznam.cz",
  facebookUrl: "https://www.facebook.com/senkbrno",
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

const sampleMenu: LunchMenu = {
  monday: { soupName: "Česneková polévka se sýrem a krutony", soupAllergens: "1, 7", dishAName: "Vepřový vrabec, špenát, bramborový knedlík", dishAAllergens: "1, 3, 7", dishBName: "Kuřecí steak, pepřová omáčka, hranolky", dishBAllergens: "1, 7" },
  tuesday: { soupName: "Hovězí vývar s nudlemi", soupAllergens: "1, 3, 9", dishAName: "Smažený kuřecí řízek, bramborová kaše", dishAAllergens: "1, 3, 7", dishBName: "Fazolový guláš s klobásou a chlebem", dishBAllergens: "1" },
  wednesday: { soupName: "Bramboračka s houbami", soupAllergens: "1, 9", dishAName: "Hovězí na česneku, rýže", dishAAllergens: "1", dishBName: "Smažený sýr, hranolky, tatarská omáčka", dishBAllergens: "1, 3, 7" },
  thursday: { soupName: "Kulajda s vejcem", soupAllergens: "1, 3, 7", dishAName: "Segedínský guláš, houskový knedlík", dishAAllergens: "1, 3, 7", dishBName: "Grilovaný hermelín, salát a toast", dishBAllergens: "1, 7" },
  friday: { soupName: "Gulášová polévka", soupAllergens: "1", dishAName: "Moravský závitek, dušená rýže", dishAAllergens: "1, 3, 10", dishBName: "Bramborové noky s kuřecím masem a špenátem", dishBAllergens: "1, 3, 7" },
};

const imageUrl = (url: string | undefined, width: number) => url ? `${url}?w=${width}&auto=format&fit=max` : undefined;

function normalizeRums(rums: SanityRum[]): Rum[] {
  return rums.filter((rum) => rum.name?.trim()).map((rum) => ({
    name: rum.name!.trim(),
    origin: rum.origin?.trim(),
    note: rum.taste?.trim(),
    image: imageUrl(rum.image, 960),
  }));
}

function normalizeSpecialties(specialties: SanitySpecialty[]): Specialty[] {
  return specialties.filter((item) => item.name?.trim()).map((item) => ({
    name: item.name!.trim(),
    note: item.ingredients?.trim(),
    price: item.price?.trim() || undefined,
    image: imageUrl(item.image, 1280),
  }));
}

function normalizeMenu(menu: SanityMenu): MenuCategory[] {
  return (menu.categories || []).map((category) => ({
    title: category.title?.trim() || "",
    items: (category.items || [])
      .filter((item) => Boolean(item.name?.trim()) && typeof item.price === "number")
      .map((item) => ({
        name: item.name!.trim(),
        amount: item.amount?.trim(),
        price: `${item.price} Kč`,
        allergens: item.allergens?.trim(),
      })),
  })).filter((category) => category.title && category.items.length > 0);
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!projectId) return { ...fallback, lunch: { menu: sampleMenu } };

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-08-01",
    useCdn: false,
    token: import.meta.env.SANITY_READ_TOKEN,
  });

  try {
    const data = await client.fetch<{ lunch?: LunchMenu; operatingStatus?: OperatingStatusOverride; foodMenu?: SanityMenu; drinkMenu?: SanityMenu; rums?: SanityRum[]; specialties?: SanitySpecialty[] }>(`{
      "lunch": ${lunchQuery},
      "operatingStatus": *[_type == "operatingStatus" && _id == "operatingStatus"][0]{mode,closedReason,closedUntil,noticeText},
      "foodMenu": *[_type == "foodMenu" && _id == "foodMenu"][0]{categories[]{title,items[]{name,amount,price,allergens}}},
      "drinkMenu": *[_type == "drinkMenu" && _id == "drinkMenu"][0]{categories[]{title,items[]{name,amount,price,allergens}}},
      "rums": *[_type == "rumMenu" && _id == "rumMenu"][0].rums[]{name,origin,taste,"image":image.asset->url},
      "specialties": *[_type == "specialtyMenu" && _id == "specialtyMenu"][0].specialties[]{name,ingredients,price,"image":image.asset->url}
    }`);
    const rums = normalizeRums(data?.rums || []);
    const specialties = normalizeSpecialties(data?.specialties || []);

    return {
      ...fallback,
      // No sample dishes here: an empty week tells guests the menu is on its way instead of showing made-up food.
      lunch: { menu: data?.lunch ?? undefined },
      operatingStatus: data?.operatingStatus ?? fallback.operatingStatus,
      foodMenu: data?.foodMenu ? normalizeMenu(data.foodMenu) : fallback.foodMenu,
      drinkMenu: data?.drinkMenu ? normalizeMenu(data.drinkMenu) : fallback.drinkMenu,
      rums: rums.length ? rums : fallback.rums,
      specialties: specialties.length ? specialties : fallback.specialties,
    };
  } catch (error) {
    console.warn("Sanity content could not be loaded; using local fallback.", error);
    return fallback;
  }
}
