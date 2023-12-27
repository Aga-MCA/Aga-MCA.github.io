import api from '../load/api.js';
import { List } from './List.js';
import { Content } from './Content.js';
import { Home } from './Home.js';

export function App() {
  const query = location.pathname.split('/').filter(Boolean);
  const $root = document.querySelector('div#root');
  const $start = document.querySelector('div#start');
  const $content = document.querySelector('div#content');
  $start.append(...Home())
  if (query[0] === 'addon' || query[0] === 'textura' || query[0] === 'all') {
    $root.classList.remove('hide');
    let search = null;
    if (query[1] === 'search') search = query[2].replaceAll('-', ' ');
    const { data, users } = api({ type: query[0], search });
    return List(data, users);
  }
  if (query[0] === 'content') {
    $content.classList.remove('hide');
    const name = query[1].replaceAll('-', ' ').toLowerCase();
    const { data, users } = api({ name });
    $content.classList.remove('hide');
    $content.appendChild(
      Content(
        data.find(item => item[0].name.toLowerCase() === name),
        users
      )
    );
  }
  $start.classList.remove('hide');
}
