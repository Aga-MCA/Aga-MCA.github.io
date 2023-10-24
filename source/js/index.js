import './interactive.js';
import load from './load/interface.js';
import { Link } from './components/Link.js';

window.addEventListener('DOMContentLoaded', ()=>{
  const $links = document.querySelector('nav > div');
  $links.appendChild(Link('/', {class:'link'}, 'Todos'));
  $links.appendChild(Link('/addon', {class:'link'}, 'Addons'));
  $links.appendChild(Link('/textura', {class:'link'}, 'Texturas'));

  load();
});