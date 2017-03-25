const cheerio = require('cheerio');

function transformNode(i, element) {
  const node = cheerio(element);
  return {
    level: parseInt(element.name.substring(1), 10),
    link: node.attr('id') ? `#${node.attr('id')}` : 'javascript: void 0;',
    text: node.text()
  };
}

function compareNode(a, b) {
  if (!a || a.level < b.level) {
    return -1;
  }
  if (!b || a.level > b.level) {
    return 1;
  }
  return 0;
}

function toc(str) {
  const stack = [];
  return cheerio.load(str)('h1, h2, h3, h4, h5, h6').map(transformNode).get().reduce((acc, node, i) => {
    let prev = acc[i - 1];
    let depth;
    let prefix;
    let index;
    if (!prev) {
      depth = 0;
      index = 1;
      prefix = '1';
      acc.push({
        depth,
        index,
        prefix,
        node
      });
      return acc;
    }
    if (compareNode(prev.node, node) < 0) {
      stack.unshift(prev);
      depth = prev.depth + 1;
      index = 1;
      prefix = `${prev.prefix}.${index}`;
    } else if (compareNode(prev.node, node) > 0) {
      while (stack[0] && compareNode(stack[0].node, node) >= 0) {
        prev = stack.shift();
      }
      depth = prev.depth;
      index = prev.index + 1;
      if (stack[0]) {
        prefix = `${stack[0].prefix}.${index}`;
      } else {
        prefix = `${index}`;
      }
    } else {
      depth = prev.depth;
      index = prev.index + 1;
      if (stack[0]) {
        prefix = `${stack[0].prefix}.${index}`;
      } else {
        prefix = `${index}`;
      }
    }
    acc.push({
      depth,
      index,
      prefix,
      node
    });
    return acc;
  }, []).map(
    anchor => `<a title="${anchor.node.text}" class="toc--item--anchor" href="${anchor.node.link}" data-depth="${anchor.depth}"><span class="toc--number">${anchor.prefix}</span>${anchor.node.text}</a>`
  );
}

hexo.extend.helper.register('toc', function tocHelper(str) {
  const anchors = toc(str);
  if (anchors.length === 0) {
    return '<ul class="toc" empty></ul>';
  }
  return `<ul class="toc">${anchors.map(anchor => `<li class="toc--item">${anchor}</li>`).join('')}</ul>`;
});
