import { defineField, defineType } from "sanity";

export default defineType({
  name: "operatingStatus",
  title: "Stav provozu",
  type: "document",
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
      hidden: ({ document }) => document?.mode !== "closed",
      validation: (rule) => rule.custom((value, context: any) => context.document?.mode !== "closed" || Boolean(value) || "Doplňte důvod zavření."),
    }),
    defineField({
      name: "closedUntil",
      title: "Návrat k automatické otevírací době od",
      type: "date",
      description: "Po tomto datu začne web znovu počítat stav podle běžné otevírací doby.",
      hidden: ({ document }) => document?.mode !== "closed",
      validation: (rule) => rule.custom((value, context: any) => context.document?.mode !== "closed" || Boolean(value) || "Vyberte datum návratu k automatickému režimu."),
    }),
  ],
  preview: { prepare: () => ({ title: "Stav provozu" }) },
});
