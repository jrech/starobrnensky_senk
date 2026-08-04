import { defineField, defineType } from "sanity";

const required = (rule: any) => rule.required();

const lunchDay = (name: string, title: string) => defineField({
  name,
  title,
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "soupName",
      title: "Polévka · název",
      type: "string",
      validation: required,
    }),
    defineField({
      name: "soupAllergens",
      title: "Polévka · alergeny",
      type: "string",
      description: "Čísla alergenů oddělená čárkou, například 1, 3, 7.",
    }),
    defineField({
      name: "dishAName",
      title: "Jídlo A · 159 Kč · název",
      type: "string",
      validation: required,
    }),
    defineField({
      name: "dishAAllergens",
      title: "Jídlo A · alergeny",
      type: "string",
      description: "Čísla alergenů oddělená čárkou, například 1, 3, 7.",
    }),
    defineField({
      name: "dishBName",
      title: "Jídlo B · 169 Kč · název",
      type: "string",
      validation: required,
    }),
    defineField({
      name: "dishBAllergens",
      title: "Jídlo B · alergeny",
      type: "string",
      description: "Čísla alergenů oddělená čárkou, například 1, 3, 7.",
    }),
  ],
});

export default defineType({
  name: "siteContent",
  title: "Obsah webu",
  type: "document",
  fields: [
    defineField({
      name: "operatingStatus",
      title: "Stav provozu",
      type: "object",
      description: "Běžně nechte automatický režim. Při mimořádném zavření zvolte zavřeno, napište důvod a vyberte datum návratu k běžné otevírací době.",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "mode",
          title: "Stav v hero",
          type: "string",
          initialValue: "automatic",
          options: {
            list: [
              { title: "Automaticky podle otevírací doby", value: "automatic" },
              { title: "Zavřeno · zobrazit důvod", value: "closed" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "closedReason",
          title: "Důvod zavření",
          type: "string",
          placeholder: "Například technické důvody",
          hidden: ({ parent }) => parent?.mode !== "closed",
          validation: (rule) => rule.custom((value, context: any) => context.parent?.mode !== "closed" || Boolean(value) || "Doplňte důvod zavření."),
        }),
        defineField({
          name: "closedUntil",
          title: "Návrat k automatické otevírací době od",
          type: "date",
          description: "Po tomto datu začne hero znovu počítat stav podle běžné otevírací doby.",
          hidden: ({ parent }) => parent?.mode !== "closed",
          validation: (rule) => rule.custom((value, context: any) => context.parent?.mode !== "closed" || Boolean(value) || "Vyberte datum návratu k automatickému režimu."),
        }),
      ],
    }),
    defineField({
      name: "lunchMenu",
      title: "Obědové menu",
      type: "object",
      description: "Ceny jsou pevně nastavené: jídlo A 159 Kč a jídlo B 169 Kč. Datum a názvy dnů se doplňují automaticky.",
      options: { collapsible: false },
      fields: [
        lunchDay("monday", "Pondělí"),
        lunchDay("tuesday", "Úterý"),
        lunchDay("wednesday", "Středa"),
        lunchDay("thursday", "Čtvrtek"),
        lunchDay("friday", "Pátek"),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Obsah webu" }) },
});
