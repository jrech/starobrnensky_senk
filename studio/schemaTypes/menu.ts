import { defineField, defineType } from "sanity";

const menuItem = defineType({
  name: "menuItem",
  title: "Položka lístku",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Název",
      type: "string",
      validation: (rule) => rule.required().error("Doplňte název položky."),
    }),
    defineField({
      name: "amount",
      title: "Gramáž / objem",
      type: "string",
      description: "Například 200 g, 0,5 l nebo 1 ks.",
    }),
    defineField({
      name: "price",
      title: "Cena v Kč",
      type: "number",
      description: "Zadejte pouze číslo, například 189.",
      validation: (rule) => rule.required().integer().min(0).error("Zadejte cenu v celých korunách."),
    }),
    defineField({
      name: "allergens",
      title: "Alergeny",
      type: "string",
      description: "Nepovinné. Čísla oddělte čárkou, například 1, 3, 7.",
      validation: (rule) => rule.regex(/^\s*(?:[1-9]|1[0-4])(?:\s*,\s*(?:[1-9]|1[0-4]))*\s*$/, { name: "seznam alergenů", invert: false }).warning("Použijte čísla 1–14 oddělená čárkou."),
    }),
  ],
  preview: {
    select: { title: "name", amount: "amount", price: "price" },
    prepare: ({ title, amount, price }) => ({
      title: title || "Nová položka",
      subtitle: [amount, typeof price === "number" ? `${price} Kč` : undefined].filter(Boolean).join(" · "),
    }),
  },
});

const menuCategory = defineType({
  name: "menuCategory",
  title: "Skupina položek",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Název skupiny",
      type: "string",
      validation: (rule) => rule.required().error("Doplňte název skupiny."),
    }),
    defineField({
      name: "items",
      title: "Položky",
      type: "array",
      description: "Položky můžete přidávat, mazat a přetahováním měnit jejich pořadí.",
      of: [{ type: "menuItem" }],
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Nová skupina",
      subtitle: `${Array.isArray(items) ? items.length : 0} položek`,
    }),
  },
});

const createMenu = (name: "foodMenu" | "drinkMenu", title: string) => defineType({
  name,
  title,
  type: "document",
  description: "Skupiny i položky lze přidat, upravit, smazat a seřadit přetažením. Změny se zobrazí po publikování.",
  fields: [
    defineField({
      name: "categories",
      title: "Skupiny",
      type: "array",
      of: [{ type: "menuCategory" }],
    }),
  ],
  preview: { prepare: () => ({ title }) },
});

export const menuSchemaTypes = [
  menuItem,
  menuCategory,
  createMenu("foodMenu", "Jídelní lístek"),
  createMenu("drinkMenu", "Nápojový lístek"),
];
