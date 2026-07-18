import { ChevronRight, MapPin, MessageCircle, Phone } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/919999999999'
const PHONE_URL = 'tel:+919999999999'
const DIRECTIONS_URL =
  'https://maps.google.com/?q=Hardware+Collection+Sakchi+Jamshedpur'

export function ContactCtas() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-gold to-gold/80 px-8 py-4 text-sm font-bold uppercase tracking-wide text-gold-foreground shadow-[0_0_30px_-8px] shadow-gold/60 transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Enquire on WhatsApp
        <ChevronRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </a>
      <a
        href={PHONE_URL}
        className="flex items-center justify-center gap-2.5 rounded-full border border-border bg-card px-8 py-4 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold/50 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <Phone className="h-5 w-5 text-gold" aria-hidden="true" />
        Call Us
      </a>
      <a
        href={DIRECTIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 rounded-full border border-border bg-card px-8 py-4 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold/50 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <MapPin className="h-5 w-5 text-gold" aria-hidden="true" />
        Get Directions
      </a>
    </div>
  )
}
