import { defineField, defineType } from "sanity";

export default defineType({
  name: "operatingStatus",
  title: "Stav provozu",
  type: "document",
  fields: [
    defineField({
      name: "mode",
      title: "Hlášení na webu",
      type: "string",
      // "automatic" stays as the stored value so existing documents keep working.
      initialValue: "automatic",
      options: {
        list: [
          { title: "Žádné", value: "automatic" },
          { title: "Hlášení + text", value: "notice" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "noticeText",
      title: "Text hlášení",
      type: "text",
      rows: 3,
      placeholder: "Například: Dnes nevaříme. Na pivo se ale stavte, výčep je otevřený jako obvykle.",
      description: "Zobrazí se v úvodu webu a na stránce lístku. První věta bude tučně jako nadpis, zbytek pod ní.",
      hidden: ({ document }) => document?.mode !== "notice",
      validation: (rule) => rule.custom((value, context: any) => context.document?.mode !== "notice" || Boolean(value?.trim()) || "Doplňte text hlášení."),
    }),
  ],
  preview: { prepare: () => ({ title: "Stav provozu" }) },
});
