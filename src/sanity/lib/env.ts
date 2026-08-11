function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-08-01";
