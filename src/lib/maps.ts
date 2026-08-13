/**
 * Carte de localisation via le partage natif de Google Maps.
 *
 * Google Maps → Partager → Intégrer une carte → Copier le HTML : ce bloc ne
 * demande ni clé ni compte, contrairement au Maps Embed API. Le client colle le
 * bloc entier dans le back-office, on en extrait l'adresse.
 *
 * Le paramètre `pb` encode le lieu ET le cadrage. Impossible de le fabriquer
 * nous-mêmes à partir d'une adresse : il faut passer par l'interface de Google,
 * une fois par boutique.
 */

/** Hôte et chemin de l'embed officiel. Tout le reste est refusé. */
const EMBED_HOST = "www.google.com";
const EMBED_PATH = "/maps/embed";

/**
 * Adresse de la carte à intégrer, à partir de ce qui a été collé dans le
 * back-office — bloc `<iframe>` complet ou URL seule.
 *
 * Ce que renvoie cette fonction atterrit dans le `src` d'une iframe. Un champ
 * administrable étant une entrée comme une autre, on valide l'hôte et le chemin
 * plutôt que de faire confiance à la chaîne : sans ce garde-fou, une URL collée
 * de travers ferait charger n'importe quel site dans la page.
 */
export function googleMapsEmbedSrc(input: string | null | undefined): string | null {
  if (!input) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  // Le bloc de Google porte le src en guillemets doubles ; on tolère les simples.
  const match = trimmed.match(/src=["']([^"']+)["']/);
  const candidate = (match ? match[1] : trimmed).replace(/&amp;/g, "&");

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  // Comparaison sur l'hôte exact : un préfixe suffirait à laisser passer
  // « www.google.com.autre-domaine.test ».
  if (url.protocol !== "https:") return null;
  if (url.hostname !== EMBED_HOST) return null;
  if (url.pathname !== EMBED_PATH) return null;

  return url.toString();
}
