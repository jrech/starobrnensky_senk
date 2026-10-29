// Fills Sanity with what the website shows today, so the owner starts from real entries instead of empty forms.
// Run from the repo root: corepack pnpm --dir studio run seed
// Safe to run again: it never overwrites lunch, rums or specialties the owner already filled in.
import { createReadStream, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-01" });
const asset = (file: string) => resolve(process.cwd(), "../src/assets", file);

async function uploadImage(file: string) {
  const uploaded = await client.assets.upload("image", createReadStream(asset(file)), { filename: basename(file) });
  return { _type: "image", asset: { _type: "reference", _ref: uploaded._id } };
}

async function seedLunch() {
  const lunch = JSON.parse(readFileSync(resolve(process.cwd(), "seed-lunch-menu.json"), "utf8"));
  const existed = Boolean(await client.getDocument("lunchMenu"));
  if (!existed) await client.create(lunch);
  // Prices set earlier in the separate "Ceny obědů" document move into the lunch menu.
  const old = await client.fetch<{ soup?: number; dishA?: number; dishB?: number } | null>(`*[_id == "lunchPrices"][0]{soup,dishA,dishB}`);
  const prices = Object.fromEntries(Object.entries({
    soupPrice: old?.soup,
    dishAPrice: old?.dishA ?? 159,
    dishBPrice: old?.dishB ?? 169,
  }).filter(([, value]) => typeof value === "number"));
  await client.patch("lunchMenu").setIfMissing(prices).commit();
  console.log(existed ? "Obědové menu: už existuje, doplněny jen chybějící ceny." : "Obědové menu: založeno.");
}

async function hasItems(id: string, field: string) {
  return (await client.fetch<number>(`count(*[_id == $id][0].${field})`, { id })) > 0;
}

async function seedRums() {
  if (await hasItems("rumMenu", "rums")) return console.log("Rumy: už vyplněné, beze změny.");
  const image = await uploadImage("rum-bottle.png");
  const rums = [
    { name: "Diplomático Reserva", origin: "Venezuela", taste: "Kulatý, medový a jemně kořenitý." },
    { name: "Abuelo 7 Años", origin: "Panama", taste: "Sušší rum s tóny dubu a vanilky." },
    { name: "Plantation XO", origin: "Barbados", taste: "Kokos, kakao a dlouhý sametový závěr." },
    { name: "Ron Zacapa 23", origin: "Guatemala", taste: "Bohatý styl s karamelem a sušeným ovocem." },
  ];
  await client.createOrReplace({
    _id: "rumMenu",
    _type: "rumMenu",
    rums: rums.map((rum, index) => ({ _key: `rum${index}`, _type: "rum", image, ...rum })),
  });
  console.log("Rumy: založeny 4 rumy.");
}

async function seedSpecialties() {
  if (await hasItems("specialtyMenu", "specialties")) return console.log("Speciality: už vyplněné, beze změny.");
  const specialties = [
    { name: "Pečené vepřové koleno", ingredients: "Hořčice, křen, nakládaná zelenina a chléb.", price: "249 Kč / kg", file: "specialita-koleno.webp" },
    { name: "Šenkovní burger", ingredients: "Hovězí maso, slanina, čedar a naše omáčka.", price: "199 Kč", file: "senkovni-burger.png" },
    { name: "BBQ žebra", ingredients: "Pomalu pečená, s chlebem a salátkem coleslaw.", price: "229 Kč", file: "bbq-zebra.png" },
  ];
  const items = [];
  for (const [index, { file, ...item }] of specialties.entries()) {
    items.push({ _key: `specialty${index}`, _type: "specialty", image: await uploadImage(file), ...item });
  }
  await client.createOrReplace({ _id: "specialtyMenu", _type: "specialtyMenu", specialties: items });
  console.log("Speciality: založeny 3 speciality.");
}

async function main() {
  await seedLunch();
  await seedRums();
  await seedSpecialties();
  console.log("Hotovo.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
