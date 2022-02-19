var addEvent = function(object, type, callback) {
	if (object == null || typeof(object) == 'undefined') return;
	if (object.addEventListener) {
		object.addEventListener(type, callback, false);
	} else if (object.attachEvent) {
		object.attachEvent("on" + type, callback);
	} else {
		object["on"+type] = callback;
	}
};

addEvent(window, "load", share_func);
function share_click() {
	document.body.classList.toggle('_share_open')
}
function share_func() {
	const share = document.querySelector('.share__btn');

	if(share) {
		share.addEventListener('click', share_click)
	}

	const footer = document.getElementById('t-footer');
	let el_scroll = false;
	if(footer && share) {
		addEvent(window, "scroll", el_scroll_func);
		function el_scroll_func() {
			if(!el_scroll) {
				const el_h = footer.getBoundingClientRect().top,
				window_h = window.innerHeight;
				if(el_h - window_h <= 0) {
					share_click()
					el_scroll = true;
				}
			}

		}
	}
}
