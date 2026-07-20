#!/usr/bin/env node

import { publishAllTemplates } from '@nera-static/plugin-utils'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sourceDir = path.resolve(__dirname, '../views/')
const force = process.argv.includes('--force')

// No `expectedPackageName` is passed. This script used to read the host's own
// package.json and pass its name back in, which made validateNeraProject a
// tautology (pkg.name === pkg.name) and let templates be published into any
// directory at all. plugin-utils 1.2.0 validates the project *shape* instead.
const success = publishAllTemplates({
    pluginName: 'plugin-social-media-links',
    sourceDir,
    force,
})

process.exit(success ? 0 : 1)
