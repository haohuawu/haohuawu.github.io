const { stripHTML, slugize } = require('hexo-util');
const rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
const placeholder = '\uFFFD';
const rPlaceholder = /(?:<|&lt;)\!--\uFFFD(\d+)--(?:>|&gt;)/g;
const cache = [];

function anchorId(str = '') {
  return slugize(str.trim());
}

function raw(data) {
  return data.text;
}

function render(content) {
  return hexo.render.render({
    text: content,
    engine: 'md'
  });
}

function escapeContent(str) {
  return '<!--' + placeholder + (cache.push(str) - 1) + '-->';
}

hexo.extend.helper.register('is_api', function isApiHelper() {
  return this.page.layout === 'api';
});

hexo.extend.renderer.register('api', 'html', raw, true);

hexo.extend.filter.register('before_post_render', function(data) {
  if (data.layout === 'api' && !data.indexes) {
    data.indexes = [];
    data.content = data.content.replace(rEscapeContent, function(match, content) {
      return escapeContent(content);
    });
  }
  return data;
});

hexo.extend.filter.register('after_post_render', function(data) {
  if (data.layout === 'api') {
    data.content = data.content.replace(rPlaceholder, function() {
      return cache[arguments[1]];
    });
  }
  return data;
});

hexo.extend.tag.register('api', function(args, content) {
  const id = anchorId(stripHTML(args[0] || ''));
  return render(content).then((html) => {
    this.indexes.push(`<a href="#${id}" target="_self">${id}</a>`);
    return `<section id="${id}">${html}</section>`;
  });
}, { ends: true, async: true });
