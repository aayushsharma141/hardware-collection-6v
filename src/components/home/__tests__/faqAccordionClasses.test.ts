import { describe, it, expect } from "vitest";
import { compile } from "tailwindcss";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const source = readFileSync(new URL("../FaqSection.tsx", import.meta.url), "utf8");

// The classes FaqSection uses to open and close each answer panel.
const OPEN_CLOSE = ["grid-rows-[1fr]", "grid-rows-[0fr]"];
const TRANSITION = ["transition-[grid-template-rows,opacity]", "duration-350"];

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

describe("FAQ accordion classes", () => {
  it("does not use the grid-template-rows-[...] utility, which Tailwind 4 does not generate", () => {
    expect(source).not.toMatch(/grid-template-rows-\[/);
  });

  it("uses the open and closed row classes the component relies on", () => {
    for (const cls of OPEN_CLOSE) expect(source, cls).toContain(cls);
  });

  it("compiles the open and closed states to grid-template-rows values", async () => {
    const css = await buildCss(OPEN_CLOSE);
    expect(css).toContain("grid-template-rows: 1fr");
    expect(css).toContain("grid-template-rows: 0fr");
  });

  it("compiles the transition so the rows animate, not every property", async () => {
    const css = await buildCss(TRANSITION);
    expect(css).toMatch(/transition-property:\s*grid-template-rows,\s*opacity/);
    expect(css).toContain("transition-duration: 350ms");
  });
});
