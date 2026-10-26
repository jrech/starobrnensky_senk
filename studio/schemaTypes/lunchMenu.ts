import { defineField, defineType } from "sanity";

const allergenHint = "Čísla alergenů oddělená čárkou, například 1, 3, 7.";

const lunchDay = (name: string, title: string) => defineField({
  name,
  title,
  type: "object",
  description: "Když den necháte prázdný, web napíše „Tento den obědy nevaříme“.",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "soupName", title: "Polévka · název", type: "string" }),
    defineField({ name: "soupAllergens", title: "Polévka · alergeny", type: "string", description: allergenHint }),
    defineField({ name: "dishAName", title: "Jídlo A · název", type: "string" }),
    defineField({ name: "dishAAllergens", title: "Jídlo A · alergeny", type: "string", description: allergenHint }),
    defineField({ name: "dishBName", title: "Jídlo B · název", type: "string" }),
    defineField({ name: "dishBAllergens", title: "Jídlo B · alergeny", type: "string", description: allergenHint }),
  ],
});

const price = (name: string, title: string, description: string) => defineField({
  name,
  title,
  type: "number",
  description,
  fieldset: "prices",
  validation: (rule) => rule.integer().min(0),
});

export default defineType({
  name: "lunchMenu",
  title: "Obědové menu",
  type: "document",
  description: "Menu přepište vždy o víkendu na nadcházející týden. Datum a názvy dnů se doplňují automaticky.",
  fieldsets: [{ name: "prices", title: "Ceny", options: { collapsible: true, collapsed: true, columns: 3 } }],
  fields: [
    price("soupPrice", "Polévka (Kč)", "Prázdné = cena se nezobrazí."),
    price("dishAPrice", "Jídlo A (Kč)", "Prázdné = 159 Kč."),
    price("dishBPrice", "Jídlo B (Kč)", "Prázdné = 169 Kč."),
    lunchDay("monday", "Pondělí"),
    lunchDay("tuesday", "Úterý"),
    lunchDay("wednesday", "Středa"),
    lunchDay("thursday", "Čtvrtek"),
    lunchDay("friday", "Pátek"),
  ],
  preview: { prepare: () => ({ title: "Obědové menu" }) },
});
