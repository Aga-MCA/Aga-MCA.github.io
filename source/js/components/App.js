import $ from '../modules/$.js';
import api from '../load/api.js';
import { List } from './List.js';
import { Content } from './Content.js';

export function App() {
  const query = location.pathname.split('/').filter(Boolean);
  if (!query[0] || query[0] === 'addon' || query[0] === 'textura') {
    let search = null;
    if (query[1] === 'search') search = query[2].replaceAll('-', ' ');
    const { data, users } = api({ type: query[0], search });
    return List(data, users)
  }
  if (query[0] === 'content') {
    const name = query[1].replaceAll('-', ' ').toLowerCase();
    const { data, users } = api({ name });
    return Content(
      data.find(item => item[0].name.toLowerCase() === name),
      users
    )
  }
  if (query[0] === 'search') {
    const search = (query[1] || '').replaceAll('-', ' ');
    const { data, users } = api({ search });
    $('#search').element.element.value = search;
    return List(data, users)
  }
}