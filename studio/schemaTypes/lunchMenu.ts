import { defineField, defineType } from "sanity";

const required = (rule: any) => rule.required();

const lunchDay = (name: string, title: string) => defineField({
  name,
  title,
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "soupName", title: "Polévka · název", type: "string", validation: required }),
    defineField({ name: "soupAllergens", title: "Polévka · alergeny", type: "string", description: "Čísla alergenů oddělená čárkou, například 1, 3, 7." }),
    defineField({ name: "dishAName", title: "Jídlo A · 159 Kč · název", type: "string", validation: required }),
    defineField({ name: "dishAAllergens", title: "Jídlo A · alergeny", type: "string", description: "Čísla alergenů oddělená čárkou, například 1, 3, 7." }),
    defineField({ name: "dishBName", title: "Jídlo B · 169 Kč · název", type: "string", validation: required }),
    defineField({ name: "dishBAllergens", title: "Jídlo B · alergeny", type: "string", description: "Čísla alergenů oddělená čárkou, například 1, 3, 7." }),
  ],
});

export default defineType({
  name: "lunchMenu",
  title: "Obědové menu",
  type: "document",
  description: "Ceny jsou pevně nastavené: jídlo A 159 Kč a jídlo B 169 Kč. Datum a názvy dnů se doplňují automaticky.",
  fields: [
    lunchDay("monday", "Pondělí"),
    lunchDay("tuesday", "Úterý"),
    lunchDay("wednesday", "Středa"),
    lunchDay("thursday", "Čtvrtek"),
    lunchDay("friday", "Pátek"),
  ],
  preview: { prepare: () => ({ title: "Obědové menu" }) },
});
