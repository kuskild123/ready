const accordeons_items = document.querySelectorAll('.accordeon');
// accordeon
function accordeons(className) {
	className.forEach(acc => {
		acc.addEventListener('click', (e) => acc_click(e, acc))
	})
}
function acc_click(e, acc) {
	const closest_item = e.target.closest('.accordeon__item:not(._active)');
	const closest_item_active = e.target.closest('.accordeon__item._active');
	if(closest_item) {
		acc_items_remove_active(acc);
		closest_item.classList.add('_active')
		const item_content = closest_item.querySelector('.accordeon__item__content');
		item_content.style.maxHeight = item_content.scrollHeight + 'px';
	} else if(closest_item_active) {
		const item_content = closest_item_active.querySelector('.accordeon__item__content');
		item_content.style.maxHeight = 0;
		closest_item_active.classList.remove('_active')
	}
}
function acc_items_remove_active (acc) {
	const active = acc.querySelector('.accordeon__item._active');
	if(active) {
		const item_content = active.querySelector('.accordeon__item__content');
		item_content.style.maxHeight = 0;
		active.classList.remove('_active')
	}
}
accordeons(accordeons_items);
// end accordeon