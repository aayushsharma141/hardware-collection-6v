import { MapPin, Tag } from 'lucide-react'
import { HcLogo } from '@/components/hc-logo'
import { FeatureBadges } from '@/components/feature-badges'
import { ContactCtas } from '@/components/contact-ctas'
import { BrandStrip } from '@/components/brand-strip'

export default function Page() {
  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/lock-hero.png"
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70"
          aria-hidden="true"
        />
      </div>

      {/* Launching soon ribbon */}
      <div className="absolute right-6 top-0 z-20 sm:right-12">
        <div className="relative flex flex-col items-center bg-gradient-to-b from-burgundy to-burgundy/70 px-5 pb-8 pt-5 text-center shadow-xl [clip-path:polygon(0_0,100%_0,100%_100%,50%_88%,0_100%)]">
          <p className="text-xs font-bold uppercase leading-tight tracking-[0.2em] text-burgundy-foreground">
            Website
            <br />
            Launching
            <br />
            Soon
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col items-center px-6 py-12 sm:py-16">
        <HcLogo className="w-full" />

        <div className="mt-10 w-full max-w-3xl">
          <h1 className="text-balance text-center font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-left sm:text-7xl">
            Premium Hardware{' '}
            <span className="block text-gold sm:inline">&amp; Digital Locks</span>
          </h1>

          <div
            className="mx-auto mt-5 h-0.5 w-24 rounded-full bg-gold sm:mx-0"
            aria-hidden="true"
          />

          <p className="mt-6 text-pretty text-center text-lg leading-relaxed text-muted-foreground sm:text-left">
            Authorized Dealer for{' '}
            <span className="font-semibold text-foreground">
              Hafele, Dorset, Labacha &amp; Hettich
            </span>{' '}
            in Sakchi, Jamshedpur.
          </p>
        </div>

        <div className="mt-10 w-full max-w-4xl">
          <FeatureBadges />
        </div>

        <div className="mt-10 flex w-full max-w-4xl items-center justify-center gap-3 rounded-full border border-gold/40 bg-gold/5 px-6 py-3.5">
          <Tag className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          <p className="text-center text-xs font-bold uppercase tracking-wide text-gold sm:text-sm">
            Special Pricing for Early Enquiries Prior to Full Launch
          </p>
        </div>

        <div className="mt-8 w-full max-w-4xl">
          <ContactCtas />
        </div>

        <div className="mt-12 w-full border-t border-border pt-8">
          <BrandStrip />
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-center">
          <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            1/18, Kashidih, near Baradwari Durga Puja Maidan, Sakchi, Jamshedpur - 831001
          </p>
        </div>
      </div>
    </main>
  )
}
