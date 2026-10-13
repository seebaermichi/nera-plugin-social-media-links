# @nera-static/plugin-social-media-links

[![Test](https://github.com/seebaermichi/nera-plugin-social-media-links/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-plugin-social-media-links/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/plugin-social-media-links)](https://www.npmjs.com/package/@nera-static/plugin-social-media-links)

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator that creates social media link navigation with configurable icons and modern styling. Perfect for footer sections, sidebar widgets, or header navigation.

📖 **Documentation:** [nera.js.org](https://nera.js.org)

## ✨ Features

- Configurable social media links with icons (inline SVG, an icon font, or text)
- BEM CSS methodology for consistent styling
- Accessible markup with a configurable `aria-label` and semantic HTML
- Icons escaped by default, with a per-entry opt-in for raw HTML
- Template publishing system for easy customization
- Works with inline SVG icons, a self-hosted icon font, or plain text — no third-party request needed
- Links open in a new tab by default (`open_in_new_tab`), always with `rel="noopener noreferrer"`
- Lightweight and zero-runtime overhead

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-social-media-links
```

Nera will automatically detect the plugin and make social media links available via `app.socialMediaLinks`.

## ⚙️ Configuration

Create `config/social-media-links.yaml` **in your own project** to define your
links. The copy shipped inside the package is documentation only — Nera reads
config from your site's `config/` folder and does not merge the two.

Without that file the plugin does nothing: it leaves `app` untouched, no
`app.socialMediaLinks` is set, and the shipped template renders nothing. The
same is true if the list is empty or is not a list.

```yaml
# Optional label for the <nav> element, read by screen readers.
aria_label: Social media

# Optional; links open in a new tab unless this is false.
open_in_new_tab: false

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

### Top-level keys

- **`aria_label`**: Label for the `<nav>` element, exposed to templates as
  `app.socialMediaLinksLabel`. Defaults to `Social media`. Set it when a page
  has more than one navigation landmark
- **`open_in_new_tab`**: `true` (the default) renders every link with
  `target="_blank"`; `false` opens them in the same tab. Exposed as
  `app.socialMediaLinksNewTab`. Same-tab is the accessible choice — the
  visitor decides, and the Back button keeps working — and it is what
  `nera check`'s `a11y-target-blank` rule asks for. `rel="noopener noreferrer"`
  is rendered either way
- **`social_media_links`**: The list of links. Entries that are not mappings —
  a dangling `-` in the YAML, for instance — are ignored

### Per-entry keys

- **`name`**: Display name, used for the link's `title` and visible label
- **`href`**: Full URL to your social media profile/page
- **`icon`**: The icon to render. **Escaped by default** — see below
- **`icon_raw`**: Set to `true` to inject `icon` as raw HTML instead of
  escaping it. Required for icon-font markup like the FontAwesome `<i>` tags
  above, and for inline SVG
- **Additional attributes**: Any other properties you define are passed through
  to `app.socialMediaLinks` unchanged, so a template **you** write can use
  them. The shipped template renders only `href`, `title`, the icon and the
  label, and ignores everything else

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

The simplest route is to publish the shipped template and include it — see
[Template Publishing](#️-template-publishing).

### Access in your templates

If you write your own markup instead, the plugin exposes `app.socialMediaLinks`
and `app.socialMediaLinksLabel`. Mirror the escaping branch, or `icon_raw` has
no effect and every icon is injected as raw HTML:

```pug
if app.socialMediaLinks && app.socialMediaLinks.length > 0
    nav.social-media-links(aria-label=app.socialMediaLinksLabel || 'Social media')
        ul.social-media-links__list
            each link in app.socialMediaLinks
                li.social-media-links__item
                    a.social-media-links__link(href=link.href, title=link.name, target=(app.socialMediaLinksNewTab === false ? undefined : '_blank'), rel="noopener noreferrer")
                        if link.icon_raw
                            span.social-media-links__icon !{link.icon}
                        else
                            span.social-media-links__icon #{link.icon}
                        span.social-media-links__label #{link.name}
```

### Available data structure

`app.socialMediaLinksLabel` holds the resolved `aria_label` (default
`Social media`), `app.socialMediaLinksNewTab` the resolved `open_in_new_tab`
(default `true`). Each item in `app.socialMediaLinks` is the YAML entry
unchanged:

```javascript
{
    name: "Facebook",
    href: "https://facebook.com/yourpage",
    icon: "<i class=\"fab fa-facebook\" aria-hidden=\"true\"></i>",
    icon_raw: true
}
```

## 🛠️ Template Publishing

Use the templates provided by the plugin:

```bash
npx nera-social-media-links
```

This copies the templates to:

```
theme/views/vendor/plugin-social-media-links/
├── social-media-links.pug
└── fontawesome-cdn-link.pug   (deprecated, see below)
```

That is the destination on a site scaffolded with `nera new`, whose views live
in `theme/views/`. On an older site that renders from a root `views/` folder,
the command publishes to `views/vendor/plugin-social-media-links/` instead —
it picks the right destination automatically. Drop the `theme/` prefix from
the paths in this README on such a site.

Publishing **skips entirely if `theme/views/vendor/plugin-social-media-links/`
already exists**, so your edits are never overwritten — note that this is a
check on the directory, not on individual files, so a template added by a later
version is not copied in either. To pull in updated templates after an upgrade:

```bash
npx nera-social-media-links --force
```

> **Upgrading the plugin?** `--force` is what actually *delivers* a template
> change to your site. Upgrading without it is safe — you simply keep the
> templates you published before, and the new markup never appears. `--force`
> discards any local edits to the published files, so diff them first if you
> have customised them.

> **Upgrading from 2.0.x?** Icons are escaped by default from 2.1.0 onward.
> After running `--force`, add `icon_raw: true` to every entry whose `icon` is
> HTML, or it will render as visible text.

The command is also available under its old name, `npx publish-template`, but
prefer the prefixed one — the generic name collides with any other package that
claims it.

You can then include them in your layouts:

```pug
// Include social media links
include /vendor/plugin-social-media-links/social-media-links
```

The leading `/` resolves against your views folder (`theme/views/`) — there is
no `theme/` or `views/` segment in the path — so the same line works from any
depth; this needs **Nera v4.3.0+**. On older generators use a path relative to
the including file, which assumes a specific depth; from the base layout
`theme/views/layouts/layout.pug` that is:

```pug
include ../vendor/plugin-social-media-links/social-media-links
```

### Template customization

You can customize the copied templates or create your own based on the data structure provided by `app.socialMediaLinks`.

## 🎨 Styling

The default template uses BEM (Block Element Modifier) methodology:

```css
.social-media-links { }         /* Main navigation container, the <nav> */
.social-media-links__list { }   /* Unordered list container */
.social-media-links__item { }   /* Individual list item */
.social-media-links__link { }   /* Social media link */
.social-media-links__icon { }   /* Icon container span */
.social-media-links__label { }  /* Text label span */
```

These class names are a **public contract**. You style them from your own CSS,
so renaming one is a breaking change for every site using this plugin and only
ships in a major version.

## 📊 Generated Output

With the config above, the shipped template renders:

```html
<nav class="social-media-links" aria-label="Social media">
  <ul class="social-media-links__list">
    <li class="social-media-links__item">
      <a class="social-media-links__link" href="https://github.com/yourusername"
         title="GitHub" target="_blank" rel="noopener noreferrer">
        <span class="social-media-links__icon"><i class="fab fa-github" aria-hidden="true"></i></span>
        <span class="social-media-links__label">GitHub</span>
      </a>
    </li>
  </ul>
</nav>
```

Nothing at all is rendered when there are no links.

## 🎯 Use Cases

### Footer Social Links

```pug
footer.site-footer
    include /vendor/plugin-social-media-links/social-media-links
```

### Header Navigation

```pug
header.site-header
    nav.main-nav
        // Other navigation
    include /vendor/plugin-social-media-links/social-media-links
```

### Sidebar Widget

```pug
aside.sidebar
    section.widget
        h3 Follow Us
        include /vendor/plugin-social-media-links/social-media-links
```

## 🔗 Icons without a third-party request

The icons are whatever `icon` holds, so they need no CDN:

- **Inline SVG** (recommended): put the `<svg>` markup in `icon` and set
  `icon_raw: true`. Simple Icons (simpleicons.org) has the brand logos as SVG.
  Add `aria-hidden="true"` to the `<svg>`; the visible label names the link.
- **A self-hosted icon font**: download Font Awesome Free, copy its `css/` and
  `webfonts/` into `theme/assets/fontawesome/`, and link
  `/fontawesome/css/all.min.css` from your layout. The `<i class="fab …">`
  entries above then work unchanged.
- **Text only**: leave `icon` empty and style `.social-media-links__label`.

> **Deprecated: `fontawesome-cdn-link.pug`.** The template still ships (it is
> removed in 3.0.0), but including it makes every visitor's browser load Font
> Awesome from `cdnjs.cloudflare.com`. That transfers their IP address to a
> third party, which under the GDPR needs a legal basis and a line in your
> privacy policy, and `nera check` reports it as `privacy-third-party`. Use one
> of the options above instead.

## 🧪 Development

```bash
npm install
npx vitest run      # single pass -- `npm test` is watch mode
npm run lint
```

Tests are powered by [Vitest](https://vitest.dev) and cover:

- Social media links data structure
- Configuration parsing and validation
- Icon escaping and the `icon_raw` opt-in
- Template publishing logic and file operations
- Error handling for missing and malformed configurations

## 🤝 Contributing

Issues and pull requests are welcome. See the
[Nera contributing guide](https://github.com/seebaermichi/nera/blob/main/CONTRIBUTING.md)
for plugin development, the hook contract, and local setup.

For this repo specifically:

- `npx vitest run` and `npm run lint` must pass (`npm test` is watch mode).
- Bump the version and update `CHANGELOG.md` **in the same commit** as the change.
- Template markup and BEM class names are a **public contract** — users style
  them from their own CSS, so changing one is a **major** bump.
- Releases publish from CI on a pushed `v*` tag. Never run `npm publish`.

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

- [Plugin Repository](https://github.com/seebaermichi/nera-plugin-social-media-links)
- [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-social-media-links)
- [Nera Website](https://nera.js.org)
- [Nera Static Site Generator](https://github.com/seebaermichi/nera)
- [Plugin Documentation](https://github.com/seebaermichi/nera#plugins)
- [FontAwesome Icons](https://fontawesome.com/icons)

## 🧩 Compatibility

- **Nera**: v4.1.0+ — nothing here needs a generator feature beyond the 4.x
  baseline. The root-absolute include form shown above additionally needs
  **v4.3.0+**; on older generators use the relative include. The `theme/`
  folder layout used in the paths above — what `nera new` scaffolds — needs
  v4.6.0+.
- **Node.js**: >= 20.0.0
- **Plugin Utils**: `^1.2.0` — `bin/publish-template.js` relies on the
  project-shape validation `validateNeraProject` gained in 1.2.0. Publishing
  into `theme/views/vendor/` needs 1.5.0+, which a fresh install resolves
- **Plugin API**: Uses `getAppData()` to expose `app.socialMediaLinks`,
  `app.socialMediaLinksLabel` and `app.socialMediaLinksNewTab`. Links are configured via YAML and rendered with
  semantic HTML and accessibility features
- **FontAwesome**: optional; the deprecated CDN template loads 6.5.0

## 📦 License

MIT
