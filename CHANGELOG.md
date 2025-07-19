# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
