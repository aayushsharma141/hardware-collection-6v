'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, getDataset, getProjectId} from './src/content/sanity/env'
import {schema} from './src/content/sanity/schemaTypes'
import {structure} from './src/content/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId: getProjectId(),
  dataset: getDataset(),
  // Add and edit the content schema in the './src/content/sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({defaultApiVersion: apiVersion})]
      : []),
  ],
})
