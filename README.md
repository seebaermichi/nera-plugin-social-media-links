# Social Media Links - Nera plugin
This is a plugin for the static side generator [Nera](https://github.com/seebaermichi/nera) to create a list of social media links. It will generate links out of a given setup.
You can define within the `config/social-media-links.yaml` file which properties you want to use for each social media link (see example).  

## Usage
The first thing you need to do is to place this plugin in the `src/plugins` folder of your Nera project.  

In addition you need to define which properties each social media link should use. Define it in the `config/social-media-links.yaml`, e.g. like this:
```yaml
social_media_links:
  - name: facebook
    href: https://facebook.com
    icon: <i class="fab fa-facebook-square"></i>
  - name: twitter
    href: https://twitter.com
    icon: <i class="fab fa-twitter-square"></i>
  - name: linkedIn
    href: https://linkedin.com
    icon: <i class="fab fa-linkedin"></i>

```
Now all of these properties will be available in the `app.socialMediaLinks` property in your templates and you can loop through them however you want or include the template which is provided in `views/social-media-links.pug`.
```pug
each link in app.socialMediaLinks
    a(href=link.href)
        | !{ link.icon }

```

In addition this plugin provides another template `views/fontawesome-cdn-link.pug` which includes the link to the `all.min.css` file of Fontawesome. You can use it to include Fontawesome icons and use them in your templates.

## Example
This is how a simple layout file could look like with the social media links templates included.
```pug
<!DOCTYPE html>
html(lang=app.lang)
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    meta(http-equiv="X-UA-Compatible", content="ie=edge")
    title #{ meta.title } | #{ app.name }
    meta(name="description", content=`${meta.description || app.description}`)
    meta(name="keywords", conent=`${meta.keywords || app.keywords}`)
    meta(name="generator" content=`nera - ${process.env.npm_package_version}`)
    meta(name="robots" content=`${meta.robots || app.robots}`)

    include ../../src/plugins/social-media-links/views/fontawesome-cdn-link

  body
    block content

  footer
    include ../../src/plugins/social-media-links/views/social-media-links

```
