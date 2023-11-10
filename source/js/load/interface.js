import api from './api.js';
export default async function load() {
  const $root = document.getElementById('root');
  const { App } = await import('../components/App.js');
  $root.appendChild(App());

  const { Nav } = await import('../components/Nav.js');
  Nav();
  updateNav();
}

function isMatch(data, search) {
  return data.toLowerCase().includes(search.toLowerCase());
}

function updateNav() {
  const query = location.pathname.split('/').filter(Boolean);
  const $nav = document.querySelector('nav');
  for (const $item of $nav.querySelectorAll('a')) {
    $item.classList.remove('active');
    if (
      $item.getAttribute('href') ===
      `/${query[0] === 'search' ? '' : query[0] || ''}`
    )
      $item.classList.add('active');
  }
}

export function reload() {
  const query = location.pathname.split('/').filter(Boolean);

  const $content = document.querySelector('div#content');
  if (query[0] === 'content') {
    import('../components/Content.js').then(({ Content }) => {
      const name = query[1].replaceAll('-', ' ').toLowerCase();
      const { data, users } = api({ name });
      $content.classList.remove('hide');
      $content.appendChild(
        Content(
          data.find(item => item[0].name.toLowerCase() === name),
          users
        )
      );
    });
  } else $content.classList.add('hide');

  if (!query.includes('search')) document.querySelector('#search').value = '';
  updateNav();
  if (query[0] === 'addon' || query[0] === 'textura') {
    $content.classList.add('hide');
    for (const $item of document.querySelectorAll('.mc-list-item')) {
      const isTypeMatch = $item.getAttribute('type') === query[0];
      const search = (query[2] || '').replaceAll('-', ' ');
      const isDataMatch = isMatch($item.getAttribute('data'), search);
      const isMatched = isTypeMatch && isDataMatch;
      $item.classList[isMatched ? 'remove' : 'add']('hide');
    }
    return;
  }
  const search = (query[0] === 'search' && query[1] || '').replaceAll('-', ' ');
  for (const $item of document.querySelectorAll('.mc-list-item')) {
    const isMatched = isMatch($item.getAttribute('data'), search);
    $item.classList[isMatched ? 'remove' : 'add']('hide');
  }
}
