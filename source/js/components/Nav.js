import { Link } from './Link.js';

export function Nav(){
  const $nav = document.querySelector('nav');
  $nav.appendChild(Link('/', {class:'mc-selectable left active'}, lang.get('gui.nav.all')));
  $nav.appendChild(Link('/addon', {class:'mc-selectable center'}, lang.get('gui.nav.addons')));
  $nav.appendChild(Link('/textura', {class:'mc-selectable right'}, lang.get('gui.nav.textures')));
  return $nav;
}