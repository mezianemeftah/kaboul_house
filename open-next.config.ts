import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import kvTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// Cache sur Workers KV plutôt que R2 : R2 exige une carte bancaire sur le compte
// Cloudflare, même dans les limites gratuites. KV suffit très largement ici
// (les écritures n'ont lieu qu'à la publication d'un contenu Sanity).
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: kvTagCache,
  queue: doQueue,
});
