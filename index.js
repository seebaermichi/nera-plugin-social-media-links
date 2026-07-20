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

function getAppData(data) {
    const config = getHostConfig()
    const links = config?.social_media_links

    if (!Array.isArray(links) || links.length === 0) {
        return data?.app ?? {}
    }

    return {
        ...data?.app,
        socialMediaLinks: links,
        socialMediaLinksLabel: config.aria_label || DEFAULT_ARIA_LABEL,
    }
}

export { getAppData }
