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
      .title("Starobrněnský Šenk")
      .items([
        S.listItem()
          .title("Obsah webu")
          .child(S.document().schemaType("siteContent").documentId("siteContent")),
      ]),
  }), visionTool()],
  schema: { types: schemaTypes },
});
