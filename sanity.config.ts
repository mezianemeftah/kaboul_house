"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/lib/env";

export default defineConfig({
  basePath: "/admin",
  title: "Kaboul House",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: [] },
});
