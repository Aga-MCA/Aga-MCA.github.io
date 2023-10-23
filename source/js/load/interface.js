import interface_ from '/json/interface.json' assert { type: 'json' };

import { $ } from '../$.js';
import { createElementDom } from '../dom.js';

export default function loadInterface() {
	const nav = $('nav#menu');
	interface_.nav.forEach(link => nav.append(createElementDom('a', { href: link[0] }, link[1])));

	const footer = $('footer div.contenedor-footer');
	interface_.footer.forEach(link =>
		footer.append(
			createElementDom('div', { class: 'content-foo' }, [
				createElementDom('h4', null, link[0]),
				createElementDom('a', { class: 'link-s', target: '_blank', href: link[1] }, link[2]),
			])
		)
	);
}
