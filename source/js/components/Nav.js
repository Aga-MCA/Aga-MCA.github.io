import { Link } from './Link.js';

export function Nav(){
  const $nav = document.querySelector('nav');
  $nav.appendChild(Link('/', {class:'mc-selectable left active'}, 'Todos'));
  $nav.appendChild(Link('/addon', {class:'mc-selectable center'}, 'Addons'));
  $nav.appendChild(Link('/textura', {class:'mc-selectable right'}, 'Texturas'));
  return $nav;
}