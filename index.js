import { getConfig } from '@nera-static/plugin-utils'
import path from 'path'

const CONFIG_PATH = path.resolve(
    process.cwd(),
    'config/social-media-links.yaml'
)
const config = getConfig(CONFIG_PATH) || {}

function getAppData(data) {
    if (!config?.social_media_links) {
        return data.app
    }

    return {
        ...data.app,
        socialMediaLinks: config.social_media_links,
    }
}

export { getAppData }
