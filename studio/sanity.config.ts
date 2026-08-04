import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "starobrnensky-senk",
  title: "Starobrnenský Šenk",
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
            ])),
      ]),
  }), visionTool()],
  schema: { types: schemaTypes },
});
