import { createElementDom } from '../modules/dom.js';
import {reload} from '../load/interface.js';

window.addEventListener('popstate', reload);

export function navigate(url) {
  window.history.pushState({}, '', url);
  const event = new Event('popstate');
  window.dispatchEvent(event);
}

export function Link(url, { target = '_self', ...props }, ...childrens) {
  const handleClick = e => {
    const isMainButton = e.button === 0;
    const isModifierKey = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
    const isManegableEvent = target === '_self';

    if (isMainButton && !isModifierKey && isManegableEvent) {
      e.preventDefault();
      navigate(url);
    }
  };
  const $link = createElementDom(
    'a',
    { ...props, target, href: url },
    ...childrens
  );
  $link.addEventListener('click', handleClick);
  return $link;
}
