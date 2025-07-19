import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Template publishing', () => {
    const testDir = path.resolve(__dirname, '../test-temp')
    const templatesDir = path.join(
        testDir,
        'views/vendor/plugin-social-media-links'
    )

    beforeEach(() => {
        // Create test directory structure
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true })
        }
        fs.mkdirSync(testDir, { recursive: true })

        // Create dummy package.json for test
        fs.writeFileSync(
            path.join(testDir, 'package.json'),
            JSON.stringify({ name: 'dummy' })
        )
    })

    afterEach(() => {
        // Clean up test directory
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true })
        }
    })

    it('publishes templates to the correct directory', async () => {
        // Change to test directory
        const originalCwd = process.cwd()
        process.chdir(testDir)

        try {
            // Import and run the publishing logic
            const { publishAllTemplates } = await import(
                '@nera-static/plugin-utils'
            )
            const sourceDir = path.resolve(__dirname, '../views/')

            const result = publishAllTemplates({
                pluginName: 'plugin-social-media-links',
                sourceDir,
                expectedPackageName: 'dummy',
            })

            expect(result).toBe(true)
            expect(fs.existsSync(templatesDir)).toBe(true)
            expect(
                fs.existsSync(path.join(templatesDir, 'social-media-links.pug'))
            ).toBe(true)
            expect(
                fs.existsSync(
                    path.join(templatesDir, 'fontawesome-cdn-link.pug')
                )
            ).toBe(true)
        } finally {
            process.chdir(originalCwd)
        }
    })

    it('skips publishing when templates already exist', async () => {
        // Change to test directory
        const originalCwd = process.cwd()
        process.chdir(testDir)

        try {
            // Create existing templates directory
            fs.mkdirSync(templatesDir, { recursive: true })
            const existingContent = 'existing content'
            fs.writeFileSync(
                path.join(templatesDir, 'social-media-links.pug'),
                existingContent
            )

            const { publishAllTemplates } = await import(
                '@nera-static/plugin-utils'
            )
            const sourceDir = path.resolve(__dirname, '../views/')

            const result = publishAllTemplates({
                pluginName: 'plugin-social-media-links',
                sourceDir,
                expectedPackageName: 'dummy',
            })

            // publishAllTemplates returns true but skips overwriting existing files
            expect(result).toBe(true)

            // Verify that existing content was not overwritten
            const content = fs.readFileSync(
                path.join(templatesDir, 'social-media-links.pug'),
                'utf8'
            )
            expect(content).toBe(existingContent)
        } finally {
            process.chdir(originalCwd)
        }
    })
})
