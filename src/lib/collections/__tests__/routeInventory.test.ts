import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Architectural gate: the public site has two content routes, `/` and
 * `/collections`. Categories live in the CMS and show as in-page sections, so no
 * page, link or navigation entry may point at `/collections/<slug>`. This is a
 * test rather than a convention because the failure is invisible in review —
 * every one of those links type-checks, lints and builds, and only 404s for a
 * visitor.
 */

const SRC = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

// A quote, backtick or `=` right before the path rules out import aliases such
// as "@/lib/collections/showroom". `$` after it catches template hrefs like
// `/collections/${slug}`, which is how the footer once built its links.
const SLUG_PATH = /(["'`=(\s])\/collections\/[a-z$]/;

describe("route inventory", () => {
  it("the slug-path pattern really does catch the shapes that caused the bug", () => {
    for (const bad of [
      'href="/collections/door-hardware"',
      "href: '/collections/handles-knobs',",
      "href={`/collections/${cat.slug}`}",
      'source: "/collections/digital-locks"',
    ]) {
      expect(SLUG_PATH.test(bad), bad).toBe(true);
    }
    for (const fine of [
      'import { x } from "@/lib/collections/showroom";',
      'href="/collections"',
      'href="/collections#door-entry"',
      "href={`/collections#${group.id}`}",
    ]) {
      expect(SLUG_PATH.test(fine), fine).toBe(false);
    }
  });

  it("has no dynamic route under /collections", () => {
    const dir = join(SRC, "app", "collections");
    const entries = readdirSync(dir);
    expect(entries.filter((e) => e.startsWith("[")), "dynamic segments").toEqual([]);
    expect(existsSync(join(dir, "page.tsx"))).toBe(true);
  });

  it("has no source file that links to /collections/<slug>", () => {
    const offenders = sourceFiles(SRC).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((line, i) => ({ line, n: i + 1 }))
        // Comments may describe the retired routes; code may not use them.
        .filter(({ line }) => !/^\s*(\/\/|\*|\/\*)/.test(line))
        .filter(({ line }) => SLUG_PATH.test(line))
        .map(({ n }) => `${relative(process.cwd(), file)}:${n}`)
    );
    expect(offenders).toEqual([]);
  });

  it("lists only /collections in the sitemap", () => {
    const sitemap = readFileSync(join(SRC, "app", "sitemap.ts"), "utf8");
    expect(sitemap).not.toMatch(SLUG_PATH);
  });
});
