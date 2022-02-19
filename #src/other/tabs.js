const tabs = document.querySelectorAll('.tab');
if(tabs && tabs.length > 0) {
	tabs.forEach(tab => {
		tab.addEventListener('click', tab_click)
		const tab__filter__items = tab.querySelectorAll('.tab__filter__item');
		tab__filter__items.forEach((i, index) => {
			i.dataset.index = index;
		})
	})
	function tab_click(e) {
		const tab_filters = this.querySelectorAll('.tab__filter__item');
		const tab__content = this.querySelectorAll('.tab__content__item');
		const event = e.target;
		if(  event.classList.contains('tab__filter__item')  ) {
			const tab_content_item = tab__content[event.dataset.index];
			remove_items([tab_filters, tab__content])
			event.classList.add('_active');
			tab_content_item.classList.add('_active');
		}
	}
}
function remove_items(array) {
	array.forEach(i => {
		i.forEach(item => {
			item.classList.contains('_active') && item.classList.remove('_active')
		})
	})
}
