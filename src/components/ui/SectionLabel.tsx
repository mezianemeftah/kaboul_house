export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-sp-2 font-normal text-current">
      <span className="inline-block size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </p>
  );
}
