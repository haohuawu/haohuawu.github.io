function renderer(data) {
  return data.text;
}

hexo.extend.helper.register('is_keynote', function isKeynoteHelper() {
  return this.page.layout === 'keynote';
});

hexo.extend.renderer.register('keynote', 'html', renderer, true);
