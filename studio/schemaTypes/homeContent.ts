import { defineField, defineType } from "sanity";

const photo = defineField({
  name: "image",
  title: "Fotka",
  type: "image",
  description: "Bez fotky web použije výchozí obrázek.",
  options: { hotspot: true },
});

const rum = defineType({
  name: "rum",
  title: "Rum",
  type: "object",
  fields: [
    photo,
    defineField({ name: "name", title: "Název", type: "string", validation: (rule) => rule.required().error("Doplňte název rumu.") }),
    defineField({ name: "origin", title: "Původ", type: "string", placeholder: "Například Venezuela" }),
    defineField({ name: "taste", title: "Chuťový profil", type: "string", placeholder: "Například kulatý, medový a jemně kořenitý." }),
  ],
  preview: {
    select: { title: "name", subtitle: "origin", media: "image" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Nový rum", subtitle, media }),
  },
});

const specialty = defineType({
  name: "specialty",
  title: "Specialita",
  type: "object",
  fields: [
    photo,
    defineField({ name: "name", title: "Název", type: "string", validation: (rule) => rule.required().error("Doplňte název jídla.") }),
    defineField({ name: "ingredients", title: "Co je v jídle", type: "string", placeholder: "Například hořčice, křen, nakládaná zelenina a chléb." }),
    defineField({ name: "price", title: "Cena", type: "string", description: "Například 199 Kč nebo 249 Kč / kg. Když cenu nevyplníte, web ji nezobrazí." }),
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
  description: "Rumy na hlavní stránce. Pořadí měníte přetažením.",
  fields: [defineField({ name: "rums", title: "Rumy", type: "array", of: [{ type: "rum" }] })],
  preview: { prepare: () => ({ title: "Rumy" }) },
});

export const specialtyMenu = defineType({
  name: "specialtyMenu",
  title: "Speciality",
  type: "document",
  description: "Speciality na hlavní stránce. Ideálně tři, pořadí měníte přetažením.",
  fields: [defineField({ name: "specialties", title: "Speciality", type: "array", of: [{ type: "specialty" }], validation: (rule) => rule.max(6) })],
  preview: { prepare: () => ({ title: "Speciality" }) },
});

export const homeSchemaTypes = [rum, specialty, rumMenu, specialtyMenu];
