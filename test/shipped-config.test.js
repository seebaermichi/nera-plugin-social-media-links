import { describe, it, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import { getConfig } from '@nera-static/plugin-utils'

// `nera add social-media-links` copies this file into a site that has none.
// Active placeholder accounts would render dead links on every page.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const shipped = getConfig(
    path.join(__dirname, '../config/social-media-links.yaml')
)

describe('shipped config/social-media-links.yaml', () => {
    it('lists no placeholder links', () => {
        expect(shipped).not.toHaveProperty('social_media_links')
    })
})
