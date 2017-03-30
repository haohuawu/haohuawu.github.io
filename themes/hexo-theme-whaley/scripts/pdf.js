function exec(name, args) {
  const fn = hexo.extend.helper.get(name);
  if (fn) {
    return fn.apply(hexo, args);
  }
  throw new Error(`No such helper! ${name}`);
}

hexo.extend.helper.register('is_pdf', function isPDFHelper() {
  return this.page.layout === 'pdf';
});

hexo.extend.tag.register('pdf', function pdf(args) {
  const width = args[1] || '100%';
  const height = args[2] || '500px';
  return `<iframe width="${width}" height="${height}" src="/pdf.js/web/viewer.html?file=${exec('url_for', args)}" allowfullscreen></iframe>`;
});
