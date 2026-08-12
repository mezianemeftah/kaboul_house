import { Pill } from "@/components/ui/Pill";

export function WhatsAppBand({ whatsappHref }: { whatsappHref: string }) {
  return (
    <section className="bg-petrole px-sp-4 py-sp-6 text-blush md:px-sp-5 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="font-bonny text-4xl font-bold leading-[1.05] md:text-5xl">
          Une pièce vous fait de l&apos;œil ?
        </h2>
        <p className="mt-sp-3 max-w-xl font-light leading-relaxed opacity-90">
          Écrivez-nous sur WhatsApp : photos, dimensions, conseils, mise de côté — on s&apos;occupe
          de tout.
        </p>
        <div className="mt-sp-5">
          <Pill href={whatsappHref}>Nous écrire sur WhatsApp</Pill>
        </div>
      </div>
    </section>
  );
}
