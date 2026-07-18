"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function NotifyForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground">
        <Check className="size-4 text-primary" aria-hidden="true" />
        <span>{"You're on the list. We'll be in touch."}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="h-11 flex-1 rounded-full border border-input bg-card px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button type="submit" className="h-11 rounded-full px-6">
        Notify me
      </Button>
    </form>
  )
}
