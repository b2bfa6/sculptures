import {reactive} from 'vue'
/**
* {Object} pageInstanceState
* {Object} pageInstanceState.columnWidth - размеры колонок для каждой страницы
* {string} pageInstanceState.coefficient - коэффициент увеличения картинок в высоту (процентный паддинг)
* {number} pageInstanceState.windowWidth - Текущая ширина окна браузера
* {Array} pageInstanceState.currentColumnWidth - Размеры колонок для текущей страницы
* {number|null} pageInstanceState.activeColumn - Номер колонки, на который делается больший акцент
* {string} pageInstanceState.language - Язык сайта
* {Boolean} pageInstanceState.isLoading - Идет ли загрузка страницы
* {Boolean} pageInstanceState.isLoaded - Завершилась ли загрузка страницы. Нужна чтобы анимация на мобильной версии не срабатывала повторно
* {Boolean} pageInstanceState.lock - Блокировка скролла во время анимации и переключения страниц
* {Array} pageInstanceState.content - Текстовые данные сайта
* {Object} pageInstanceState.animation - Общая анимация
* {Array} pageInstanceState.works - Все работы
* {Array} pageInstanceState.activeWork - Активная работа при показе в галереи
 * */
const pageInstanceState = reactive({
    columnWidth: {
        home: ["50%", "25%", "25%"],
        single: ["210px", "auto", "170px"],
        singleNews: ["210px", "auto", "200px"],
        about: ["auto", "170px"],
        gallery: ["220px", '43.5%', '43.5%'],
    },
    coefficient: 3,
    windowWidth: 1920,
    currentColumnWidth: [],
    activeColumn: [],
    activeBlock: null,
    language: "ru",
    isLoading: true,
    isLoaded: false,
    lock: false,
    content: [],
    animation: {
        done: false,
        delay: 600
    },
    works: [],
    activeWork: [],
    sections: [],
    newsSections: [],
    currentNewsSection: "",
    activeSection: "",
    activeNewsSection: {},
    activeWorkDescription: "",
    activeNewsDescription: "",
    totalToggler: "Все работы",
    currentNewsPage: 1,
    currentColumnNewsPage: 1,
    isLoadingNews: false,
    firstNewsColumn: [],
    secondNewsColumn: [],
    newsColumn: [],
    maxNewsScrollTop: 0,
    newsItem: {}
})

// Изменяет значение ширины окна браузера при событии resize
export function pageStateInit() {
    pageInstanceState.windowWidth = document.documentElement.clientWidth
    window.addEventListener('resize', () => {
        pageInstanceState.windowWidth = document.documentElement.clientWidth
    })
}


export default pageInstanceState
