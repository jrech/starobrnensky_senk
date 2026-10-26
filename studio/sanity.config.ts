import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { csCZLocale } from "@sanity/locale-cs-cz";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "starobrnensky-senk",
  title: "Starobrněnský Šenk",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "6yiqg6vd",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({
    structure: (S) => {
      const singleton = (title: string, schemaType: string) => S.listItem()
        .title(title)
        .child(S.document().schemaType(schemaType).documentId(schemaType));
      return S.list()
        .title("Obsah webu")
        .items([
          singleton("Stav provozu", "operatingStatus"),
          S.listItem()
            .title("Obědové menu")
            .child(S.documentTypeList("lunchWeek")
              .title("Obědové menu · týdny")
              .defaultOrdering([{ field: "weekStart", direction: "desc" }])),
          singleton("Ceny obědů", "lunchPrices"),
          S.divider(),
          singleton("Jídelní lístek", "foodMenu"),
          singleton("Nápojový lístek", "drinkMenu"),
          S.divider(),
          singleton("Rumy", "rumMenu"),
          singleton("Speciality", "specialtyMenu"),
        ]);
    },
  }), visionTool(), csCZLocale()],
  schema: { types: schemaTypes },
  document: {
    // Only weekly lunch menus are created by hand; everything else is a single fixed document.
    newDocumentOptions: (previous, { creationContext }) => creationContext.type === "global" ? previous.filter(({ templateId }) => templateId === "lunchWeek") : previous,
  },
});
