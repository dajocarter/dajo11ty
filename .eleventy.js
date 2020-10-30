require('dotenv').config()
const { DateTime } = require('luxon')

module.exports = function(eleventyConfig) {
  // alias for layouts in frontmatter
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk')
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')
  // functions to transform content
  eleventyConfig.addFilter('humanDateString', date => DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLLL d, yyyy'))
  eleventyConfig.addFilter('htmlDateString', date => DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd'))
  // pass through static assets
  eleventyConfig.addPassthroughCopy('src/styles/index.css')
  eleventyConfig.addPassthroughCopy('src/img')
  eleventyConfig.addPassthroughCopy('src/scripts/index.js')
  // return directory config
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
