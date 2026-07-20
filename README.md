# @nera-static/plugin-social-media-links

[![Test](https://github.com/seebaermichi/nera-plugin-social-media-links/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-plugin-social-media-links/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/plugin-social-media-links)](https://www.npmjs.com/package/@nera-static/plugin-social-media-links)

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator that creates social media link navigation with configurable icons and modern styling. Perfect for footer sections, sidebar widgets, or header navigation.

## ✨ Features

-   Configurable social media links with FontAwesome icons
-   BEM CSS methodology for consistent styling
-   Accessible markup with ARIA labels and semantic HTML
-   Template publishing system for easy customization
-   Modern FontAwesome 6.5.0 integration
-   Target="\_blank" and security attributes for external links
-   Lightweight and zero-runtime overhead
-   Full compatibility with Nera v4.1.0+

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-social-media-links
```

Nera will automatically detect the plugin and make social media links available via `app.socialMediaLinks`.

## ⚙️ Configuration

The plugin uses `config/social-media-links.yaml` to define your social media links:

```yaml
# Optional label for the <nav> element, read by screen readers.
aria_label: Social media

social_media_links:
    - name: Facebook
      href: https://facebook.com/yourpage
      icon: <i class="fab fa-facebook" aria-hidden="true"></i>
      icon_raw: true
    - name: LinkedIn
      href: https://linkedin.com/company/yourcompany
      icon: <i class="fab fa-linkedin" aria-hidden="true"></i>
      icon_raw: true
    - name: Instagram
      href: https://instagram.com/youraccount
      icon: <i class="fab fa-instagram" aria-hidden="true"></i>
      icon_raw: true
    - name: YouTube
      href: https://youtube.com/c/yourchannel
      icon: <i class="fab fa-youtube" aria-hidden="true"></i>
      icon_raw: true
    - name: GitHub
      href: https://github.com/yourusername
      icon: <i class="fab fa-github" aria-hidden="true"></i>
      icon_raw: true
```

Each social media link can include any attributes you need:

-   **`name`**: Display name for accessibility and labels
-   **`href`**: Full URL to your social media profile/page
-   **`icon`**: The icon to render. **Escaped by default** — see below
-   **`icon_raw`**: Set to `true` to inject `icon` as raw HTML instead of
    escaping it. Required for icon-font markup like the FontAwesome `<i>` tags
    above, and for inline SVG
-   **Additional attributes**: Any other properties you define will be available in the template

### Icons and escaping

`icon` is written into the page **escaped** unless the entry also sets
`icon_raw: true`. Without the opt-in, `<i class="fab fa-github"></i>` renders as
visible text rather than an icon.

The opt-in is per entry rather than global, so enabling raw HTML for one
trusted inline SVG does not silently unescape every other icon. Only set it for
values you author yourself — anything derived from external data should stay
escaped.

Versions before 2.1.0 injected every icon as raw HTML with no way to opt out.

## 🧩 Usage

### Access in your templates

The plugin makes social media links available via `app.socialMediaLinks`:

```pug
// Display social media links
if app.socialMediaLinks && app.socialMediaLinks.length > 0
    nav.social-media-links
        ul.social-media-links__list
            each link in app.socialMediaLinks
                li.social-media-links__item
                    a.social-media-links__link(href=link.href, title=link.name, target="_blank", rel="noopener noreferrer")
                        span.social-media-links__icon !{link.icon}
                        span.social-media-links__label #{link.name}
```

### Available data structure

Each item in the social media links contains:

```javascript
{
    name: "Facebook",
    href: "https://facebook.com/yourpage",
    icon: "<i class=\"fab fa-facebook\" aria-hidden=\"true\"></i>"
}
```

## 🛠️ Template Publishing

Use the templates provided by the plugin:

```bash
npx nera-social-media-links
```

This copies the templates to:

```
views/vendor/plugin-social-media-links/
├── social-media-links.pug
└── fontawesome-cdn-link.pug
```

Publishing **skips templates that already exist**, so your edits are safe. To
pull in newer versions and discard your local changes, use
`npx nera-social-media-links --force`.

The command is also available under its old name, `npx publish-template`, but
prefer the prefixed one — the generic name collides with any other package that
claims it.

You can then include them in your layouts. Include paths are relative to the
including file, so the `../` below assumes a layout in `views/layouts/`:

```pug
// Include social media links
include ../vendor/plugin-social-media-links/social-media-links

// Include FontAwesome CDN in head
head
    include ../vendor/plugin-social-media-links/fontawesome-cdn-link
```

### Template customization

You can customize the copied templates or create your own based on the data structure provided by `app.socialMediaLinks`.

## 🎨 BEM CSS Classes

The default template uses BEM (Block Element Modifier) methodology:

-   `.social-media-links` - Main navigation container
-   `.social-media-links__list` - Unordered list container
-   `.social-media-links__item` - Individual list item
-   `.social-media-links__link` - Social media link
-   `.social-media-links__icon` - Icon container span
-   `.social-media-links__label` - Text label span

## 🎯 Use Cases

### Footer Social Links

```pug
footer.site-footer
    include ../vendor/plugin-social-media-links/social-media-links
```

### Header Navigation

```pug
header.site-header
    nav.main-nav
        // Other navigation
    include ../vendor/plugin-social-media-links/social-media-links
```

### Sidebar Widget

```pug
aside.sidebar
    section.widget
        h3 Follow Us
        include ../vendor/plugin-social-media-links/social-media-links
```

## 🔗 FontAwesome Integration

The plugin includes a CDN link template for FontAwesome 6.5.0:

```pug
head
    include ../vendor/plugin-social-media-links/fontawesome-cdn-link
```

This adds the necessary CSS for FontAwesome icons with integrity checking and CORS protection.

## 🧪 Development

```bash
npm install
npm test
npm run lint
```

Tests are powered by [Vitest](https://vitest.dev) and cover:

-   Social media links data structure
-   Configuration parsing and validation
-   Template publishing logic and file operations
-   Error handling for missing configurations

### 🔄 Compatibility

-   **Nera v4.1.0+**: Full compatibility with latest static site generator
-   **Node.js 18+**: Modern JavaScript features and ES modules
-   **Plugin Utils v1.1.0+**: Enhanced plugin utilities integration
-   **FontAwesome 6.5.0+**: Latest icon library with modern icons

### 🏗️ Architecture

This plugin uses the `getAppData()` function to process configuration and make social media links available via `app.socialMediaLinks`. Links are configured via YAML and rendered with semantic HTML and accessibility features.

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

-   [Plugin Repository](https://github.com/seebaermichi/nera-plugin-social-media-links)
-   [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-social-media-links)
-   [Nera Static Site Generator](https://github.com/seebaermichi/nera)
-   [Plugin Documentation](https://github.com/seebaermichi/nera#plugins)
-   [FontAwesome Icons](https://fontawesome.com/icons)

## 📄 License

MIT
