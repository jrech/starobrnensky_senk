// Writes the week in studio/lunch-week.json into the lunch menu in Sanity.
// Run from the repo root: corepack pnpm --dir studio run lunch
// Only the five days are replaced; prices stay as they are in Studio.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-01" });
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;

async function main() {
  const week = JSON.parse(readFileSync(resolve(process.cwd(), "lunch-week.json"), "utf8"));
  const missing = days.filter((day) => !week[day]);
  if (missing.length) throw new Error(`V lunch-week.json chybí dny: ${missing.join(", ")}`);
  await client.createIfNotExists({ _id: "lunchMenu", _type: "lunchMenu" });
  await client.patch("lunchMenu").set(Object.fromEntries(days.map((day) => [day, week[day]]))).commit();
  const saved = await client.fetch(`*[_id == "lunchMenu"][0]{soupPrice, dishAPrice, dishBPrice, "pondeli": monday.dishAName}`);
  console.log("Obědové menu uloženo.", saved);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
