const rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
const placeholder = '\u003A';
const rPlaceholder = /(?:<|&lt;)\!--\u003A(\d+)--(?:>|&gt;)/g;
const cache = [];

function escapeContent(str) {
  return '<!--' + placeholder + (cache.push(str) - 1) + '-->';
}

hexo.extend.filter.register('before_post_render', function(data) {
  data.content = data.content.replace(rEscapeContent, function(match, content) {
    return escapeContent(content);
  });
  return data;
});

hexo.extend.filter.register('after_post_render', function(data) {
  data.content = data.content.replace(rPlaceholder, function() {
    return cache[arguments[1]];
  });
  return data;
});
