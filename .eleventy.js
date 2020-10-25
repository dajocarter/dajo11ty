module.exports = function(eleventyConfig) {
  // alias for layouts in frontmatter
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk')
  // add blog posts as a collection
  eleventyConfig.addCollection("blog",
  collectionApi => collectionApi
    .getAll()
    .filter(item => item.url
      && !item.inputPath.includes('index.njk')
      && item.inputPath.startsWith('./src/blog/'))
  );
  // return directory config
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
