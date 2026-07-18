const brands = ['HAFELE', 'DORSET', 'LABACHA', 'HETTICH']

export function BrandStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10">
      {brands.map((brand, index) => (
        <div key={brand} className="flex items-center gap-x-6 sm:gap-x-10">
          <span className="font-serif text-xl font-bold tracking-wider text-foreground/90 sm:text-2xl">
            {brand}
          </span>
          {index < brands.length - 1 && (
            <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
