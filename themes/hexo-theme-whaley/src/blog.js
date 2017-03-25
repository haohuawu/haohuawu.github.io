import 'polyfills';
import 'styles/blog.scss';
import { contains, applyStyle, hasAttribute, applyAttributes } from 'shared/dom';
import ImageViewer from 'components/image-viewer';

const imageViewer = new ImageViewer();
const isPalm = window.innerWidth <= 600;

function resizeSidebarContent() {
  const wrapper = document.querySelector('.side-bar--wrapper');
  let width;
  let maxHeight;
  if (wrapper) {
    width = wrapper.parentNode.getBoundingClientRect().width;
    if (!isPalm) {
      width -= parseFloat(window.getComputedStyle(wrapper)['margin-left']);
    }
  }
  if (isPalm) {
    maxHeight = window.innerHeight;
  } else {
    maxHeight = window.innerHeight - 380;
  }
  applyStyle(wrapper, {
    width: `${width}px`,
    maxHeight: `${maxHeight}px`
  });
}

if (document.querySelector('.side-bar--wrapper')) {
  window.addEventListener('resize', resizeSidebarContent, false);
  resizeSidebarContent();
}

document.body.addEventListener('click', (evt) => {
  if (
    evt.target.tagName === 'IMG' &&
    contains(document.querySelector('.site--content'), evt.target)
  ) {
    imageViewer.update(evt.target.src, evt.target.alt || '').show();
  } else if (contains(document.querySelector('.nav-menu'), evt.target)) {
    applyAttributes(document.querySelector('.side-bar'), {
      active: true
    });
  } else if (
    contains(document.querySelector('.side-bar'), evt.target) &&
    hasAttribute(document.querySelector('.side-bar'), 'active')
  ) {
    applyAttributes(document.querySelector('.side-bar'), {
      active: false
    });
  }
}, false);
imageViewer.mount(document.body);
