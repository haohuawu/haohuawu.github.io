const { stripHTML, slugize } = require('hexo-util');

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

hexo.extend.helper.register('is_api', function isAPIHelper() {
  return this.page.layout === 'api';
});

hexo.extend.renderer.register('api', 'html', raw, true);

hexo.extend.filter.register('before_post_render', function(data) {
  if (data.layout === 'api' && !data.indexes) {
    data.indexes = [];
  }
  return data;
});

hexo.extend.tag.register('api', function(args, content) {
  let id;
  if (this.layout !== 'api') {
    return Promise.resolve('');
  }
  id = anchorId(stripHTML(args[0] || ''));
  return render(content).then((html) => {
    this.indexes.push(`<a href="#${id}" target="_self">${id}</a>`);
    return `<section id="${id}">${html}</section>`;
  });
}, { ends: true, async: true });
