import { defineArrayMember, defineField, defineType } from "sanity";

const required = (rule: any) => rule.required();

export default defineType({
  name: "siteContent",
  title: "Obsah webu",
  type: "document",
  fields: [
    defineField({ name: "lunchUpdated", title: "Aktuálnost menu", type: "string", description: "Např. Tento týden · 3.–7. srpna" }),
    defineField({
      name: "lunchDays",
      title: "Obědové menu",
      type: "array",
      validation: required,
      of: [defineArrayMember({
        type: "object",
        name: "lunchDay",
        fields: [
          defineField({ name: "date", title: "Datum", type: "date", validation: required }),
          defineField({ name: "label", title: "Celý název dne", type: "string", placeholder: "Pondělí 3. 8.", validation: required }),
          defineField({ name: "shortLabel", title: "Zkratka", type: "string", placeholder: "Po", validation: required }),
          defineField({ name: "dishes", title: "Jídla", type: "array", validation: required, of: [defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "name", title: "Název", type: "string", validation: required }),
              defineField({ name: "detail", title: "Popis", type: "string" }),
              defineField({ name: "price", title: "Cena", type: "string", validation: required }),
              defineField({ name: "allergens", title: "Alergeny", type: "string" }),
            ],
            preview: { select: { title: "name", subtitle: "price" } },
          })] }),
        ],
        preview: { select: { title: "label", subtitle: "date" } },
      })],
    }),
    defineField({
      name: "foodMenu",
      title: "Jídelní lístek",
      description: "Kategorie a položky pro stránku jídelního lístku. Kategorie i položky lze libovolně přidávat, měnit a mazat.",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        name: "foodMenuCategory",
        fields: [
          defineField({ name: "title", title: "Název kategorie", type: "string", validation: required }),
          defineField({ name: "items", title: "Položky", type: "array", validation: required, of: [defineArrayMember({
            type: "object",
            name: "foodMenuItem",
            fields: [
              defineField({ name: "amount", title: "Množství", type: "string", placeholder: "200 g" }),
              defineField({ name: "name", title: "Název jídla", type: "string", validation: required }),
              defineField({ name: "allergens", title: "Alergeny", type: "string", placeholder: "1, 3, 7" }),
              defineField({ name: "price", title: "Cena", type: "string", placeholder: "199 Kč", validation: required }),
            ],
            preview: { select: { title: "name", subtitle: "price" } },
          })] }),
        ],
        preview: { select: { title: "title" } },
      })],
    }),
    defineField({
      name: "drinkMenu",
      title: "Nápojový lístek",
      description: "Kategorie a položky pro stránku nápojového lístku.",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        name: "drinkMenuCategory",
        fields: [
          defineField({ name: "title", title: "Název kategorie", type: "string", validation: required }),
          defineField({ name: "items", title: "Položky", type: "array", validation: required, of: [defineArrayMember({
            type: "object",
            name: "drinkMenuItem",
            fields: [
              defineField({ name: "amount", title: "Objem / množství", type: "string", placeholder: "0,5 l" }),
              defineField({ name: "name", title: "Název nápoje", type: "string", validation: required }),
              defineField({ name: "allergens", title: "Alergeny", type: "string", placeholder: "1, 7" }),
              defineField({ name: "price", title: "Cena", type: "string", placeholder: "49 Kč", validation: required }),
            ],
            preview: { select: { title: "name", subtitle: "price" } },
          })] }),
        ],
        preview: { select: { title: "title" } },
      })],
    }),
    defineField({ name: "rums", title: "Rumy", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "name", title: "Název", type: "string", validation: required }),
      defineField({ name: "origin", title: "Země / region", type: "string", validation: required }),
      defineField({ name: "note", title: "Chuť v jedné větě", type: "string", validation: required }),
      defineField({ name: "abv", title: "Alkohol", type: "string", placeholder: "40 %", validation: required }),
      defineField({ name: "image", title: "Fotografie", type: "image", options: { hotspot: true } }),
    ], preview: { select: { title: "name", subtitle: "origin", media: "image" } } })] }),
    defineField({ name: "specialties", title: "Speciality", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "name", title: "Název", type: "string", validation: required }),
      defineField({ name: "note", title: "Popis", type: "string", validation: required }),
      defineField({ name: "price", title: "Cena", type: "string" }),
      defineField({ name: "image", title: "Fotografie", type: "image", options: { hotspot: true } }),
    ], preview: { select: { title: "name", subtitle: "price", media: "image" } } })] }),
    defineField({ name: "phone", title: "Telefon pro zobrazení", type: "string" }),
    defineField({ name: "phoneHref", title: "Telefon pro odkaz", type: "string", description: "Např. +420776791144" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "address", title: "Adresa", type: "string" }),
    defineField({ name: "mapUrl", title: "Odkaz do map", type: "url" }),
    defineField({ name: "hours", title: "Otevírací doba", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "days", title: "Dny", type: "string", description: "Použijte zkratky Po–Čt, Pá, So nebo Ne.", validation: required }),
      defineField({ name: "hours", title: "Hodiny", type: "string", description: "Formát HH:MM–HH:MM, například 11:00–23:00.", validation: (rule) => rule.required().regex(/^\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2}$/, { name: "časový rozsah" }) }),
    ], preview: { select: { title: "days", subtitle: "hours" } } })] }),
    defineField({
      name: "operatingStatus",
      title: "Stav provozu v hero",
      type: "object",
      description: "Automatický stav se počítá podle otevírací doby. Výjimečné zavření ho do zvoleného data přepíše.",
      fields: [
        defineField({
          name: "mode",
          title: "Režim",
          type: "string",
          initialValue: "automatic",
          options: {
            list: [
              { title: "Automaticky podle otevírací doby", value: "automatic" },
              { title: "Dnes zavřeno", value: "closed" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "closedReason",
          title: "Důvod zavření",
          type: "string",
          placeholder: "Např. technické důvody",
          hidden: ({ parent }) => parent?.mode !== "closed",
        }),
        defineField({
          name: "closedUntil",
          title: "Zavřeno do včetně",
          type: "date",
          description: "Po tomto datu se web automaticky vrátí k otevírací době.",
          hidden: ({ parent }) => parent?.mode !== "closed",
          validation: (rule) => rule.custom((value, context: any) => context.parent?.mode !== "closed" || Boolean(value) || "Vyberte datum, do kdy mimořádné zavření platí."),
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Obsah homepage" }) },
});
