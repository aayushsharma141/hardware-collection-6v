export function HcLogo({ className }: { className?: string }) {
  return (
    <div className={className} aria-label="Hardware Collection logo">
      <div className="flex items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-muted-foreground/30 to-background shadow-lg sm:h-20 sm:w-20">
          <span className="font-serif text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
            H
            <span className="text-gold">C</span>
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="font-serif text-xl font-bold uppercase tracking-[0.15em] text-foreground sm:text-2xl">
          Hardware Collection
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
            Sakchi, Jamshedpur
          </p>
          <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
