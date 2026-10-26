import { defineField, defineType } from "sanity";

const allergenHint = "Čísla alergenů oddělená čárkou, například 1, 3, 7.";
const months = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];

// Dates are handled as plain YYYY-MM-DD strings at noon UTC so the weekday never shifts with the editor's timezone.
const toDate = (value: string) => new Date(`${value}T12:00:00Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (value: string, days: number) => {
  const date = toDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
};
const pragueToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Prague" }).format(new Date());
const mondayOf = (value: string) => addDays(value, -((toDate(value).getUTCDay() + 6) % 7));

/** Monday of the week the owner most likely prepares: this week on Monday, otherwise the next one. */
const upcomingMonday = () => {
  const today = pragueToday();
  const monday = mondayOf(today);
  return monday === today ? monday : addDays(monday, 7);
};

export const formatLunchWeek = (weekStart: string) => {
  const first = toDate(weekStart);
  const last = toDate(addDays(weekStart, 4));
  const firstMonth = first.getUTCMonth() === last.getUTCMonth() ? "" : ` ${months[first.getUTCMonth()]}`;
  return `${first.getUTCDate()}.${firstMonth} – ${last.getUTCDate()}. ${months[last.getUTCMonth()]} ${last.getUTCFullYear()}`;
};

const lunchDay = (name: string, title: string) => defineField({
  name,
  title,
  type: "object",
  description: "Když den necháte prázdný, web napíše „Tento den obědy nevaříme“.",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: "soupName", title: "Polévka", type: "string" }),
    defineField({ name: "soupAllergens", title: "Polévka · alergeny", type: "string", description: allergenHint }),
    defineField({ name: "dishAName", title: "Jídlo A", type: "string" }),
    defineField({ name: "dishAAllergens", title: "Jídlo A · alergeny", type: "string", description: allergenHint }),
    defineField({ name: "dishBName", title: "Jídlo B", type: "string" }),
    defineField({ name: "dishBAllergens", title: "Jídlo B · alergeny", type: "string", description: allergenHint }),
  ],
});

export const lunchWeek = defineType({
  name: "lunchWeek",
  title: "Obědové menu na týden",
  type: "document",
  description: "Každý týden má vlastní menu, takže příští týden můžete napsat dopředu. Web sám ukáže menu pro aktuální týden.",
  fields: [
    defineField({
      name: "weekStart",
      title: "Týden od (pondělí)",
      type: "date",
      initialValue: upcomingMonday,
      options: { dateFormat: "D. M. YYYY" },
      validation: (rule) => rule.required().error("Vyberte pondělí, od kterého menu platí.").custom(async (value, context) => {
        if (!value) return true;
        if (toDate(value).getUTCDay() !== 1) return "Vyberte pondělí.";
        const id = context.document?._id.replace(/^drafts\./, "");
        const client = context.getClient({ apiVersion: "2026-08-01" });
        const duplicate = await client.fetch<number>(
          `count(*[_type == "lunchWeek" && weekStart == $weekStart && !(_id in [$id, "drafts." + $id])])`,
          { weekStart: value, id },
        );
        return duplicate ? "Menu pro tento týden už existuje. Upravte to stávající." : true;
      }),
    }),
    lunchDay("monday", "Pondělí"),
    lunchDay("tuesday", "Úterý"),
    lunchDay("wednesday", "Středa"),
    lunchDay("thursday", "Čtvrtek"),
    lunchDay("friday", "Pátek"),
  ],
  orderings: [{ title: "Od nejnovějšího týdne", name: "weekStartDesc", by: [{ field: "weekStart", direction: "desc" }] }],
  preview: {
    select: { weekStart: "weekStart" },
    prepare: ({ weekStart }) => {
      if (!weekStart) return { title: "Nový týden" };
      const thisMonday = mondayOf(pragueToday());
      const subtitle = weekStart === thisMonday ? "Tento týden" : weekStart === addDays(thisMonday, 7) ? "Příští týden" : weekStart < thisMonday ? "Proběhlo" : "Připraveno dopředu";
      return { title: formatLunchWeek(weekStart), subtitle };
    },
  },
});

export const lunchPrices = defineType({
  name: "lunchPrices",
  title: "Ceny obědů",
  type: "document",
  description: "Ceny platí pro všechny týdny. Když cenu necháte prázdnou, web ji nezobrazí.",
  fields: [
    defineField({ name: "soup", title: "Polévka (Kč)", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "dishA", title: "Jídlo A (Kč)", type: "number", initialValue: 159, validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "dishB", title: "Jídlo B (Kč)", type: "number", initialValue: 169, validation: (rule) => rule.integer().min(0) }),
  ],
  preview: { prepare: () => ({ title: "Ceny obědů" }) },
});
