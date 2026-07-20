import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const REPO_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
)
const SCRIPT_PATH = path.join(REPO_ROOT, 'bin/publish-template.js')
const SOURCE_DIR = path.join(REPO_ROOT, 'views')
const TEMPLATES = ['social-media-links.pug', 'fontawesome-cdn-link.pug']

// Runs the real bin script, so it also covers the argument parsing and the
// validation the script actually performs — which is the point, given that
// validation used to be a tautology.
let testDir
let templatesDir

const run = (...args) =>
    execFileSync('node', [SCRIPT_PATH, ...args], {
        cwd: testDir,
        stdio: 'pipe',
    }).toString()

beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-social-publish-'))
    templatesDir = path.join(testDir, 'views/vendor/plugin-social-media-links')

    // A real Nera project shape, which is what validateNeraProject checks for
    // as of plugin-utils 1.2.0 (D4).
    fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify({ name: 'my-site' })
    )
    fs.mkdirSync(path.join(testDir, 'config'), { recursive: true })
    fs.writeFileSync(path.join(testDir, 'config/app.yaml'), 'lang: en\n')
    fs.mkdirSync(path.join(testDir, 'pages'), { recursive: true })
})

afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true })
})

describe('Template publishing', () => {
    it('publishes every template to the correct directory', () => {
        run()

        for (const file of TEMPLATES) {
            expect(fs.existsSync(path.join(templatesDir, file))).toBe(true)
        }
    })

    it('ships every template it publishes', () => {
        for (const file of TEMPLATES) {
            expect(fs.existsSync(path.join(SOURCE_DIR, file))).toBe(true)
        }
    })

    it('skips publishing when templates already exist', () => {
        fs.mkdirSync(templatesDir, { recursive: true })
        const target = path.join(templatesDir, 'social-media-links.pug')
        fs.writeFileSync(target, 'mine')

        expect(run()).toMatch(/Skipping/i)
        expect(fs.readFileSync(target, 'utf8')).toBe('mine')
    })

    it('overwrites existing templates when --force is passed', () => {
        fs.mkdirSync(templatesDir, { recursive: true })
        const target = path.join(templatesDir, 'social-media-links.pug')
        fs.writeFileSync(target, 'mine')

        run('--force')

        expect(fs.readFileSync(target, 'utf8')).toBe(
            fs.readFileSync(
                path.join(SOURCE_DIR, 'social-media-links.pug'),
                'utf8'
            )
        )
    })

    it('refuses to publish outside a Nera project', () => {
        // The old bin passed the host's own package name as
        // expectedPackageName, so this check was `pkg.name === pkg.name` and
        // templates could be published into any directory at all.
        fs.rmSync(path.join(testDir, 'config/app.yaml'))
        fs.rmSync(path.join(testDir, 'pages'), { recursive: true })
        fs.writeFileSync(
            path.join(testDir, 'package.json'),
            JSON.stringify({ name: 'definitely-not-a-nera-project' })
        )

        expect(() => run()).toThrow()
        expect(fs.existsSync(templatesDir)).toBe(false)
    })
})
