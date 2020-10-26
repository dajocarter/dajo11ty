---
title: 'Getting Started with Eleventy'
date: '2020-10-25'
description: 'Building a brand new site from scratch with Eleventy'
---

Eleventy, or [11ty](https://www.11ty.dev/), might be my new favorite static site generator. It's fast, supports about every templating language I'd use for frontend development, and not only is it compatible with many build tools like Webpack but it's not even necessary to use one. There are many great examples from the [starter projects](https://www.11ty.dev/docs/starter/) but a lot of them come fully featured and some of the features I don't need or want. I will instead start with the most basic of an 11ty site and build out everything I need from there while I document the process.

A great thing about 11ty is you don't need much to start; all you need is a simple HTML index file. I made a new directory for this site `mkdir ~/Sites/dajo11ty` with this basic Nunjucks file `touch dajo11ty/index.njk` and was able to generate my site using `npx @11ty/eleventy` from the `dajo11ty` directory. This will take my index file, generate it as an HTML file, and ouput it to the `_site` directory.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>¡Hola Munda!</title>
    <meta name="description" content="I built this with 11ty" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

Since I don't want to remember that `npx` command every time I want to build or serve the site, I'm going to `npm init` and use npm scripts to run commands. I'm also going to make sure I add `node_modules` and `_site` to my `.gitignore`.

```json
{
  "name": "dajo11ty",
  "version": "1.0.0",
  "description": "i built this with 11ty",
  "main": ".eleventy.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "eleventy",
    "debug": "DEBUG=Eleventy* eleventy",
    "dry-run": "DEBUG=Eleventy* eleventy --dryrun",
    "serve": "eleventy --serve",
    "serve-quiet": "eleventy --serve --quiet",
    "watch": "eleventy --watch",
    "watch-quiet": "eleventy --watch --quiet"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dajocarter/dajo11ty.git"
  },
  "keywords": ["11ty", "eleventy"],
  "author": "dajocarter",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/dajocarter/dajo11ty/issues"
  },
  "homepage": "https://github.com/dajocarter/dajo11ty#readme",
  "devDependencies": {
    "@11ty/eleventy": "^0.11.1"
  }
}
```

At this point, I'm going to consider everything done so far as my [initial commit](https://github.com/dajocarter/dajo11ty/commit/9868746141a905d7b9e6793031add3079bf6a761). I prefer that all the files that will be used to generate the site be in one directory so I'm going to move my index file `mkdir src && mv index.njk src/index.njk` and keep my config files in the root. Since this is not a default directory for 11ty, I'm going to make a config file `touch .eleventy.js` and update the build process. With that, I'm going to change the output directory to `dist` and update my `.gitignore`.

Now that I have a basic site building, I can start adding more pages but if I add a markdown file and build the site, 11ty will transform the post markdown into HTML but the page will lack `<!doctype html>`, `<head>`, `<body>`, etc. so I'll need to create a default HTML layout. I'll make an includes folder `mkdir src/_includes` that will hold any partials and a layouts folder `mkdir src/_includes/layouts` to house my default layout `touch src/_includes/layouts/default.njk`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{{ title }}</title>
    <meta name="description" content="{{ description }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    {{ content | safe }}
  </body>
</html>
```

Eleventy fills in the variables in the example above, but I have three variables in my layout for the `<title>`, `<meta name="description">` content and `<body>` content. Similar to the frontmatter for this post, I can now simplify my index file to

```html
---
layout: layouts/default.njk
title: '¡Hola Munda!'
description: 'I built this with 11ty'
---

<h1>Hello World!</h1>
```

I don't want to have use the filepath when i declare a layout so I'm going to add an alias to my 11ty config `.eleventy.js`

```js

```

Now I'm ready to add this blog post to the site with `mkdir src/blog && touch src/blog/getting-started-with-eleventy.md`. I'm going to place every post in this blog directory so I need to make sure 11ty recognizes this as a collection which I'll call `blog`. One way to do this is to add `tags: blog` to the frontmatter of every post but since every post will use the same layout and at least this blog tag, I'd like to find a DRYer way to that. I can't find any documentation on this, but I can create `src/blog/blog.json` and every post will merge their frontmatter with this object.

```json
{
  "layout": "default",
  "tags": "blog"
}
```

The other way to do this is via the 11ty config by adding the following. However, it doesn't compensate for having to declare the layout in each post. Therefore I use the `json` tactic above, although I'm not sure how long it'll work since I've yet to see it documented (it could be an old feature).

```js
// add blog posts as a collection
eleventyConfig.addCollection(
  'blog', // name of the collection
  (collectionApi) =>
    collectionApi
      .getAll() // get all items, unsorted
      .filter(
        // make sure it has a URL, ignore the index file, and include anything in src/blog/
        (item) =>
          item.url &&
          !item.inputPath.includes('index.njk') &&
          item.inputPath.startsWith('./src/blog/')
      )
)
```

The final thing to do is update my index file to list all of my blog posts. Around the unordered list you can check for `collections.blog` and loop through that to generate list items for each post.

```html
{% if collections.blog %}
<ul>
  {% for post in collections.blog %}
  <li>
    <a href="{{ post.url }}"> {{ post.data.title }} </a>
  </li>
  {% endfor %}
</ul>
{% endif %}
```

With that, I now have a very basic blog site that you can view at [https://dajo11ty.netlify.com](https://dajo11ty.netlify.com)! The [next post](/blog/using-tailwindcss-with-eleventy) will focus on adding TailwindCSS as my styling framework.
