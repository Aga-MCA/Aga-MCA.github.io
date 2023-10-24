export default function load() {
	const $root = document.getElementById('root');
	$root.innerHTML = '';
	import('../components/App.js').then(({ App }) => {
		$root.appendChild(App());
	});
}
