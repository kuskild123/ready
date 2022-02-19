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
let accordeons = document.querySelectorAll('.accordeon');
function accordeon_find() {
	accordeons = document.querySelectorAll('.accordeon');
	if(accordeons.length > 0) {
		accordeons.forEach((i) => {			
			if(!i.classList.contains('checked')) {
				const accordeon__items = i.querySelectorAll('.accordeon__item');
				if(accordeon__items.length > 0) {
					accordeon__items.forEach((accordeon, index) => {
						accordeon.addEventListener('click', (e) => acc_click(e, accordeon__items, index))
					});
				}
				i.classList.add('checked');
			}
		})
		function acc_click(e, elms, index) {
			const parent = e.target.closest('.slider__wrapper');
			const el = e.target.closest('.accordeon__item')
			const el_active = e.target.closest('.accordeon__item._active')
			const accordeon_content = el.querySelector('.accordeon__body')
			if(parent) {
				const bullets = parent.querySelectorAll('.swiper-pagination-bullet');
				if(!body.classList.contains('_change')) {
					bullets[index].click()
				}
			}
			if(!el_active) {
				acc_remove_active(elms);
				el.classList.add('_active');
				accordeon_content.style.maxHeight = accordeon_content.scrollHeight + 'px';
			} else if (el) {
				acc_remove_active(elms);
			}
			
		}
		function acc_remove_active(elms) {
			elms.forEach(i => {
				if(i.classList.contains('_active')) {
					i.classList.remove('_active');
					const accordeon_content = i.querySelector('.accordeon__body')
					accordeon_content.style.maxHeight = 0;
				}
			})
		}
	}
}
accordeon_find()
// swiper call
const swipers = document.querySelectorAll('.swiper')
if(swipers.length > 0) {
	swipers.forEach(i => {
		const swiper = new Swiper(i, {
			parallax: false,
			speed: 500,
			autoHeight: true,
        	spaceBetween: 20,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
				dynamicBullets: true,
				dynamicMainBullets: 4,
			},
			autoplay: {
				delay: 7000,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					autoplay: false,
				},
				1015: {
					autoplay: {
						delay: 7000,
						disableOnInteraction: false,
					},
				},
			},
			on: {
				slideChange: () => slide_change(swiper),
			},
		})
	});
}
let autoplay = 7000;
const swipers_2 = document.querySelectorAll('.swiper_v2')
if(swipers_2.length > 0) {
	swipers_2.forEach(i => {
		const swiper = new Swiper(i, {
			autoHeight: true,
			effect: 'fade',
			watchSlidesProgress: true,
			fadeEffect: {
				crossFade: true
			},
			navigation: {
				nextEl: '.slider_2__next',
				prevEl: '.slider_2__prev',
				disabledClass: 'disabled',
			},
			autoplay: {
				delay: autoplay,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					autoplay: false,
				},
				1015: {
					autoplay: {
						delay: 7000,
						disableOnInteraction: false,
						waitForTransition: false,
					},
				},
			},
			pagination: {
				el: ".slider_2__number",
				type: "custom",
				clickable: true,
				renderCustom: function (swiper_el, current, total) {
					let ind_current = 0;
					let ind_total = 0;
					if(current < 9) {ind_current = `0${current}`} else {ind_current = current;}
					if(total < 9) {ind_total = `0${total}`} else {ind_total = total;}
					return `<span class="current">${ind_current}</span><span class="line">/</span><span class="total">${ind_total}</span>`;
				},
			},
			speed: 400,
			on: {
				slideChange: slider_2_change
			}
		})
	});
}
function slider_2_change(swiper) {
	adaptive_manage_slider()
	if (swiper) {
		const el = swiper.el;
		const timeline = el.querySelector('.slider_2__scrollbar .timeline span');
		timeline.classList.remove('effect')
		setTimeout(() => {timeline.classList.add('effect')}, 200)
	}
}

// swiper call end
function slide_change(slider) {
	const parent_el = slider.el.closest('.slider__wrapper');
	const accordeon = parent_el.querySelector('.accordeon');
	if(accordeon) {
		const item = accordeon.querySelectorAll('.accordeon__item')[slider.realIndex];
		item.click()
	}
}

// adaptive slider

const body = document.body;
// addEvent(window, "resize", function_reference);
// function function_reference() {
// 	const width = body.clientWidth;
// 	adaptive_slider(width)
// 	adaptive_manage_slider()
// }
const {availWidth} = window.screen;
// adaptive_slider(availWidth)
let resize_slide_img = false;
let isInsertSlider2 = false;
// function adaptive_slider(width) {
// 	if(width < 1015) {
// 		!body.classList.contains('_change') && body.classList.add('_change');
// 		if(accordeons && !resize_slide_img) {
// 			accordeons.forEach((i) => {
// 				const parent = i.closest('.slider__wrapper');
// 				if(parent) {
// 					const slides = parent.querySelectorAll('.swiper-slide img')
// 					const acc_items = parent.querySelectorAll('.accordeon__item .accordeon__body');
// 					acc_items.forEach((acc, index) => {
// 						if(!acc.querySelector('img')) {
// 							const clone = slides[index].cloneNode()
// 							clone.removeAttribute('data-swiper-parallax-scale')
// 							clone.removeAttribute('style')
// 							acc.append(clone)
// 							resize_slide_img = true;
// 							if(index === 0) {
// 								acc.click()
// 							}
// 						}
// 					});
// 				}
// 			})
// 		}
// 		if(swipers_2 && !isInsertSlider2) {
// 			isInsertSlider2 = true;
// 			swipers_2.forEach(swiper_2_item => {
// 				if(!swiper_2_item.classList.contains('checked')) {
// 					const slider_main = swiper_2_item.closest('.slider_2')
// 					const main_block = slider_main.querySelector('.accordeon__container');
// 					const items = slider_main.querySelectorAll('.swiper-slide');
// 					let swiper_slide_html = '';
// 					items.forEach(i => {
// 						const title = i.querySelector('.slider_2__subtitle').textContent;
// 						const content = i.querySelector('.slider_2__content__left').innerHTML;
// 						const img = i.querySelector('.slider_2__img').src;
// 						swiper_slide_html = swiper_slide_html + `
// 						<div class='accordeon__item'>
// 						<div class="accordeon__title">
// 						<span>${title}</span>
// 						<span class="triangle"></span>
// 						</div>
// 						<div class="accordeon__body">
// 						${content}
// 						<img src="${img}" class="slider__img" alt="">
// 						</div>
// 						</div>	
// 						`
// 					})
// 					main_block.insertAdjacentHTML('beforeend', `
// 						<div class='accordeon accordeon_v2'>
// 						${swiper_slide_html}
// 						</div>		
// 						`);
// 					accordeon_find()
// 					swiper_2_item.classList.add('checked')
// 				}
// 			})
// 		}
// 		accordeon_show_img()
// 	} else {
// 		body.classList.contains('_change') && body.classList.remove('_change')		
// 	}
// }


if(accordeons && !document.body.classList.contains('_change')) {
	accordeons.forEach(i => {
		const item = i.querySelector('.accordeon__item:nth-child(1)')
		item.click()
		item.click()
	})
}
function accordeon_show_img() {
	if(document.body.classList.contains('_change')) {
		accordeons.forEach(i => {
			const img = i.querySelector('img')
			if(img) {
				img.onload = function() {
					i.querySelector('.accordeon__item:nth-child(1)').click()
				}
			}
		})
	}
}
// accordeon_show_img()

const swiper_settings = document.querySelectorAll('.slider_2__settings');
const manage = document.querySelectorAll('.slider_2__settings__block');
function adaptive_manage_slider() {
	if(manage) {
		manage.forEach(i => {
			const current_img_width = i.closest('.swiper_v2').querySelector('img').offsetWidth;
			i.style.flex = `0 0 ${current_img_width}px`
		})
	}
	if(swiper_settings) {
		swiper_settings.forEach(i => {
			const current_img = i.closest('.swiper_v2').querySelector('.swiper-slide-active .slider_2__img');
			i.style.top = `${current_img.offsetHeight}px`;
		})
	}
}

// addEvent(window, "load", adaptive_manage_slider);
