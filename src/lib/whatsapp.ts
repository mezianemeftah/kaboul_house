/**
 * Lien WhatsApp cliquable à partir du numéro tel que saisi dans Sanity.
 * FR : un 0 initial est interprété comme un numéro français ; 00 comme préfixe international.
 */
export function whatsappUrl(phone: string | null | undefined): string {
  if (!phone) return "/boutiques";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "/boutiques";
  const normalized = digits.replace(/^00/, "").replace(/^0/, "33");
  return `https://wa.me/${normalized}`;
}
