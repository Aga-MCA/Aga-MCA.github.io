import { createElementDom } from "../modules/dom.js";
import { Link } from './Link.js';

function navData(text, isSection = true) {
  const $title = createElementDom('p', null, text);
  const $count = createElementDom('span', null, '0');
  const $data = createElementDom('div', {class:'mc-nav-data'}, ...(isSection ? [$title, $count] : [$title]))
  if(!isSection) return [$data];
  const $icon = createElementDom('img', {class:'mc-nav-icon',src:'/source/image/proximamente.png'});
  return [$icon, $data];
}
export function Nav(){
  const $nav = document.querySelector('nav');
  $nav.appendChild(Link('/all/', {class:'mc-selectable left active', id:'nav-all'}, ...navData(lang.get('gui.nav.all'))));
  $nav.appendChild(Link('/addon/', {class:'mc-selectable center', id:'nav-addon'}, ...navData(lang.get('gui.nav.addons'))));
  $nav.appendChild(Link('/textura/', {class:'mc-selectable right', id:'nav-textura'}, ...navData(lang.get('gui.nav.textures'))));
  $nav.appendChild(Link('/', {class:'mc-selectable exit'}, ...navData('x', false)));
  return $nav;
}