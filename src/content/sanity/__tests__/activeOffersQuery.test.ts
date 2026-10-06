import { describe, it, expect } from "vitest";
import { parse, evaluate } from "groq-js";
import { ACTIVE_OFFERS_QUERY } from "../queries";

const NOW = new Date("2026-10-06T10:00:00Z");

const dataset = [
  { _id: "ongoing", _type: "offer", title: "Ongoing", _createdAt: "2026-01-01T00:00:00Z" },
  { _id: "future", _type: "offer", title: "Future", validUntil: "2026-11-15", _createdAt: "2026-01-02T00:00:00Z" },
  { _id: "today", _type: "offer", title: "Ends today", validUntil: "2026-10-06", _createdAt: "2026-01-03T00:00:00Z" },
  { _id: "expired", _type: "offer", title: "Expired", validUntil: "2026-10-05", _createdAt: "2026-01-04T00:00:00Z" },
  { _id: "off", _type: "offer", title: "Switched off", active: false, validUntil: "2026-12-01", _createdAt: "2026-01-05T00:00:00Z" },
  { _id: "other", _type: "product", title: "Not an offer" },
];

async function run() {
  const tree = parse(ACTIVE_OFFERS_QUERY);
  const result = await evaluate(tree, { dataset, timestamp: NOW });
  const rows = (await result.get()) as { _id: string }[];
  return rows.map((r) => r._id);
}

describe("ACTIVE_OFFERS_QUERY", () => {
  it("returns ongoing and future offers, including one that ends today", async () => {
    const ids = await run();
    expect(ids).toContain("ongoing");
    expect(ids).toContain("future");
    expect(ids).toContain("today");
  });

  it("drops expired offers, switched-off offers and other document types", async () => {
    const ids = await run();
    expect(ids).not.toContain("expired");
    expect(ids).not.toContain("off");
    expect(ids).not.toContain("other");
  });

  it("orders by soonest end date, ongoing last", async () => {
    expect(await run()).toEqual(["today", "future", "ongoing"]);
  });

  it("wraps now() in dateTime(); a bare now() makes the comparison null and hides every offer", () => {
    expect(ACTIVE_OFFERS_QUERY).toContain("dateTime(now())");
  });
});
