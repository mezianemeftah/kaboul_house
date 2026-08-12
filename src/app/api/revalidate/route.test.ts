import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/revalidate", () => {
  const originalSecret = process.env.SANITY_REVALIDATE_SECRET;

  beforeEach(() => {
    // Un secret + une signature invalide (mauvais format) fait échouer la
    // vérification de signature de façon synchrone, sans le délai de 3s
    // que parseBody applique quand la signature pourrait être valide.
    process.env.SANITY_REVALIDATE_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = originalSecret;
  });

  it("renvoie 400 (pas 500) pour un corps JSON malformé, sans lever d'exception", async () => {
    const req = new NextRequest("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "sanity-webhook-signature": "not-a-valid-signature" },
      body: "{ceci n'est pas du json",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});
