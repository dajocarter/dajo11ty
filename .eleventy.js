module.exports = function(eleventyConfig) {
  // alias for layouts in frontmatter
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk')
  // return directory config
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
