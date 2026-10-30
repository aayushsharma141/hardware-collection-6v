import { describe, expect, it } from "vitest";
import { buildOpeningHoursSpecification } from "../openingHours";

describe("buildOpeningHoursSpecification", () => {
  it("expands a wrapping weekday range and groups matching hours", () => {
    expect(buildOpeningHoursSpecification("Wed–Mon: 10:00 AM – 8:00 PM\nTuesday: 10:00 AM – 2:00 PM")).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday"],
        opens: "10:00",
        closes: "14:00",
      },
    ]);
  });

  it("accepts 24-hour times and skips malformed or incomplete lines", () => {
    expect(buildOpeningHoursSpecification("Mon-Sat: 10:00 - 20:00\nSunday: closed\nNoday: 10 AM - 8 PM")).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "20:00",
      },
    ]);
  });

  it("does not invent hours when the CMS value is missing", () => {
    expect(buildOpeningHoursSpecification(null)).toEqual([]);
    expect(buildOpeningHoursSpecification("")).toEqual([]);
  });
});
