require('dotenv').config()
const { DateTime } = require('luxon')
const fs = require('fs')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

module.exports = function (eleventyConfig) {
  // alias for layouts in frontmatter
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk')
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')
  // add syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight)
  // functions to transform content
  eleventyConfig.addFilter('humanDateString', date => DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLLL d, yyyy'))
  eleventyConfig.addFilter('htmlDateString', date => DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd'))
  // pass through static assets
  eleventyConfig.addPassthroughCopy('src/styles/index.css')
  eleventyConfig.addPassthroughCopy('src/styles/prism-coy-without-shadows.css')
  eleventyConfig.addPassthroughCopy('src/img')
  eleventyConfig.addPassthroughCopy('src/scripts/index.js')
  // Enables 404 page locally
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        browserSync.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('dist/404.html');
          // Provides the 404 content without redirect.
          res.write(content_404);
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end();
        });
      }
    }
  })
  // return directory config
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
