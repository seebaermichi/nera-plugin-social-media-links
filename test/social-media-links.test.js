import fs from 'fs'
import os from 'os'
import path from 'path'
import pug from 'pug'
import { fileURLToPath } from 'url'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { getAppData } from '../index.js'

const REPO_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
)
const TEMPLATE = path.join(REPO_ROOT, 'views/social-media-links.pug')

// The suite runs in a temp cwd and writes its own config. It used to rely on
// the package's own config/social-media-links.yaml sitting at the repo root —
// a file no real consumer has, since the shipped config is documentation only.
let tmpDir
let originalCwd

const CONFIG_YAML = `
social_media_links:
  - name: Facebook
    href: https://facebook.com/yourpage
    icon: <i class="fab fa-facebook" aria-hidden="true"></i>
    icon_raw: true
  - name: GitHub
    href: https://github.com/yourusername
    icon: <i class="fab fa-github" aria-hidden="true"></i>
    icon_raw: true
`

const configPath = () => path.join(tmpDir, 'config/social-media-links.yaml')

const writeConfig = (yaml) => fs.writeFileSync(configPath(), yaml)
const removeConfig = () => fs.rmSync(configPath(), { force: true })

const render = (app) => pug.renderFile(TEMPLATE, { app })

beforeAll(() => {
    originalCwd = process.cwd()
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-social-'))
    fs.mkdirSync(path.join(tmpDir, 'config'), { recursive: true })
    process.chdir(tmpDir)
})

afterAll(() => {
    process.chdir(originalCwd)
    fs.rmSync(tmpDir, { recursive: true, force: true })
})

beforeEach(() => {
    writeConfig(CONFIG_YAML)
})

describe('Social Media Links Plugin', () => {
    const mockAppData = () => ({ app: { title: 'Test Site' } })

    it('should add social media links to app data', () => {
        const result = getAppData(mockAppData())

        expect(Array.isArray(result.socialMediaLinks)).toBe(true)
        expect(result.socialMediaLinks).toHaveLength(2)
    })

    it('should preserve existing app data', () => {
        expect(getAppData(mockAppData()).title).toBe('Test Site')
    })

    it('should include required properties for each social media link', () => {
        getAppData(mockAppData()).socialMediaLinks.forEach((link) => {
            expect(typeof link.name).toBe('string')
            expect(typeof link.href).toBe('string')
            expect(typeof link.icon).toBe('string')
        })
    })

    it('should handle missing config gracefully', () => {
        // Previously this test never removed the config, so it asserted
        // nothing. It now genuinely exercises the missing-file path.
        removeConfig()

        const result = getAppData(mockAppData())

        expect(result).toEqual({ title: 'Test Site' })
        expect(result).not.toHaveProperty('socialMediaLinks')
    })

    it('ignores a config with an empty link list', () => {
        writeConfig('social_media_links: []\n')

        expect(getAppData(mockAppData())).not.toHaveProperty('socialMediaLinks')
    })

    it('ignores a config where social_media_links is not a list', () => {
        writeConfig('social_media_links: nope\n')

        expect(getAppData(mockAppData())).not.toHaveProperty('socialMediaLinks')
    })

    it('tolerates being called without app data', () => {
        expect(() => getAppData({})).not.toThrow()
        expect(() => getAppData()).not.toThrow()
    })

    it('picks up a config change without a restart', () => {
        expect(getAppData(mockAppData()).socialMediaLinks).toHaveLength(2)

        writeConfig(
            'social_media_links:\n  - name: Only\n    href: https://example.com\n'
        )

        expect(getAppData(mockAppData()).socialMediaLinks).toHaveLength(1)
    })
})

describe('aria label', () => {
    it('defaults to "Social media"', () => {
        expect(getAppData({ app: {} }).socialMediaLinksLabel).toBe(
            'Social media'
        )
    })

    it('can be overridden from config', () => {
        writeConfig(`aria_label: Follow us\n${CONFIG_YAML}`)

        expect(getAppData({ app: {} }).socialMediaLinksLabel).toBe('Follow us')
    })

    it('is rendered onto the nav element', () => {
        const html = render(getAppData({ app: {} }))

        expect(html).toContain(
            '<nav class="social-media-links" aria-label="Social media">'
        )
    })
})

describe('icon escaping', () => {
    it('escapes an icon value by default', () => {
        writeConfig(
            'social_media_links:\n  - name: Evil\n    href: https://example.com\n    icon: <script>alert(1)</script>\n'
        )

        const html = render(getAppData({ app: {} }))

        expect(html).not.toContain('<script>alert(1)</script>')
        expect(html).toContain('&lt;script&gt;')
    })

    it('injects raw HTML only when icon_raw is set', () => {
        const html = render(getAppData({ app: {} }))

        expect(html).toContain('<i class="fab fa-facebook" aria-hidden="true">')
    })

    it('escapes an entry that omits icon_raw alongside one that sets it', () => {
        writeConfig(
            [
                'social_media_links:',
                '  - name: Trusted',
                '    href: https://a.example',
                '    icon: <i class="fab fa-github"></i>',
                '    icon_raw: true',
                '  - name: Untrusted',
                '    href: https://b.example',
                '    icon: <img src=x onerror=alert(1)>',
            ].join('\n')
        )

        const html = render(getAppData({ app: {} }))

        // Enabling raw for one entry must not unescape the others.
        expect(html).toContain('<i class="fab fa-github">')
        expect(html).not.toContain('<img src=x')
        expect(html).toContain('&lt;img src=x')
    })

    it('renders nothing when there are no links', () => {
        removeConfig()

        expect(render(getAppData({ app: {} }))).toBe('')
    })
})
