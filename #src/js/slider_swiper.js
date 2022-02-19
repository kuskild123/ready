const loader = document.querySelector('.loader');

// mobile
let mobile;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	mobile = true;
	document.body.classList.add('_mobile');
} else {
	mobile = false;
	document.body.classList.add('_desktop');
}
let autoplay_time = 7000;
const autoplay_s = autoplay_time / 1000;
const timeout_slider = document.getElementById('timeout_slider'),
timeout_slider_count = document.getElementById('timeout_slider_count');


// swiper
const swiper = new Swiper('.swiper_slider__1', {
	speed: 1400,
	parallax: true,
	autoplay: {
		delay: autoplay_time,
		disableOnInteraction: false,
	},
	loop: false,
	mousewheel: {
	},
	navigation: {
		nextEl: '.btn_right',
		prevEl: '.btn_left',
		disabledClass: 'disabled'
	},
	scrollbar: {
		el: '.scrollbar__item',
		dragClass: 'scrollbar__drag',
		draggable: true,
	},
	pagination: {
		el: '.swiper__pagination',
		type: 'bullets',
		clickable: true,
		bulletActiveClass: '_active',
		bulletClass: 'swiper-pagination-bullet',
		dynamicBullets: true,
	},
	on: {
		slideChangeTransitionEnd: autoplay_time_func,
		init: load_content
	}
});
swiper.autoplay.stop();
let interval = false,
paused_slider = false;
function autoplay_time_func() {
	if(!paused_slider) {
		timeout_slider.style.animation = 'none';
		if(interval) {
			clearInterval(interval);
			timeout_slider_count.textContent = 0;
		}
		setTimeout(() => {
			start_autoplay();
		}, 10)
	}
}
function start_autoplay() {
	timeout_slider.style.animation = `timeout ${autoplay_s}s linear forwards`;
	let slide_count = 0;
	interval = setInterval(() => {
		if(slide_count !== autoplay_s && !paused_slider) {
			slide_count++;
			timeout_slider_count.textContent = slide_count;
		}
	}, 1000)
}
function slider_pause() {
	timeout_slider.style.animationPlayState = `paused`;
	paused_slider = true;
	swiper.autoplay.stop();
}
function slider_play() {
	timeout_slider.style.animationPlayState = `running`;
	paused_slider = false;
	swiper.autoplay.start();
	autoplay_time_func()
}
const swiper_2 = new Swiper('.swiper_slider__2', {
	parallax: true,
	pagination: {
		el: '#num_pagination',
		type: 'custom',
		renderCustom: function(swiper, current, total) {
			let current_count;
			let total_count;
			if(current < 10) {
				current_count = `0${current}`;
			} else {
				current_count = current;
			}
			if(total < 10) {
				total_count = `0${total}`;
			} else {
				total_count = total;
			}

			return `<span class="current">${current_count}</span><span class="decor"></span><span class="total">${total_count}</span>`;
		}
	},
})
swiper.controller.control = swiper_2;

// burger

document.body.addEventListener('click', document_click);
function document_click(e) {
	const event = e.target;
	// burger
	if(event.classList.contains('burger')) {
		document.body.classList.toggle('_burger_open');
	}
	// paused
	if(event.classList.contains('slider_state')) {
		if(event.classList.contains('_play')) {
			slider_pause();
			event.className = 'slider_state _paused'
		} else if(event.classList.contains('_paused')) {
			slider_play();
			event.className = 'slider_state _play'
		}
	}
}

function load_content() {
	document.body.onload = function() {
		loader.classList.add('_hide');
		setTimeout(() => {
			swiper.autoplay.start();
			autoplay_time_func();
			loader.remove()
		}, 1000)
	}
}
// создадим элемент с прокруткой
let div = document.createElement('div');

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';
document.body.append(div);
let scrollWidth = div.offsetWidth - div.clientWidth;

div.remove();


const modal_open = document.querySelectorAll('[data-modal]'),
modals = document.querySelectorAll('.modal'),
no_shake_elms = document.querySelectorAll('._no_shake'),
transition_time_modal = 350;
// events
if(modals) {
	modal_open.forEach(i => {
		i.addEventListener('click', modal_open_click);
	})
	modals.forEach(i => {
		i.addEventListener('click', modal_click);
		const modal_window = i.querySelector('.modal__window');
	})
	// functions
	function modal_open_click (e) {
		const modal_active = document.querySelector('.modal.active');
		modal_active && modal_active.classList.remove('_active')
		e.preventDefault();
		const str = 'modal_';
		const current_modal_id = str + this.dataset.modal
		const current_modal = document.getElementById(current_modal_id);
		current_modal.classList.add('_active');
		document.body.classList.add('_close')
		no_shake(1);
	}
	function modal_click(e) {
		const event = e.target;
		if(this.classList.contains('_active')) {
			if( !event.closest('.modal__window') || event.classList.contains('_m_close') ) {
				this.classList.remove('_active');
				setTimeout(() => {
					no_shake(2);
					document.body.classList.remove('_close')
				}, transition_time_modal)
			}
		}
	}
}

function no_shake(option) {
	no_shake_elms.forEach(i => {
		if(option === 1) {
			i.paddingRight = scrollWidth;
		} else if(option === 2) {
			i.paddingRight = 0;
		}
	})
}
