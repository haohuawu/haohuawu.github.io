import {
  setInnerHTML,
  applyStyle,
  createElement
} from 'shared/dom';
import Component from 'core/Component';
import './style.scss';

export default class ImageViewer extends Component {
  constructor() {
    super(
      {
        tagName: 'figure',
        className: 'image-viewer',
        delegates: ['click'],
        visible: false,
        events: {
          click(evt) {
            this.show(false);
            evt.stopPropagation();
          }
        }
      },
      '<div class="overlay"></div><div class="image-wrapper"><img/></div><figcaption></figcaption>'
    );
  }
  update(src, alt) {
    if (src !== (this.ref('img') || {}).src) {
      const image = createElement({
        el: this.ref('img'),
        tagName: 'img',
        attributes: { src, alt },
        style: {
          opacity: 0,
          transform: 'scale3d(0, 0, 0)'
        }
      });
      image.onload = () => {
        applyStyle(image, {
          opacity: 1,
          transform: 'scale3d(1, 1, 1)'
        });
      };
    }
    setInnerHTML(
      this.ref('figcaption'),
      alt
    );
    return this;
  }
}
