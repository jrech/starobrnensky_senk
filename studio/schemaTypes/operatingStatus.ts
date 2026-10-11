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
          { title: "Hlášení · zobrazit text při běžné otevírací době", value: "notice" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "noticeText",
      title: "Hlášení pro návštěvníky",
      type: "string",
      placeholder: "Například dnes vaříme jen do 12 hod.",
      description: "Hlavní stav se stále řídí běžnou otevírací dobou. Text se zobrazí pod ním.",
      hidden: ({ document }) => document?.mode !== "notice",
      validation: (rule) => rule.custom((value, context: any) => context.document?.mode !== "notice" || Boolean(value?.trim()) || "Doplňte text hlášení."),
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
