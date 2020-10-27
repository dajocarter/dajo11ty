module.exports = function(eleventyConfig) {
  // alias for layouts in frontmatter
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk')
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')
  // pass through static assets
  eleventyConfig.addPassthroughCopy('src/styles/index.css')
  // return directory config
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
