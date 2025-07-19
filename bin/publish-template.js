#!/usr/bin/env node

import { publishAllTemplates } from '@nera-static/plugin-utils'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get the expected package name from the current working directory
const cwd = process.cwd()
const packageJsonPath = path.join(cwd, 'package.json')

if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ No package.json found in current directory')
    process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const expectedPackageName = packageJson.name

const sourceDir = path.resolve(__dirname, '../views/')

const success = publishAllTemplates({
    pluginName: 'plugin-social-media-links',
    sourceDir,
    expectedPackageName,
})

process.exit(success ? 0 : 1)
