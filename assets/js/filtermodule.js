export default (function (btnParentNode, source) {
	console.log('Module imported succesfully');
	console.log('Buttons:', btnParentNode);
	console.log('Images:', source);

	let types = Array.from(source)
		.flatMap((src) => {
			if (
				src.getAttribute('data-filtertext') !== null
			) {
				const pole = src
					.getAttribute('data-filtertext')
					.split(';')
					.map((n, index) => {
						return n;
					});
				return pole;
			}
		})
		.filter((a) => a !== undefined && a !== null);

	console.log(types);

	types = Array.from(new Set(types));
	
	console.log(types);

	btnParentNode.append(
		...types.map((el) => {
			const newel = document.createElement('a');
			newel.classList.add('btn', 'btn__filter');
			newel.setAttribute('data-filtertext', el);
			newel.setAttribute('data-filter', textTransform(el));
			newel.textContent = el;
			newel.addEventListener('click', (e) => {
				e.preventDefault();
				reset(btnParentNode, source);
				for (var element of Array.from(source)) {
					if (element.getAttribute('data-filtertext') == null) {
						element.classList.add('hide');
					} else if (!element.getAttribute('data-filtertext').includes(el)) {
						element.classList.add('hide');
					}
				}
				const currentSearchParams = new URLSearchParams(window.location.search);
				currentSearchParams.set('search', newel.getAttribute("data-filter"));
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
			if (x.getAttribute('data-filtertext') === 'all') {
				x.setAttribute("data-filter", "all");
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

function textTransform(text){

	text = text.toLowerCase();
	text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //odstranění háčků a čárek
	text = text.replaceAll(" ","-");
	return text;
}

