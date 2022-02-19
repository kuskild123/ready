let mobile;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	mobile = true;
	document.body.classList.add('_mobile');
} else {
	document.body.classList.add('_desktop');
	mobile = false;
}

// tooltips
if(mobile === false) {
	function tool_create(classes, position, theme) {
		const elms = document.querySelectorAll(classes);
		if(elms && elms.length > 0) {
			elms.forEach(classes_item => {
				const attr = classes_item.dataset.tool;
				classes_item.insertAdjacentHTML('afterbegin', `<div class="tooltip ${theme + ' ' + position}">${attr}</div>`)
			})
		}
	}

	tool_create('.tool', 'left', 'light');
}

// header
const header = document.querySelector('.header'),
mt_h = document.querySelectorAll('.mt_h'),
burger = header.querySelector('.burger');

mt_h.forEach(i => {
	i.style.paddingTop = header.offsetHeight + 20 + 'px';

})
burger.addEventListener('click', burger_event);
function burger_event(e) {
	e.currentTarget.classList.toggle('_active')
}

// slider
function removeElms(elms, i) {
	const index = parseInt(i) + 1;
	const active = document.querySelector(`${elms}._active`);
	if(active) {
		active.classList.remove('_active')
	}
	if(index && active) {
		const current_el = document.querySelector(`${elms}:nth-child(${index})`);
		console.log(index)
		current_el && current_el.classList.add('_active')
	}
}
const video_back = document.querySelectorAll('.video_back');
if(video_back) {
	const pagination = document.querySelector('.pagination');
	video_back.forEach((i, index) => {
		pagination.insertAdjacentHTML('beforeend', `<div data-index="${index}" onclick="pagination_click(this)" class="pagination__item ${index === 0? '_active' : ''}"></div>`)
	})
	const items = ['video_back', 'content__item', 'pagination__item'];
	function pagination_click(el) {
		const index = el.dataset.index;
		if(!el.classList.contains('_active')) {
			change_slide(index);
		} 
	}
	function change_slide(index) {
		items.forEach(i => {
			removeElms(`.${i}`, index);
		})
	}
}


