"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/lib/env";
import { SINGLETON_TYPES, schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

const singletons = new Set<string>(SINGLETON_TYPES);

export default defineConfig({
  basePath: "/admin",
  title: "Kaboul House",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !singletons.has(t.schemaType)),
  },
  document: {
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter((a) => !["unpublish", "delete", "duplicate"].includes(a.action ?? ""))
        : actions,
  },
});
