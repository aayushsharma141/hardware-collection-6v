import { Countdown } from "@/components/countdown"
import { NotifyForm } from "@/components/notify-form"

export default function Page() {
  // Launch date: 45 days from a fixed point so the countdown is meaningful
  const launchDate = new Date("2026-09-01T00:00:00Z").getTime()

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Header brand */}
      <header className="absolute top-0 left-0 flex w-full items-center justify-between px-6 py-6 sm:px-10">
        <span className="text-sm font-semibold tracking-tight text-foreground">Northwind</span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">2026</span>
      </header>

      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          Launching soon
        </span>

        <h1 className="text-balance font-serif text-5xl font-normal tracking-tight text-foreground sm:text-7xl">
          Something great is on the way
        </h1>

        <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
          {"We're putting the finishing touches on an experience worth waiting for. Be the first to know when we go live."}
        </p>

        <div className="mt-10">
          <Countdown target={launchDate} />
        </div>

        <div className="mt-10 flex w-full flex-col items-center gap-3">
          <NotifyForm />
          <p className="text-xs text-muted-foreground">No spam, just a single launch-day email.</p>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 w-full px-6 py-6 text-center text-xs text-muted-foreground sm:px-10">
        {"\u00A9"} 2026 Northwind. All rights reserved.
      </footer>
    </main>
  )
}
