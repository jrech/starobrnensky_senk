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
    structure: (S) => S.list()
      .title("Obsah webu")
      .items([
        S.listItem()
          .title("Obsah webu")
          .child(S.list()
            .title("Obsah webu")
            .items([
              S.listItem()
                .title("Stav provozu")
                .child(S.document().schemaType("operatingStatus").documentId("operatingStatus")),
              S.listItem()
                .title("Obědové menu")
                .child(S.document().schemaType("lunchMenu").documentId("lunchMenu")),
              S.listItem()
                .title("Jídelní lístek")
                .child(S.document().schemaType("foodMenu").documentId("foodMenu")),
              S.listItem()
                .title("Nápojový lístek")
                .child(S.document().schemaType("drinkMenu").documentId("drinkMenu")),
            ])),
      ]),
  }), visionTool(), csCZLocale()],
  schema: { types: schemaTypes },
});
