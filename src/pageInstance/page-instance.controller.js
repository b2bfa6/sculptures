/**
 * МАНИПУЛЯЦИИ СО СЛОЕМ VIEW
 *
 * Слой контроллер, содержит приватным полем экземпляр сервиса.
 * Контроллер импортируется в слой view.
 *
 * Минимальная реализация контроллера - повторяем все методы сервиса, вызывая их, и возвращая полученное значение.
 *
 * В этом слое можно создавать специфические методы для обработки произвольных событий из слоя view.
 */

import PageInstanceService from "@/pageInstance/page-instance.service";

class PageInstanceController {

    #service = new PageInstanceService()

    async getWorks() {
        return await this.#service.getWorks()
    }
    async getWork(id) {
        return await this.#service.getWork(id)
    }
    async updateWorks(id) {
        return await this.#service.updateWorks(id)
    }
    async getLocalization() {

        return await this.#service.getLocalization();
    }
    async getSections() {
        return await this.#service.getSections();
    }
    async getNewsSections() {
        return await this.#service.getNewsSections();
    }
    async getLanguages() {
        const response = await this.#service.getLanguage()

        return response;
    }

    async getNews(page) {
        const response = await this.#service.getNews(page)

        return response;
    }
    async getNewsItem(id) {
        const response = await this.#service.getNewsItem(id)

        return response;
    }
}

export default new PageInstanceController()
