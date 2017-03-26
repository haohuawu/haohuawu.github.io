const assign = require('object-assign');
const { minify } = require('html-minifier');
const minimatch = require('minimatch');

hexo.config.html_minifier = assign({
  exclude: [],
  collapseWhitespace: true
}, hexo.config.html_minifier);

hexo.extend.filter.register('after_render:html', function minifyHtml(str, data) {
  const options = this.config.html_minifier;
  const path = data.path;
  let exclude = options.exclude;
  if (exclude && !Array.isArray(exclude)) {
    exclude = [exclude];
  }
  if (path && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i += 1) {
      if (minimatch(path, exclude[i])) {
        return str;
      }
    }
  }
  return minify(str, options);
});
