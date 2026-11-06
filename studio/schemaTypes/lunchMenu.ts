import { defineField, defineType } from "sanity";

const course = (prefix: string) => [
  defineField({ name: `${prefix}Name`, title: "Název", type: "string", fieldset: prefix }),
  defineField({ name: `${prefix}Allergens`, title: "Alergeny", type: "string", placeholder: "např. 1, 3, 7", fieldset: prefix }),
];

// Each course is one row: name and allergens side by side, under the course heading.
const lunchDay = (name: string, title: string) => defineField({
  name,
  title,
  type: "object",
  description: "Když den necháte prázdný, web napíše „Tento den obědy nevaříme“.",
  options: { collapsible: true, collapsed: false },
  fieldsets: [
    { name: "soup", title: "Polévka", options: { columns: 2 } },
    { name: "dishA", title: "Jídlo A", options: { columns: 2 } },
    { name: "dishB", title: "Jídlo B", options: { columns: 2 } },
  ],
  fields: [...course("soup"), ...course("dishA"), ...course("dishB")],
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
  fieldsets: [{ name: "prices", title: "Ceny meníček" }],
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
