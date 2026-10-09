import { describe, it, expect } from "vitest";
import { compile } from "tailwindcss";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// The hero Prev/Next buttons: HeroStage on desktop, HeroMobile on phones.
const BUTTONS = [
  { file: "../HeroStage.tsx", labels: ["Previous specimen", "Next specimen"] },
  { file: "../HeroMobile.tsx", labels: ["Previous hero slide", "Next hero slide"] },
];

const PRESS = "motion-safe:active:scale-[0.97]";

function classNameFor(source: string, label: string): string {
  const match = source.match(new RegExp(`aria-label="${label}"\\s*className="([^"]+)"`));
  if (!match) throw new Error(`No button with aria-label "${label}"`);
  return match[1];
}

async function buildCss(candidates: string[]): Promise<string> {
  const require = createRequire(import.meta.url);
  const indexCss = readFileSync(require.resolve("tailwindcss/index.css"), "utf8");
  const compiler = await compile(
    `@layer theme, base, components, utilities; @import "tailwindcss/utilities.css" layer(utilities);`,
    {
      base: process.cwd(),
      loadStylesheet: async (_id, base) => ({ content: indexCss, base, path: "tailwindcss/index.css" }),
    }
  );
  return compiler.build(candidates);
}

describe("hero Prev/Next press feedback", () => {
  for (const { file, labels } of BUTTONS) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");

    for (const label of labels) {
      it(`${label}: scales on press only when motion is allowed`, () => {
        const cls = classNameFor(source, label);
        expect(cls).toContain(PRESS);
        // An unguarded active:scale-* would still move under reduced motion.
        expect(cls).not.toMatch(/(^|\s)active:scale-/);
      });

      it(`${label}: transitions scale, not every property`, () => {
        const cls = classNameFor(source, label);
        expect(cls).not.toMatch(/(^|\s)transition-all(\s|$)/);
        expect(cls).toMatch(/transition-\[[^\]]*\bscale\b[^\]]*\]/);
      });
    }
  }

  // Tailwind 4 scale utilities set the CSS `scale` property, not `transform`,
  // so a transition listing only `transform` would make the press snap.
  it("compiles the press to the scale property behind prefers-reduced-motion", async () => {
    const css = await buildCss([PRESS]);
    expect(css).toMatch(/prefers-reduced-motion:\s*no-preference/);
    expect(css).toMatch(/&:active\s*\{\s*scale:\s*0\.97;/);
    expect(css).not.toMatch(/transform:/);
  });

  it("compiles the transitions to include scale", async () => {
    const css = await buildCss(["transition-[color,scale]", "transition-[background-color,scale]"]);
    expect(css).toMatch(/transition-property:\s*color,\s*scale/);
    expect(css).toMatch(/transition-property:\s*background-color,\s*scale/);
  });
});
