import { defineField, defineType } from "sanity";

const photo = defineField({
  name: "image",
  title: "Fotka",
  type: "image",
  description: "Nepovinné. Bez fotky web použije výchozí obrázek.",
  options: { hotspot: true },
});

const rum = defineType({
  name: "rum",
  title: "Rum",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Název", type: "string", validation: (rule) => rule.required().error("Doplňte název rumu.") }),
    defineField({ name: "origin", title: "Země původu", type: "string", placeholder: "Například Venezuela" }),
    defineField({ name: "abv", title: "Alkohol (%)", type: "number", validation: (rule) => rule.min(0).max(100) }),
    defineField({ name: "price", title: "Cena za 0,04 l (Kč)", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "note", title: "Krátký popis", type: "string", placeholder: "Například kulatý, medový a jemně kořenitý." }),
    photo,
  ],
  preview: {
    select: { title: "name", origin: "origin", price: "price", media: "image" },
    prepare: ({ title, origin, price, media }) => ({
      title: title || "Nový rum",
      subtitle: [origin, typeof price === "number" ? `${price} Kč` : undefined].filter(Boolean).join(" · "),
      media,
    }),
  },
});

const specialty = defineType({
  name: "specialty",
  title: "Specialita",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Název", type: "string", validation: (rule) => rule.required().error("Doplňte název jídla.") }),
    defineField({ name: "note", title: "Krátký popis", type: "string" }),
    defineField({ name: "price", title: "Cena", type: "string", description: "Například 199 Kč nebo 249 Kč / kg. Když cenu nevyplníte, web ji nezobrazí." }),
    photo,
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "image" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Nová specialita", subtitle, media }),
  },
});

export const rumMenu = defineType({
  name: "rumMenu",
  title: "Rumy",
  type: "document",
  description: "Rumy na homepage. Pořadí měníte přetažením.",
  fields: [defineField({ name: "rums", title: "Rumy", type: "array", of: [{ type: "rum" }] })],
  preview: { prepare: () => ({ title: "Rumy" }) },
});

export const specialtyMenu = defineType({
  name: "specialtyMenu",
  title: "Speciality",
  type: "document",
  description: "Speciality na homepage. Ideálně tři, pořadí měníte přetažením.",
  fields: [defineField({ name: "specialties", title: "Speciality", type: "array", of: [{ type: "specialty" }], validation: (rule) => rule.max(6) })],
  preview: { prepare: () => ({ title: "Speciality" }) },
});

export const homeSchemaTypes = [rum, specialty, rumMenu, specialtyMenu];
