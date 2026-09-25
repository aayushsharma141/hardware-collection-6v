export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-12'

export const useCdn = false

/**
 * Sanity project coordinates, resolved on first use rather than at module load.
 *
 * These used to be module-scope constants that called `assertValue()` and threw
 * when the environment variables were absent. Next.js evaluates every route
 * module while collecting page data, so that throw aborted `npm run build` on
 * any checkout without Sanity credentials — including CI — and took GATE-04 of
 * the release pipeline down with it, for a reason unrelated to code quality.
 *
 * Deferring the lookup moves the consequence to the first Sanity call, which is
 * where the codebase already handles it: every function in `queries.ts` wraps
 * `client.fetch` in a try/catch and returns empty, and the page then renders
 * from `src/content/fallback/`. An unconfigured deployment is the same
 * situation as an unreachable one, and the fallback layer exists precisely to
 * keep the site rendering through it.
 *
 * The trade-off is deliberate: a deployment that loses these variables now
 * serves fallback content and logs loudly on every request, rather than failing
 * the build. For a public showroom that is the better failure mode. If you would
 * rather have a hard stop, make these throw when `process.env.VERCEL_ENV` is
 * `"production"` — but do not make them throw at module scope again.
 */

const PLACEHOLDER_PROJECT_ID = 'missing-project-id'
const PLACEHOLDER_DATASET = 'production'

/** True when both coordinates came from the environment. */
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET
)

const warned = new Set<string>()

function resolve(name: string, value: string | undefined, placeholder: string): string {
  if (value) return value

  // `queries.ts` swallows fetch errors by design, so without this warning an
  // unconfigured deployment would serve fallback content in total silence.
  if (!warned.has(name) && process.env.NODE_ENV !== 'test') {
    warned.add(name)
    console.warn(
      `[sanity] ${name} is not set — falling back to "${placeholder}". ` +
        `Sanity reads will fail and the site will render from src/content/fallback/. ` +
        `Set ${name} in the environment to serve CMS content.`
    )
  }

  return placeholder
}

export function getProjectId(): string {
  return resolve(
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    PLACEHOLDER_PROJECT_ID
  )
}

export function getDataset(): string {
  return resolve(
    'NEXT_PUBLIC_SANITY_DATASET',
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    PLACEHOLDER_DATASET
  )
}
