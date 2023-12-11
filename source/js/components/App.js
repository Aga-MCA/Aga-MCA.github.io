import api from '../load/api.js';
import { List } from './List.js';
import { Content } from './Content.js';

export function App() {
  const query = location.pathname.split('/').filter(Boolean);
  const $content = document.querySelector('div#content');
  if (!query[0] || query[0] === 'addon' || query[0] === 'textura') {
    let search = null;
    if (query[1] === 'search') search = query[2].replaceAll('-', ' ');
    const { data, users } = api({ type: query[0], search });
    return List(data, users);
  }
  if (query[0] === 'content') {
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
  const search = ((query[0] === 'search' && query[1]) || '').replaceAll(
    '-',
    ' '
  );
  const { data, users } = api({ search });
  return List(data, users);
}
