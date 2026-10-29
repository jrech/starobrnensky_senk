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
          singleton("Obědové menu", "lunchMenu"),
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
    // Every document is a fixed single one opened from the list, so nothing is created by hand.
    newDocumentOptions: (previous, { creationContext }) => creationContext.type === "global" ? [] : previous,
  },
});
