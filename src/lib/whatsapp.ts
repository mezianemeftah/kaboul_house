/** Lien WhatsApp cliquable à partir du numéro tel que saisi dans Sanity. */
export function whatsappUrl(phone: string | null | undefined): string {
  if (!phone) return "/boutiques";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "/boutiques";
  return `https://wa.me/${digits.replace(/^0/, "33")}`;
}
