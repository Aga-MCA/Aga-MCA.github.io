import { createElementDom } from './modules/dom.js';
import $ from './modules/$.js';
import api from './load/api.js';

function load() {
  const query = location.pathname
    .replace('/spa', '')
    .split('/')
    .filter(Boolean);
  if (!query[0] || query[0] === 'addon' || query[0] === 'textura') {
    const { data, users } = api({ type: query[0] });
    list(data, users);
    return;
  }
  if (query[0] === 'content') {
    const name = query[1].replaceAll('-', ' ').toLowerCase()
    const { data, users } = api({ name });
    content(data.find(item => item[0].name.toLowerCase() === name), users);
    return;
  }
  if(query[0] === 'search') {
    const search = (query[1]||'').replaceAll('-', ' ');
    const { data, users } = api({ search });
    list(data, users);
    $('#search').element.element.value = search;
    return;
  }
}

addEventListener('DOMContentLoaded', load);

function descriptionProcess(description) {
  // mi descripcion #enlace*https://ejemplo.com# continuacion de la descripcion
  // mi descripcion <a href="https://ejemplo.com">enlace</a> continuacion de la descripcion

  const result = [];
  const data = description.split(/(#.+\*.+#)/g);
  for (const item of data) {
    if (item.startsWith('#') && item.endsWith('#')) {
      const [text, url] = item.slice(1, -1).split('*');
      result.push(createElementDom('a', { href: url }, text));
    } else {
      result.push(item);
    }
  }
  return result;
}

function searchProp(item, prop){
  if(item[prop] !== undefined) return item[prop];
  if(item.versions.find(v => v[prop] !== undefined)) return item.versions.find(v => v[prop] !== undefined)[prop];
  return undefined;
}

/**
 * @param {[typeof import('../../api/addons.json')['content'][2], boolean][]} data
 * @param {typeof import('../../api/users.json')['content']} users
 */
function list(data, users) {
  for (const [item,show] of data) {
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
    const icon =
      versions.find(v => v.icon)?.icon || '/src/img/proximamente.png';
    const description =
      versions.find(v => v.description)?.description ||
      `Este es un recurso crreado por ${
        collaborators ? `${author}, ${collaborators}` : author
      }`;
    const FinalDate = new Date(versions[0].date);
    const date = `${FinalDate.toLocaleDateString()} ${FinalDate.toLocaleTimeString()}`;

    const data = createElementDom(
      'div',
      { class: 'container' + (item.deprecated ? ' deprecated' : ''), name:item.name, type:item.type, tags:(searchProp(item, 'tags')||[]).join(',') },
      createElementDom('img', { src: icon }),
      createElementDom(
        'div',
        { class: 'data' },
        createElementDom('h2', null, item.name),
        createElementDom(
          'div',
          { class: 'info' },
          createElementDom('p', null, ...descriptionProcess(description))
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
    $('main').append(
      createElementDom(
        'a',
        { href: `/spa/content/${item.name.replaceAll(' ', '-')}`, class:(show ? '' : ' hide') },
        data
      )
    );
  }
}

/**
 * @param {[typeof import('../../api/addons.json')['content'][2], boolean]} item
 * @param {typeof import('../../api/users.json')['content']} users
 */
function content([item, show], users) {
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
  const icon = versions.find(v => v.icon)?.icon || '/src/img/proximamente.png';
  const description =
    versions.find(v => v.description)?.description ||
    `Este es un recurso crreado por ${
      collaborators ? `${author}, ${collaborators}` : author
    }`;
  const FinalDate = new Date(versions[0].date);
  const date = `${FinalDate.toLocaleDateString()} ${FinalDate.toLocaleTimeString()}`;

  const header = createElementDom(
    'div',
    { class: 'header' },
    createElementDom('img', { src: icon }),
    createElementDom(
      'div',
      { class: 'data' },
      createElementDom('h2', null, item.name),
      createElementDom(
        'div',
        { class: 'meta' },
        createElementDom(
          'h5',
          null,
          `Version: ${versions[0].version || '0.0.1'}`
        ),
        createElementDom('h5', { class: 'extra' }, `Creador: ${author}`),
        createElementDom('h5', { class: 'extra large' }, `Fecha: ${date}`),
        item.collaborators?.length && createElementDom(
          'h5',
          { class: 'extra large' },
          `Colaboradores: ${collaborators}`
        )
      )
    )
  );
  const $main = $('main');
  $main.append(header);
  $main.append(
    createElementDom(
      'div',
      { class: 'info' },
      createElementDom('p', null, ...descriptionProcess(description)),
    )
  );
}
