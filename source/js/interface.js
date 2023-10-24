import $ from './modules/$.js';
import api from './load/api.js';
import { List } from './components/List.js';
import { Content } from './components/Content.js';

export function load() {
  const query = location.pathname.split('/').filter(Boolean);
  const $root = document.querySelector('#root')
  $root.innerHTML = '';
  if (!query[0] || query[0] === 'addon' || query[0] === 'textura') {
    const { data, users } = api({ type: query[0] });
    $root.appendChild(List(data, users));
    return;
  }
  if (query[0] === 'content') {
    const name = query[1].replaceAll('-', ' ').toLowerCase();
    const { data, users } = api({ name });
    $root.appendChild(Content(
      data.find(item => item[0].name.toLowerCase() === name),
      users
    ));
    return;
  }
  if (query[0] === 'search') {
    const search = (query[1] || '').replaceAll('-', ' ');
    const { data, users } = api({ search });
    $root.appendChild(List(data, users));
    $('#search').element.element.value = search;
    return;
  }
}

addEventListener('DOMContentLoaded', load);
