"use client"

import { useEffect, useState } from "react"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function Countdown({ target }: { target: number }) {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft(target))
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time?.days ?? 0 },
    { label: "Hours", value: time?.hours ?? 0 },
    { label: "Minutes", value: time?.minutes ?? 0 },
    { label: "Seconds", value: time?.seconds ?? 0 },
  ]

  return (
    <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4" aria-label="Time until launch">
      {units.map((unit) => (
        <li
          key={unit.label}
          className="flex min-w-20 flex-col items-center rounded-xl border border-border bg-card px-4 py-4 sm:min-w-24 sm:px-6"
        >
          <span className="font-mono text-3xl font-semibold tabular-nums text-foreground sm:text-4xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {unit.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
