/**
 * ОБРАБАТЫВАЕМ ДАННЫЕ В НУЖНЫЙ ВИД ДЛЯ ПРИЛОЖЕНИЯ И СОХРАНЯЕМ
 *
 * Слой сервиса предназначен для обработки данных полученных репозиторием или выполнения бизнес-логики.
 *
 * В этом слое преобразуем данные, которые пришли из репозитория в нужный вид.
 * Взаиможействие со стором (сохранение, удаление, преобразование данных) так же происходит тут.
 * Обработка специфических ошибок, которые не может обработать стандартный обработчик HTTP-ошибок
 * так же производятся тут.
 *
 * Экземпляр сервиса является приватным полем контроллера, вызывать методы сервиса может только контроллер.
 */


import PageInstanceRepository from "@/pageInstance/page-instance.repository";
import pageInstanceState from "@/pageInstance/page-instance.state";
import http from "@/axiosConfig/base-axios-config";

export default class PageInstanceService {

    #repository = new PageInstanceRepository()

    async getWorks() {
        pageInstanceState.works = await this.#repository.getWorks()
        // pageInstanceState.verticalWorks = works.filter(work => work.orientation === 'vertical')
        // pageInstanceState.horizontalWorks = works.filter(work => work.orientation === 'horizontal')

        return pageInstanceState.works
    }

    async getWork(id) {
        const work = await this.#repository.getWork(id)

        pageInstanceState.activeWork = work

        return work;
    }
    async updateWorks(id) {
        pageInstanceState.works = await this.#repository.updateWorks(id)

        return pageInstanceState.works
    }

    async getLanguage() {
        const response = await this.#repository.getLanguages()

        return response;
    }

    async getSections() {
        pageInstanceState.sections = await this.#repository.getSections()

        return pageInstanceState.sections;
    }

    async getLocalization() {
        pageInstanceState.content = await this.#repository.getLocalization()
        return await this.#repository.getLocalization();
    }

    async getNews(page) {
        return await this.#repository.getNews(page);
    }
    async getNewsSections() {
        pageInstanceState.newsSections = await this.#repository.getNewsSections();

        return pageInstanceState.newsSections
    }

    async getNewsItem(id) {
        const data = await this.#repository.getNewsItem(id);

        return {
            ...data,
            main_image: {
                width: data.main_image.width,
                height: data.main_image.height,
                src: process.env.VUE_APP_SERVER + data.main_image.src,
            },
            images: data.images.map(image => {
                return {
                    ...image,
                    src: process.env.VUE_APP_SERVER + image.src
                }
            })
        }
    }
}
