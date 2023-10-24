export function SPA(event, url) {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({},'', url);
  loadPage();
}

function loadPage() {
  import('./interface.js').then(({ load }) => load());
}

window.onpopstate = loadPage;