import { ShieldCheck, Truck, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  icon: LucideIcon
  title: string
  subtitle: string
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Authorized Dealer',
    subtitle: 'Trusted Brands',
  },
  {
    icon: Truck,
    title: 'Same-Day Availability',
    subtitle: 'Fast & Reliable',
  },
  {
    icon: Users,
    title: '100+ Happy Customers',
    subtitle: 'Quality You Can Trust',
  },
]

export function FeatureBadges() {
  return (
    <ul className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-0">
      {features.map((feature, index) => (
        <li
          key={feature.title}
          className={`flex items-center gap-3 sm:flex-1 ${
            index > 0 ? 'sm:border-l sm:border-border sm:pl-6' : ''
          }`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy text-burgundy-foreground shadow-md">
            <feature.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase leading-tight tracking-wide text-foreground">
              {feature.title}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{feature.subtitle}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
