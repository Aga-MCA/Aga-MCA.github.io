import { createElementDom } from '../modules/dom.js';
import { Link } from './Link.js';

function descriptionProcess(description) {
  // mi descripcion #enlace*https://ejemplo.com# continuacion de la descripcion
  // mi descripcion <a href="https://ejemplo.com">enlace</a> continuacion de la descripcion

  const result = [];
  const data = description.split(/(#.+\*.+#)/g);
  for (const item of data) {
    if (item.startsWith('#') && item.endsWith('#')) {
      const [text, url] = item.slice(1, -1).split('*');
      result.push(Link(url, {}, text));
    } else {
      result.push(item);
    }
  }
  return result;
}

export function Description(description) {
  return createElementDom('p', null, ...descriptionProcess(description));
}
