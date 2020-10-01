const { getConfig } = require('../plugin-helper')

module.exports = (() => {
    const config = getConfig(`${__dirname}/config/social-media-links.yaml`)

    const getAppData = data => {
        data.app = Object.assign({}, data.app, {
            socialMediaLinks: config.social_media_links
        })

        return data.app
    }

    return {
        getAppData
    }
})()
