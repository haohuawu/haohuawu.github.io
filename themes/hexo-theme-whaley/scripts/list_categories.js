function transformCategory(className, category) {
  return `<li class="${className}--item"><a class="${className}--link" href="${this.url_for(category.path)}">${category.name}</a></li>`;
}

function process(categories, options, context) {
  const {
    className = 'category-list',
    limit
  } = options;
  categories = categories || context.site.categories;
  return categories.slice(0, limit).filter(category => category.length).map(transformCategory.bind(context, className)).join('');
}

hexo.extend.helper.register('list_categories', function listCategoriessHelper(categories, options = {}) {
  const {
    className = 'category-list',
    limit
  } = options;
  return `<ul class="${className}">${process(categories, { className, limit }, this)}</ul>`;
});
