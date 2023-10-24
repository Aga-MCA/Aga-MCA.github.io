import {createElementDom} from '../modules/dom.js';
import { Description } from './Description.js';
import { Link } from './Link.js';

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
  const $list = createElementDom('div', { class: 'list' });
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
    const author = users.find(u => u.id === item.author)?.name || 'Anonimo';
    const collaborators =
      item.collaborators
        ?.map(c => users.find(u => u.id === c)?.name || '')
        .join(', ') || '';
    const icon = versions.find(v => v.icon)?.icon || '/source/image/proximamente.png';
    const description =
      versions.find(v => v.description)?.description ||
      `Este es un recurso crreado por ${
        collaborators ? `${author}, ${collaborators}` : author
      }`;
    const FinalDate = new Date(versions[0].date);
    const date = `${FinalDate.toLocaleDateString()} ${FinalDate.toLocaleTimeString()}`;

    const data = createElementDom(
      'div',
      {
        class: 'container' + (item.deprecated ? ' deprecated' : ''),
        name: item.name,
        type: item.type,
        tags: (searchProp(item, 'tags') || []).join(','),
      },
      createElementDom('img', { src: icon }),
      createElementDom(
        'div',
        { class: 'data' },
        createElementDom('h2', null, item.name),
        createElementDom(
          'div',
          { class: 'info' },
          Description(description),
        ),
        createElementDom(
          'div',
          { class: 'meta' },
          createElementDom(
            'h5',
            null,
            `Version: ${versions[0].version || '0.0.1'}`
          ),
          createElementDom('h5', { class: 'extra' }, `Creador: ${author}`),
          createElementDom('h5', { class: 'extra large' }, `Fecha: ${date}`)
        )
      )
    );
    $list.appendChild(Link(
      `/content/${item.name.replaceAll(' ', '-')}`,
      {
        class: show ? 'show' : 'hide',
      },
      data
    ));
  }
  return $list;
}