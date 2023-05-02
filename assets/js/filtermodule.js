export default (function (btnParentNode, source) {
	console.log('Module imported succesfully');
	console.log('Buttons:', btnParentNode);
	console.log('Images:', source);

	let types = Array.from(source)
		.flatMap((src) => {
			if (
				src.getAttribute('data-filter') !== null &&
				src.getAttribute('data-filtertext') !== null
			) {
				const pole = src
					.getAttribute('data-filter')
					.split(';')
					.map((n, index) => {
						return {
							[n]: src.getAttribute('data-filtertext').split(';')[index],
						};
					});
				return pole;
			}
		})
		.filter((a) => a !== undefined && a !== null);

	console.log(types);

	types = types.reduce((prev, current) => {
		return Object.assign(prev, current);
	}, {});

	let types_keys = Object.keys(types);
	console.log(types_keys);

	console.log(types);

	btnParentNode.append(
		...types_keys.map((el) => {
			const newel = document.createElement('a');
			newel.classList.add('btn', 'btn__filter');
			newel.setAttribute('data-filter', el);
			newel.textContent = types[el];
			newel.addEventListener('click', (e) => {
				e.preventDefault();
				reset(btnParentNode, source);
				for (var element of Array.from(source)) {
					if (element.getAttribute('data-filter') == null) {
						element.classList.add('hide');
					} else if (!element.getAttribute('data-filter').includes(el)) {
						element.classList.add('hide');
					}
				}
				const currentSearchParams = new URLSearchParams(window.location.search);
				currentSearchParams.set('search', el);
				window.history.pushState({}, '', '?' + currentSearchParams);
				e.target.classList.add('btn__filter--active');
			});
			return newel;
		})
	);

	document.addEventListener('DOMContentLoaded', (e) => {
		const currentSearchParams = new URLSearchParams(window.location.search);
		const currentSearch = currentSearchParams.get('search');
		for (var u of Array.from(btnParentNode.children)) {
			if (
				u.getAttribute('data-filter') == currentSearch &&
				currentSearch !== 'all'
			) {
				u.click();
			}
		}
	});

	if (btnParentNode !== null) {
		for (var x of Array.from(btnParentNode.children)) {
			if (x.getAttribute('data-filter') === 'all') {
				x.addEventListener('click', (e) => {
					e.preventDefault();
					reset(btnParentNode, source);
					const currentSearchParams = new URLSearchParams(
						window.location.search
					);
					currentSearchParams.set(
						'search',
						e.target.getAttribute('data-filter')
					);
					window.history.pushState({}, '', '?' + currentSearchParams);
					e.target.classList.add('btn__filter--active');
				});
			}
		}
	}
});

function reset(btnParentNode, source) {
	if (btnParentNode !== null && source !== null) {
		for (var l of Array.from(btnParentNode.children)) {
			l.classList.remove('btn__filter--active');
		}
		for (var i of Array.from(source)) {
			i.classList.remove('hide');
		}
	}
}
