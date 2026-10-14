# Anti-UI-Slop & Human Editorial Invariants

Canonical rules to prevent AI coding agents from introducing generic "AI slop" or template anti-patterns into this repository.

## 1. The AI Slop Blacklist (Never Introduce)

1. **The 3-Column Feature Grid Cliché**:
   - Never put icons inside circular tinted badges (`rounded-full bg-accent/15 border border-accent/30`) for 3-column benefit cards.
   - Icons must be unencapsulated architectural line hallmarks (`strokeWidth={1.5}` or `1.75`), or paired with numbered specimen indexes (`01`, `02`).

2. **Eyebrow Tag Overdose & Word Stuttering**:
   - Never place an uppercase mono/sans eyebrow above a headline if it repeats words from the headline (e.g. `Trusted Brands` over `Authorized Brands`, or `Selected hardware` over `Selected Architectural Hardware`).
   - Eliminate redundant SaaS tags like `FAQ` over `Common questions.` or `Why [Company]` over the value proposition.

3. **Text Wrapping Traps**:
   - Always use `text-wrap: balance` (`text-balance` in Tailwind) on section headlines and large titles to eliminate orphan words and awkward line rags.
   - Always use `text-wrap: pretty` (`text-pretty` in Tailwind) on body text, quotes, and descriptions.

4. **Internal Link Tab Spawning & Full-Page Flashes**:
   - Never add `target="_blank"` or `rel="noopener noreferrer"` to internal routes (`/collections`, `/catalogues`, `/privacy`, `/terms`).
   - Never use raw `<a>` tags for internal links where Next.js client-side navigation (`<Link>`) should be used.
   - Never ship dead `#` anchor buttons with `target="_blank"`.

5. **Icon Stroke Weight Harmony**:
   - Normalize Lucide icons across showroom sections to refined architectural stroke weights (`strokeWidth={1.5}` or `1.75`).
   - Do not mix heavy default stroke width (2.0) with ultra-thin line art on the same screen.

6. **Corner Radius Alignment**:
   - Avoid random mixes of sharp rectangular buttons (`rounded-none`) next to pill-shaped touch targets (`rounded-full`).
   - Maintain pill geometry for CTAs and inputs, and refined `rounded-2xl` for structural card framing.

7. **Grounded Architectural Reality**:
   - Never replace concrete physical showroom details with abstract floating gradient blobs or generic filler copy ("Unlock seamless living").
   - Mention authentic materials (PVD satin brass, knurled rose gold, soft-close Blum/Häfele hinges) and physical showroom location (Sakchi, Jamshedpur).
