// создадим элемент с прокруткой
let div = document.createElement('div');

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';

// мы должны вставить элемент в документ, иначе размеры будут равны 0
document.body.append(div);
let scrollWidth = div.offsetWidth - div.clientWidth;

div.remove();
console.log(scrollWidth)

const modal_open = document.querySelectorAll('[data-modal]'),
modals = document.querySelectorAll('.modal'),
no_shake_elms = document.querySelectorAll('._no_shake, .header'),
transition_time_modal = 350;
console.log(no_shake_elms)
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
			i.style.paddingRight = scrollWidth + 'px';
		} else if(option === 2) {
			i.style.paddingRight = 0;
		}
	})
}