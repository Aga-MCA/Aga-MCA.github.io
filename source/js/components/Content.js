import { createElementDom } from '../modules/dom.js';
import { Description } from './Description.js';
import { Link } from './Link.js';

function updateVersions(
  default_version,
  $data = document.querySelector('div.mc-data')
) {
  const [CONTENT, addonName, version = default_version] = location.pathname
    .split('/')
    .filter(Boolean);
  const $versions = $data.querySelectorAll('a');
  for (const $version of $versions) {
    $version.classList.remove('active');
    if ($version.getAttribute('version') === version)
      $version.classList.add('active');
  }
}
function updateInfo(
  default_version,
  list_$info = document.querySelectorAll('div.mc-info')
) {
  const [CONTENT, addonName, version = default_version] = location.pathname
    .split('/')
    .filter(Boolean);
  for (const $info of list_$info) {
    $info.classList.add('hide');
    if ($info.getAttribute('version') === version)
      $info.classList.remove('hide');
  }
}

/**
 * @param {[typeof import('../../../api/addons.json')['content'][2], boolean]} data
 * @param {typeof import('../../../api/users.json')['content']} users
 */
function updateContent([item, show], users) {
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
  updateVersions(versions[0].version);
  updateInfo(versions[0].version);
}

/**
 * @param {[typeof import('../../../api/addons.json')['content'][2], boolean]} data
 * @param {typeof import('../../../api/users.json')['content']} users
 */
export function Content([item, show], users) {
  const $content = document.querySelector('div#content');
  const pre_$div = $content.querySelector('div');
  if (pre_$div) {
    if (pre_$div.getAttribute('name') === item.name) {
      updateContent([item, show], users);
      return pre_$div;
    }
  }
  $content.innerHTML = '';

  const versionsInv = item.versions.sort((a, b) => {
    const a1 = a.version.split('.').map(Number);
    const b1 = b.version.split('.').map(Number);
    if (a1[0] > b1[0]) return 1;
    if (a1[0] < b1[0]) return -1;
    if (a1[1] > b1[1]) return 1;
    if (a1[1] < b1[1]) return -1;
    if (a1[2] > b1[2]) return 1;
    if (a1[2] < b1[2]) return -1;
    return 0;
  });
  const versions = [];
  for (let i = 0; i < versionsInv.length; i++) {
    if (i !== 0) versionsInv[i] = { ...versionsInv[i - 1], ...versionsInv[i] };
    versions.unshift(versionsInv[i]);
  }
  const author = users.find(u => u.id === item.author)?.name || 'Anonimo';
  const collaborators =
    item.collaborators
      ?.map(c => users.find(u => u.id === c)?.name || '')
      .join(', ') || '';
  const icon = item.icon || '/source/image/proximamente.png';

  const $header = createElementDom(
    'div',
    { class: 'mc-header' },
    Link('/', { class: 'mc-button' }, '<'),
    createElementDom('p', null, `Ver "${item.name}"`)
  );
  const $data = createElementDom(
    'div',
    { class: 'mc-data' },
    createElementDom('img', { src: icon, alt: item.name, class: 'icon' }),
    createElementDom(
      'section',
      null,
      createElementDom('p', { class: 'title' }, 'Versiones'),
      ...versions.map(v =>
        Link(
          `/content/${item.name.replaceAll(' ', '-')}/${v.version}`,
          { class: 'mc-button', version: v.version },
          v.version
        ))
    ),
    createElementDom(
      'section',
      null,
      createElementDom('p', { class: 'title' }, 'Autor'),
      createElementDom('p', null, author)
    ),
    collaborators && createElementDom(
      'section',
      null,
      createElementDom('p', { class: 'title' }, 'Colaboradores'),
      createElementDom('p', null, collaborators)
    ),
  );

  updateVersions(versions[0].version, $data);
  const list_$info = versions.map(version => {
    const $images = (version.images || [])+'' && createElementDom(
      'section',
      null,
      createElementDom('p', { class: 'title' }, 'Imagenes'),
      ...(version.images || []).map(img => {
        const $img = createElementDom('img', {
          src: img.url,
          alt: img.description,
          class: 'image',
        });
        return $img;
      })
    );
    const $description = createElementDom(
      'section',
      null,
      createElementDom('p', { class: 'title' }, 'Descripcion'),
      Description(
        version.description ||
          `Este es un recurso crreado por ${
            collaborators ? `${author}, ${collaborators}` : author
          }`
      )
    );
    const $changes = createElementDom(
      'section',
      null,
      createElementDom('p', { class: 'title' }, 'Cambios'),
      version.changes && version.changes.length
        ? createElementDom(
            'ul',
            null,
            ...version.changes.map(change =>
              createElementDom('li', null, change)
            )
          )
        : 'No se registaron los cambios'
    );
    const $download = createElementDom(
      'section',
      null,
      createElementDom('p', { class: 'title' }, 'Descargar'),
      createElementDom(
        'a',
        {
          href: version.url,
          class: 'mc-button',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Descargar'
      )
    );
    return createElementDom(
      'div',
      { class: 'mc-info', version: version.version },
      $images,
      $description,
      $changes,
      $download
    );
  });
  updateInfo(versions[0].version, list_$info);

  const $data_info = createElementDom(
    'div',
    { class: 'data-info' },
    $data,
    ...list_$info
  );

  return createElementDom('div', { name: item.name }, $header, $data_info);
}
