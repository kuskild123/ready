class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }

  init() {
    // массив объектов
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    // массив DOM-элементов
    this.nodes = [...document.querySelectorAll('[data-da]')];

    // наполнение оbjects объктами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(',');
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
      оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
    .map(({
      breakpoint
    }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
    .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({
          breakpoint
        }) => breakpoint === mediaBreakpoint
        );
      matchMedia.addEventListener('change', () => {
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    });
  }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    } else {
      оbjects.forEach(
        ({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname)) {
            this.moveBack(parent, element, index);
          }
        }
        );
    }
  }

  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === 'first') {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // Функция получения индекса внутри родителя
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return -1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return 1;
          }
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return 1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return -1;
          }
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
let mobile;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  mobile = true;
  document.body.classList.add('_mobile');
} else {
  document.body.classList.add('_desktop');
  mobile = false;
}
const da = new DynamicAdapt("max");  
da.init();


const header = document.querySelector('.header'),
search_hide_items = document.querySelectorAll('.h_search_hide'),
header__search = header.querySelector('.header__search')

if(header) {
	let delay = 0;
	search_hide_items.forEach(i => {
    if(i.classList.contains('header__icon_search') && mobile) {
      return
    }
    i.style.transitionDelay = `${delay}s`
    delay += 0.05;
  })
}
let header_search_open = false;
function header_search( action ) {
	if(action === 'open') {
		search_hide_items.forEach(i => {
			i.classList.add('h_search_hide__hide');
		})
		header__search.classList.add('_show')
		header_search_open = true;
	} else if(action === 'close') {
		search_hide_items.forEach(i => {
			i.classList.remove('h_search_hide__hide');
		})
		header__search.classList.remove('_show')
		header_search_open = false;
	}
}
document.addEventListener('click', function(e) {
	const event = e.target;
	if(header && event.classList.contains('header__icon_search')) {
		header_search('open')
		return
	}
	if(header_search_open == true) {
		if( event.classList.contains('_input_close') || !event.closest('.header__search') ) {
			header_search( 'close' )
			return
		}
	}
	if(event.classList.contains('burger')) {
		document.body.classList.toggle('_burger_open')
	}
})

const vh_50_height = window.screen.height / 2;
let header_fixed = false;
let header_anime = 400;
window.addEventListener('scroll', function() {
  if(window.pageYOffset >= vh_50_height && header_fixed === false) {
    header_fixed = true;
    header.classList.add('_fixed');
  } else if (window.pageYOffset < vh_50_height && header_fixed === true) {
    header_fixed = false;
    header.classList.add('_hide');
    setTimeout(() => {
      header.classList.remove('_hide');
      header.classList.remove('_fixed');
   }, header_anime)
  }
})