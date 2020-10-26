---
title: 'Using TailwindCSS with Eleventy'
date: '2020-10-26'
description: 'Adding TailwindCSS to a brand new site from scratch with Eleventy'
---

In my [last post](/blog/getting-started-with-eleventy) I covered how I got started with a very basic blog using Eleventy. Now that I'm able to easily add new posts, the next thing I want to work on is styling the site. To do that I am going to bring in [TailwindCSS](https://tailwindcss.com/) to this project with `npm install tailwindcss`. It's a bit of a different way of thinking for me in that I'm used to writing CSS while with Tailwind the focus is on creating classes, but I'll take that over having to write CSS for a project I don't want to think about too much.

To get started I made a `src/styles/tailwind.css` where I imported all of the Tailwind files.

```css
@import 'tailwindcss/base';

@import 'tailwindcss/components';

@import 'tailwindcss/utilities';
```

In order for me to utilize Tailwind, I need something of a build step for Tailwind to process the CSS. One way to do this is via the CLI `npx tailwindcss build src/styles/tailwind.css -o src/styles/index.css`. They note that most people will want to use PostCSS for processing the CSS and that's what I'll use. By running `npx tailwindcss init -p`, I'll get both a `tailwind.config.js` and `postcss.config.js`.

I'd prefer to not introduce a build tool (at least right now) so I will be using `postcss-cli` to process my CSS. That means I'll need to install some packages `npm i -D postcss postcss-cli postcss-import autoprefixer` and update my npm scripts.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "NODE_ENV=production npm run postcss && eleventy",
  "clean": "rm -r dist",
  "debug": "NODE_ENV=production npm run postcss && DEBUG=Eleventy* eleventy",
  "dry-run": "NODE_ENV=production npm run postcss && DEBUG=Eleventy* eleventy --dryrun",
  "postcss": "postcss src/styles/tailwind.css > src/styles/index.css",
  "serve": "npm run clean && npm run postcss && eleventy --serve",
  "serve-quiet": "npm run clean && npm run postcss && eleventy --serve --quiet",
  "watch": "npm run clean && npm run postcss && eleventy --watch",
  "watch-quiet": "npm run clean && npm run postcss && eleventy --watch --quiet"
}
```

For my `postcss.config.js`, I went with the default provided by Tailwind docs. The `postcss-import` tool allows us to `@import` the Tailwind files in `src/styles/tailwind.css`, the `tailwindcss` plugin does its thing, and then we use `autoprefixer` on the generated CSS.

```js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
```

I ended up making two modifications to the default `tailwind.config.js`. The first is that I opted-in to the two features under `future` since I'm using this in a brand new project. The other modification is that I only purge styles when in `production` mode. This allows me to have all of Tailwind available during development so I don't have to worry about running `postcss` every time I update a template.

```js
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.njk'],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
```

The `postcss` script will use the above to generate a CSS file that I can include on all my pages. In order for this CSS to be added to the generated site, I need to tell 11ty about this new `src/styles` directory and what to do with these files. One way to do this is to add `css` as a template format for 11ty to process. To do that I would add this to my 11ty config.

```js
module.exports = function(eleventyConfig) {
  ...
  eleventyConfig.setTemplateFormats([
    "njk",
    "md",
    "css"
  ])
  ...
}
```

However it seems to be recommended to just pass through static assets so instead I will add this to my `.eleventy.js` file.

```js
module.exports = function(eleventyConfig) {
  ...
  eleventyConfig.addPassthroughCopy('src/styles/index.css')
  ...
}
```

Instead of adding my generated CSS file to the site after it's been generated, I want the generated CSS file to be a part of the site build process. Thus above I only pass through the generated CSS file and make sure to run the `postcss` script before I use 11ty. Since this `index.css` file is only generated for builds, I'm going to add it to my `.gitignore`. I also need to add a `<link href="/styles/index.css">` to my default layout so that the site loads the generated CSS.
