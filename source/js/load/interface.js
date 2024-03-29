import api from './api.js';
import translate from "./translate.js";

export default async function load() {
  await translate()
  const { App } = await import('../components/App.js');
  const { Nav } = await import('../components/Nav.js');
  const $root = document.querySelector('#root');
  Nav();
  const $app = await App()
  $app && $root.appendChild($app);
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
      $item.getAttribute('href').split('/')[1] === query[0]
    )
      $item.classList.add('active');
  }
}

export function reload() {
  const query = location.pathname.split('/').filter(Boolean);

  const $root = document.querySelector('div#root');
  const $start = document.querySelector('div#start');
  const $content = document.querySelector('div#content');
  $root.classList.add('hide');
  $start.classList.add('hide');
  $content.classList.add('hide');
  if (query[0] === 'content') {
    import('../components/Content.js').then(async ({ Content }) => {
      const name = query[1].replaceAll('-', ' ').toLowerCase();
      const { data, users } = await api({ name });
      $content.classList.remove('hide');
      $content.appendChild(
        Content(
          data.find(item => item[0].name.toLowerCase() === name),
          users
        )
      );
    });
  }

  if (!query.includes('search')) document.querySelector('#search').value = '';
  if (query[0] === 'all' || query[0] === 'addon' || query[0] === 'textura') {
    updateNav();
    $root.classList.remove('hide');
    for (const $item of document.querySelectorAll('.mc-list-item')) {
      const isTypeMatch =
        $item.getAttribute('type') === query[0] || query[0] === 'all';
      const search = (query[2] || '').replaceAll('-', ' ');
      const isDataMatch = isMatch($item.getAttribute('data'), search);
      const isMatched = isTypeMatch && isDataMatch;
      $item.classList[isMatched ? 'remove' : 'add']('hide');
    }
    return;
  }
  $start.classList.remove('hide');
}
