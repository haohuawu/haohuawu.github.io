function transformTag(className, tag) {
  return `<li class="${className}--item"><a class="${className}--link" href="${this.url_for(tag.path)}">#${tag.name}</a></li>`;
}

function process(tags, options, context) {
  const {
    className = 'tag-list',
    limit
  } = options;
  tags = tags || context.site.tags;
  return tags.slice(0, limit).filter(tag => tag.length).map(transformTag.bind(context, className)).join('');
}

hexo.extend.helper.register('list_tags', function listTagsHelper(tags, options = {}) {
  const {
    className = 'tag-list',
    limit
  } = options;
  return `<ul class="${className}">${process(tags, { className, limit }, this)}</ul>`;
});
