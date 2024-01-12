import api from '../load/api.js';
import { List } from './List.js';
import { Content } from './Content.js';
import { Home } from './Home.js';

export async function App() {
  const query = location.pathname.split('/').filter(Boolean);
  const $root = document.querySelector('div#root');
  const $start = document.querySelector('div#start');
  const $content = document.querySelector('div#content');
  $start.append(...Home())
  if (query[0] === 'content') {
    $content.classList.remove('hide');
    const name = query[1].replaceAll('-', ' ').toLowerCase();
    const { data, users } = await api({ name });
    $content.classList.remove('hide');
    $content.appendChild(
      Content(
        data.find(item => item[0].name.toLowerCase() === name),
        users
      )
    );
  }
  if (query[0] === 'addon' || query[0] === 'textura' || query[0] === 'all') {
    $root.classList.remove('hide');
    let search = null;
    if (query[1] === 'search') search = query[2].replaceAll('-', ' ');
    const { data, users } = await api({ type: query[0], search });
    return List(data, users);
  }
  $start.classList.remove('hide');
  const { data, users } = await api();
  return List(data, users);
}
