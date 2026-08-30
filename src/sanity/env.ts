export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-12'

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  (process.env.NODE_ENV === "test"
    ? "production"
    : assertValue(
        process.env.NEXT_PUBLIC_SANITY_DATASET,
        "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
      ));

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  (process.env.NODE_ENV === "test"
    ? "dummy-project-id"
    : assertValue(
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
      ));

export const useCdn = false

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
