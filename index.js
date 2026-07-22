import { getConfig } from '@nera-static/plugin-utils'
import path from 'path'

const DEFAULT_ARIA_LABEL = 'Social media'

/**
 * Resolved per call rather than at module scope, so edits to
 * config/social-media-links.yaml are picked up without restarting
 * `npm run dev`.
 */
function getHostConfig() {
    return (
        getConfig(
            path.resolve(process.cwd(), 'config/social-media-links.yaml')
        ) || {}
    )
}

/**
 * A list entry must be a mapping for the template to read `href` off it. A
 * dangling `-` in the YAML parses to `null`, which used to reach the template
 * and fail the whole render with `Cannot read properties of null`.
 */
const isEntry = (entry) => entry !== null && typeof entry === 'object'

function getAppData(data) {
    const config = getHostConfig()
    const links = config?.social_media_links

    if (!Array.isArray(links)) {
        return data?.app ?? {}
    }

    const entries = links.filter(isEntry)

    if (entries.length === 0) {
        return data?.app ?? {}
    }

    return {
        ...data?.app,
        socialMediaLinks: entries,
        socialMediaLinksLabel: config.aria_label || DEFAULT_ARIA_LABEL,
    }
}

export { getAppData }
