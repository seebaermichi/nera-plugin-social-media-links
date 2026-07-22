# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.1] - 2026-07-22

### Fixed

-   **a malformed config entry no longer fails the whole site build.** A
    dangling `-` in `social_media_links` parses to `null`, reached the template,
    and threw `Cannot read properties of null (reading 'href')` — a Pug stack
    trace naming the vendored template rather than the config file that caused
    it. Entries that are not mappings are now ignored, and a list containing
    only such entries is treated as no links at all
-   **the Usage snippet injected every icon as raw HTML.** It used
    `!{link.icon}` unconditionally, which is the pre-2.1.0 behaviour this
    README's own escaping section says was removed — copying it made `icon_raw`
    a no-op and unescaped every entry. It also omitted the `<nav>`'s
    `aria-label`. Both now match the shipped template
-   Compatibility block: Node.js was stated as 18+ against an `engines.node` of
    `>=20.0.0`, and `@nera-static/plugin-utils` as v1.1.0+ against a real
    dependency range of `^1.2.0`
-   "Publishing skips templates that already exist" described a per-file check;
    the skip is on the whole `views/vendor/plugin-social-media-links/`
    directory, so a template added by a later version is not delivered either

### Added

-   documentation for `aria_label` and `app.socialMediaLinksLabel`, both added
    in 2.1.0 and never described — the top-level config key was only visible as
    a comment inside the YAML example, and the `app` value it produces was
    absent entirely
-   documentation for `icon_raw` in the data-structure example
-   a statement that the plugin is inert without `config/social-media-links.yaml`,
    and that the config shipped in the package is documentation only
-   a `## 📊 Generated Output` section, a `## 🤝 Contributing` section, and a
    note that the BEM class names are a public contract
-   a callout that `--force` is what delivers a template change to an existing
    site

### Changed

-   the documented include form is now the root-absolute
    `include /vendor/plugin-social-media-links/…`, which resolves from any
    depth. It requires Nera v4.3.0+; the relative form is kept for older
    generators, with its directory-depth assumption stated
-   README structure aligned with the fleet standard: `## 🎨 Styling` heading,
    `## 🧩 Compatibility` promoted to a top-level section in canonical position,
    `## 📦 License`, single-space list bullets, and `npx vitest run` in the
    Development section instead of the watch-mode `npm test`

## [2.2.0] - 2026-07-21

### Changed

-   raised minimum Node from 18 to 20; Node 18 reached end-of-life on
    2025-04-30 and the dev toolchain requires Node 20+


## [2.1.0] - 2026-07-20

### Added

-   `nera-social-media-links` as a `bin` entry. The old generic
    `publish-template` name is **kept alongside it**, so nothing breaks, but it
    squatted that unscoped name in `node_modules/.bin/` where it collides with
    any other package doing the same. Prefer the prefixed name
-   `--force` flag, to re-publish templates over an existing
    `views/vendor/plugin-social-media-links/` and discard local edits
-   `icon_raw`, a per-entry opt-in for injecting an icon as raw HTML —
    **see the note below, this changes the default**
-   `aria_label` config key, rendered as the `<nav>` element's `aria-label` and
    defaulting to `Social media`. Multiple navigation landmarks on one page were
    previously indistinguishable to screen readers
-   a LICENSE file. The package declared MIT without shipping one

### Fixed

-   **`validateNeraProject` was a tautology.** `bin/publish-template.js` read the
    host's own `package.json` and passed its `name` straight back in as
    `expectedPackageName`, so the check was `pkg.name === pkg.name` and always
    passed. Verified: templates published happily into a directory whose package
    was named `definitely-not-a-nera-project`. The script now passes no override
    and relies on the project-shape validation from plugin-utils 1.2.0
-   config is read per invocation instead of at import time, so edits take
    effect during `npm run dev` without a restart
-   a `social_media_links` value that is absent, empty, or not a list is ignored
    instead of being passed through to the template
-   `getAppData` no longer throws when called without app data
-   the README's six template includes used `include /views/vendor/...`, which
    does not resolve: the generator sets pug's `basedir` to `views/`, so the
    leading `/views/` is doubled into `views/views/vendor/...`. Corrected to the
    relative `../vendor/...` form

### Changed

-   **`icon` is now escaped by default.** It was injected as raw HTML straight
    from YAML with no way to opt out. Set `icon_raw: true` on an entry to keep
    the old behaviour — required for the FontAwesome `<i>` markup the shipped
    config uses, which has been updated accordingly. The opt-in is per entry, so
    enabling raw HTML for one trusted inline SVG does not silently unescape
    every other icon
-   `@nera-static/plugin-utils` raised to `^1.2.0`
-   `eslint.config.js` no longer imports the undeclared `@eslint/js`
-   `vitest.config.js` drops the fleet-anomalous `testTimeout`
-   `CHANGELOG.md` and `LICENSE` are now included in the published package

### Migration Guide

**Check your icons if you re-publish templates.** This is treated as a minor
release rather than a major one because `publishTemplates` skips a destination
that already exists: a site that has already published its templates keeps its
vendored copy and renders exactly as before, so it cannot regress.

But if you re-publish with `--force`, or publish for the first time, the new
template escapes `icon` by default. Any entry whose icon is HTML — which is all
of them if you copied the shipped config — needs `icon_raw: true` added, or the
markup will render as visible text:

```yaml
social_media_links:
    - name: GitHub
      href: https://github.com/yourusername
      icon: <i class="fab fa-github" aria-hidden="true"></i>
      icon_raw: true # <- add this
```

## [2.0.0] - 2025-07-19

### Breaking Changes

-   **ES Module Migration**: Plugin now uses ES modules instead of CommonJS
-   **Node.js 18+ Required**: Updated minimum Node.js version to 18
-   **New Package Name**: Published as `@nera-static/plugin-social-media-links`
-   **Plugin Architecture**: Uses `getAppData()` instead of legacy plugin helper

### Added

-   🎨 **BEM CSS Methodology**: Template uses semantic CSS classes (`.social-media-links__item`, etc.)
-   🧪 **Comprehensive Test Suite**: 9 tests covering functionality and template publishing
-   📦 **Template Publishing System**: `npx @nera-static/plugin-social-media-links run publish-template`
-   🔧 **Modern Development Tooling**: ESLint v9.31.0, Vitest, Husky git hooks
-   ♿ **Accessibility Features**: ARIA labels, semantic HTML structure, screen reader support
-   🔒 **Security Attributes**: `target="_blank"` with `rel="noopener noreferrer"`
-   📚 **Enhanced Documentation**: Complete README with usage examples and BEM classes
-   🎯 **Modern Icons**: Updated to FontAwesome 6.5.0 with latest social media icons

### Changed

-   **Configuration Structure**: Enhanced YAML configuration with better examples
-   **Template Structure**: Semantic HTML with `<nav>`, `<ul>`, and proper accessibility
-   **Icon Integration**: Modern FontAwesome icons with ARIA attributes
-   **Error Handling**: Graceful handling of missing configurations
-   **Package Metadata**: Updated keywords, description, and repository information

### Technical

-   **Plugin Utils Integration**: Uses `@nera-static/plugin-utils` v1.1.0
-   **ES2024 Compatibility**: Modern JavaScript features and syntax
-   **Nera v4.1.0+ Support**: Full compatibility with latest static site generator
-   **Type Safety**: Better error handling and configuration validation

### Migration Guide

#### From v1.x to v2.0.0

1. **Update Installation**:

    ```bash
    npm uninstall social-media-links
    npm install @nera-static/plugin-social-media-links
    ```

2. **Update Configuration** (config/social-media-links.yaml):

    ```yaml
    # OLD (v1.x)
    social_media_links:
      - name: facebook
        href: https://facebook.com
        icon: <i class="fab fa-facebook-square"></i>

    # NEW (v2.0.0)
    social_media_links:
      - name: Facebook
        href: https://facebook.com/yourpage
        icon: <i class="fab fa-facebook" aria-hidden="true"></i>
    ```

3. **Update Templates**:

    ```pug
    // OLD (v1.x)
    each link in app.socialMediaLinks
        a(href=link.href) !{link.icon}

    // NEW (v2.0.0) - Use published templates or:
    if app.socialMediaLinks && app.socialMediaLinks.length > 0
        nav.social-media-links
            ul.social-media-links__list
                each link in app.socialMediaLinks
                    li.social-media-links__item
                        a.social-media-links__link(href=link.href, title=link.name, target="_blank", rel="noopener noreferrer")
                            span.social-media-links__icon !{link.icon}
                            span.social-media-links__label #{link.name}
    ```

4. **Node.js Requirement**: Ensure Node.js 18+ is installed

## [1.x] - Previous Versions

### Features

-   Basic social media links generation
-   FontAwesome icon integration
-   YAML configuration system
-   Pug template support

[2.0.0]: https://github.com/seebaermichi/nera-plugin-social-media-links/compare/v1.0.0...v2.0.0
