const DAYS = [
  { name: "Monday", short: "Mon" },
  { name: "Tuesday", short: "Tue" },
  { name: "Wednesday", short: "Wed" },
  { name: "Thursday", short: "Thu" },
  { name: "Friday", short: "Fri" },
  { name: "Saturday", short: "Sat" },
  { name: "Sunday", short: "Sun" },
] as const;

type DayName = (typeof DAYS)[number]["name"];

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: DayName[];
  opens: string;
  closes: string;
}

function parseTime(value: string): string | null {
  const input = value.trim().toUpperCase().replace(/\./g, "");
  const ampm = /\s*(AM|PM)$/.exec(input)?.[1];
  const clock = input.replace(/\s*(AM|PM)$/, "");
  const match = /^(\d{1,2})(?::(\d{2}))?$/.exec(clock);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "00");
  if (minutes > 59 || hours > 24 || (ampm && (hours < 1 || hours > 12))) return null;
  if (ampm) {
    if (hours === 12) hours = 0;
    if (ampm === "PM") hours += 12;
  }
  if (hours > 23 && !(hours === 24 && minutes === 0)) return null;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function resolveDay(token: string): number | null {
  const normalized = token.trim().toLowerCase().slice(0, 3);
  const index = DAYS.findIndex((day) => day.short.toLowerCase() === normalized);
  return index < 0 ? null : index;
}

function expandDays(value: string): DayName[] {
  const range = /^\s*([a-zA-Z]+)\s*(?:–|—|-)\s*([a-zA-Z]+)\s*$/.exec(value);
  if (range) {
    const start = resolveDay(range[1]);
    const end = resolveDay(range[2]);
    if (start === null || end === null) return [];
    const result: DayName[] = [];
    for (let index = start, guard = 0; guard < 7; guard += 1, index = (index + 1) % 7) {
      result.push(DAYS[index].name);
      if (index === end) break;
    }
    return result;
  }

  return [...new Set(value.split(/,|\band\b|&/i).map(resolveDay).filter((day): day is number => day !== null))]
    .map((day) => DAYS[day].name);
}

/**
 * Converts the editor-owned, human-readable showroomHours field into Schema.org
 * OpeningHoursSpecification. Unsupported or incomplete lines are skipped rather
 * than publishing invented hours. Expected format: "Mon-Sat: 10:00 AM - 8:00 PM".
 */
export function buildOpeningHoursSpecification(value?: string | null): OpeningHoursSpecification[] {
  if (!value?.trim()) return [];

  const grouped = new Map<string, Set<DayName>>();
  for (const line of value.split(/\r?\n/)) {
    const match = /^\s*(.+?)\s*:\s*(.+?)\s*(?:–|—|-)\s*(.+?)\s*$/.exec(line);
    if (!match) continue;

    const days = expandDays(match[1]);
    const opens = parseTime(match[2]);
    const closes = parseTime(match[3]);
    if (!days.length || !opens || !closes || opens >= closes) continue;

    const key = `${opens}-${closes}`;
    const set = grouped.get(key) ?? new Set<DayName>();
    days.forEach((day) => set.add(day));
    grouped.set(key, set);
  }

  return [...grouped.entries()].map(([hours, days]) => {
    const [opens, closes] = hours.split("-");
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAYS.map((day) => day.name).filter((day) => days.has(day)),
      opens,
      closes,
    };
  });
}
