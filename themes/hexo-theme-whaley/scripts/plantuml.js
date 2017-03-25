const { PumlRenderer } = require('esf-puml');
const SVGO = require('svgo');

const renderer = new PumlRenderer();
const svgo = new SVGO({
  plugins: [{
    removeDimensions: true
  }, {
    removeAttrs: {
      attrs: ['svg:style', 'path:filter']
    }
  }]
});

hexo.extend.tag.register('plantuml', function plantumlTag(args, content) {
  return Promise.resolve(renderer.renderStringToString(content)).then((out) => {
    if (out && isNaN(out)) {
      return new Promise((resolve) => {
        svgo.optimize(out, (result) => {
          if (result.data) {
            resolve(`<div class="plantuml"><div class="plantuml--overlay"></div><div class="plantuml--content"><div class="transform-wrapper">${result.data}</div></div></div>`);
          } else {
            console.warn('svgo optimize failed! Will fallback to origin');
            resolve(`<div class="plantuml"><div class="plantuml--overlay"></div><div class="plantuml--content"><div class="transform-wrapper">${out}</div></div></div>`);
          }
        });
      });
    }
    return '';
  });
}, { async: true, ends: true });
