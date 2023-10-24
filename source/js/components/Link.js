import {createElementDom} from '../modules/dom.js';
import {SPA} from '../spa.js';

export function Link(url, props, ...childrens){
  const $link = createElementDom('a', {...props, href: url}, ...childrens);
  $link.addEventListener('click', e=>SPA(e, url));
  return $link;
}