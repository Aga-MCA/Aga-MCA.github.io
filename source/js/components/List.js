import { createElementDom } from '../modules/dom.js';
import { Link, navigate } from './Link.js';

function searchProp(item, prop) {
  if (item[prop] !== undefined) return item[prop];
  if (item.versions.find(v => v[prop] !== undefined))
    return item.versions.find(v => v[prop] !== undefined)[prop];
  return undefined;
}

/**
 * @param {[typeof import('../../api/addons.json')['content'][2], boolean][]} data
 * @param {typeof import('../../api/users.json')['content']} users
 */
export function List(data, users) {
  const $list = createElementDom('div', { class: 'mc-list', id: 'list' });
  // no blocking
  (async () => {
    let inter;
    const $search = createElementDom('input', {
      type: 'text',
      id: 'search',
      class: 'mc-textarea',
      autocomplete: 'off',
    });
    const dataSearch = location.pathname.split('/').filter(Boolean);
    if(dataSearch[0] === 'search') $search.value = dataSearch[1].replaceAll('-', ' ');
    else if(dataSearch[1] === 'search') $search.value = dataSearch[2].replaceAll('-', ' ');
    $search.addEventListener('keyup', function () {
      if (inter) clearTimeout(inter);
      inter = setTimeout(()=>{
        let pre = '/'
        if(location.pathname.startsWith('/addon')) pre = '/addon/';
        if(location.pathname.startsWith('/textura')) pre = '/textura/';
        const value = $search.value.replaceAll(' ', '-').trim();
        if(value === '') return navigate(pre);
        navigate(`${pre}/search/${value}`.replace(/\/+/g, '/'));
      }, 200);
    });
    $list.appendChild($search);
    for (const [item, show] of data) {
      const versions = item.versions.sort((a, b) => {
        const a1 = a.version.split('.').map(Number);
        const b1 = b.version.split('.').map(Number);
        if (a1[0] > b1[0]) return -1;
        if (a1[0] < b1[0]) return 1;
        if (a1[1] > b1[1]) return -1;
        if (a1[1] < b1[1]) return 1;
        if (a1[2] > b1[2]) return -1;
        if (a1[2] < b1[2]) return 1;
        return 0;
      });
      const author = users.find(u => u.id === item.author)?.name || list.get('user.unknown');
      const collaborators =
        item.collaborators
          ?.map(c => users.find(u => u.id === c)?.name || '')
          .join(', ') || '';
      const icon = item.icon || '/source/image/proximamente.png';
      const FinalDate = new Date(versions[0].date);

      const tags = (searchProp(item, 'tags') || []).join(',');
      $list.appendChild(
        Link(
          `/content/${item.name.replaceAll(' ', '-')}`,
          {
            class: 'mc-list-item container' + (show ? '' : ' hide'),
            name: item.name,
            type: item.type,
            tags,
            data: `${item.name} ${item.type} ${tags}`,
          },
          createElementDom('img', { src: icon, class: 'mc-image' }),
          createElementDom(
            'div',
            { class: 'data' },
            createElementDom(
              'div',
              { class: 'info' },
              createElementDom('h2', { class: 'mc-list-item-name' }, item.name),
              createElementDom(
                'h5',
                null,
                `${author}${collaborators ? ` - ${collaborators}` : ''}`
              )
            ),
            createElementDom(
              'div',
              { class: 'date' },
              createElementDom('h5', null, FinalDate.toLocaleDateString()),
              createElementDom('h5', null, FinalDate.toLocaleTimeString())
            )
          )
        )
      );
    }
  })();
  return $list;
}
